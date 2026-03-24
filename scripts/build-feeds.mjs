// Build-time feed fetcher — runs during Netlify build to bake RSS data into a static JSON file.
// Uses a headless browser (Playwright) as fallback for Cloudflare-protected feeds.

import RSSParser from "rss-parser";
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(__dirname, "..", "feeds.config.json");
const OUTPUT_PATH = join(__dirname, "..", "public", "feeds-data.json");

const parser = new RSSParser();

// Browser-like headers for normal fetch attempts
const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Accept: "application/rss+xml, application/xml, text/xml, */*",
  "Accept-Language": "en-US,en;q=0.9",
};

// Filtered feeds — RSS feeds that need post-fetch filtering by URL path or category
const FILTERED_FEEDS = {
  "ec-digital-news": {
    url: "https://digital-strategy.ec.europa.eu/en/rss.xml",
    source: "EU Commission Digital",
    sourceUrl: "https://digital-strategy.ec.europa.eu",
    filter: (item) => (item.link || "").includes("/en/news/"),
  },
  "eulawblog-dataprotection": {
    url: "https://www.europeanlawblog.eu/rss.xml",
    source: "European Law Blog",
    sourceUrl: "https://www.europeanlawblog.eu",
    filter: (item) => (item.categories || []).some((c) =>
      c.toLowerCase().includes("data protection") || c.toLowerCase().includes("digital governance")
    ),
  },
  "eulawblog-ai": {
    url: "https://www.europeanlawblog.eu/rss.xml",
    source: "European Law Blog",
    sourceUrl: "https://www.europeanlawblog.eu",
    filter: (item) => (item.categories || []).some((c) =>
      c.toLowerCase().includes("artificial intelligence")
    ),
  },
  "proton-privacy-news": {
    url: "https://proton.me/blog/feed",
    source: "Proton Blog",
    sourceUrl: "https://proton.me/blog",
    filter: (item) => (item.categories || []).some((c) =>
      c.toLowerCase().includes("privacy news")
    ),
  },
  "fcc-tmt": {
    urls: [
      "https://api2.fcc.gov/api/exp/v1.0.0/edocspublic/rss/docTypes/News_Release",
      "https://api2.fcc.gov/api/exp/v1.0.0/edocspublic/rss/docTypes/Statement",
      "https://api2.fcc.gov/api/exp/v1.0.0/edocspublic/rss/docTypes/RO_NPRM",
    ],
    source: "FCC",
    sourceUrl: "https://www.fcc.gov",
    filter: (item) => {
      const text = (item.title || "").toLowerCase();
      const keywords = /broadband|spectrum|telecom|wireless|5g|6g|internet|net neutrality|digital|online safety|media ownership|broadcast|satellite|robocall|privacy|data protection|cybersecurity|artificial intelligence|open internet|section 230|big tech|social media|content moderation|streaming|mobile|merger|antitrust|tiktok|huawei|china/;
      return keywords.test(text);
    },
  },
};

// Override bad/generic feed titles
const SOURCE_OVERRIDES = {
  "https://www.edps.europa.eu/feed/news_en": "EDPS News",
  "https://www.euractiv.com/sections/tech/feed": "Euractiv Tech",
  "https://www.theguardian.com/world/privacy/rss": "The Guardian: Privacy",
  "https://www.theguardian.com/world/surveillance/rss": "The Guardian: Surveillance",
  "https://www.accessnow.org/feed/": "Access Now",
  "https://edri.org/feed/": "EDRi",
  "https://bigbrotherwatch.org.uk/feed/": "Big Brother Watch",
  "https://www.theregister.com/headlines.atom": "The Register",
  "https://www.theverge.com/rss/index.xml": "The Verge",
  "https://techcrunch.com/feed/": "TechCrunch",
  "http://newsrss.bbc.co.uk/rss/newsonline_uk_edition/technology/rss.xml": "BBC Tech",
  "https://www.derstandard.de/rss/web": "Der Standard",
  "https://feeds.bloomberg.com/technology/news.rss": "Bloomberg Technology",
  "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml": "NYT Technology",
  "https://www.technologyreview.com/feed/": "MIT Technology Review",
  "https://www.schneier.com/feed/atom/": "Schneier on Security",
  "https://www.eff.org/rss/updates.xml": "EFF",
  "https://epic.org/feed/": "EPIC",
  "https://therecord.media/feed/": "The Record",
  "https://openrss.org/feed/www.reuters.com/technology/": "Reuters Technology",
  "https://rss.arxiv.org/rss/cs.CY": "arXiv cs.CY",
  "https://www.luizasnewsletter.com/feed": "Luiza's Newsletter",
  "https://www.decodingdiscontinuity.com/feed": "Decoding Discontinuity",
  "https://newsletter.safe.ai/feed": "AI Safety Newsletter",
  "https://brief.montrealethics.ai/feed": "The AI Ethics Brief",
  "https://artificialintelligenceact.substack.com/feed": "EU AI Act Newsletter",
  "https://www.theguardian.com/technology/artificialintelligenceai/rss": "The Guardian: AI",
  "https://ainowinstitute.org/feed": "AI Now Institute",
  "https://news.mit.edu/topic/mitmachine-learning-rss.xml": "MIT News: ML",
  "https://www.theregister.com/software/ai_ml/headlines.atom": "The Register: AI/ML",
  "https://www.404media.co/rss/": "404 Media",
  "https://www.wired.com/feed/category/security/latest/rss": "WIRED Security",
  "https://netzpolitik.org/feed/": "netzpolitik.org",
  "https://noyb.eu/en/rss": "noyb",
  "https://www.privacyguides.org/posts/tag/news/feed/": "Privacy Guides",
  "https://www.privacyguides.org/posts/tag/articles/feed/": "Privacy Guides",
  "https://www.mozillafoundation.org/en/blog/rss/": "Mozilla Foundation",
  "https://themarkup.org/feeds/rss.xml": "The Markup",

  "https://ejlt.org/index.php/ejlt/gateway/plugin/WebFeedGatewayPlugin/atom": "EJLT",
  "https://cppa.ca.gov/feed": "CPPA",
  "https://api2.fcc.gov/api/exp/v1.0.0/edocspublic/rss/docTypes/Statement": "FCC",
  "https://api2.fcc.gov/api/exp/v1.0.0/edocspublic/rss/docTypes/RO_NPRM": "FCC",

  "https://api2.fcc.gov/api/exp/v1.0.0/edocspublic/rss/docTypes/News_Release": "FCC",
  "https://api2.fcc.gov/api/exp/v1.0.0/edocspublic/rss/bureaus/MB": "FCC",
  "https://api2.fcc.gov/api/exp/v1.0.0/edocspublic/rss/bureaus/EB": "FCC",
  "https://api2.fcc.gov/api/exp/v1.0.0/edocspublic/rss/bureaus/WTB": "FCC",
  "https://api2.fcc.gov/api/exp/v1.0.0/edocspublic/rss/bureaus/OET": "FCC",
  "https://www.theguardian.com/technology/rss": "The Guardian: Technology",
  "https://www.scmp.com/rss/36/feed": "South China Morning Post: Tech",
  "https://arstechnica.com/feed/": "Ars Technica",
  "https://krebsonsecurity.com/feed/": "Krebs on Security",
  "https://cdt.org/feed/": "Center for Democracy and Technology",
  "https://cyberscoop.com/feed/": "CyberScoop",
  "https://importai.substack.com/feed": "Import AI",
  "https://www.cnil.fr/en/rss.xml": "CNIL",
  "https://gdprhub.eu/index.php?title=Special:RecentChanges&feed=rss": "GDPRhub",
  "https://www.nist.gov/news-events/news/rss.xml": "NIST",
  "https://www.oaic.gov.au/rss": "OAIC Australia",
  "https://www.justsecurity.org/feed/": "Just Security",
  "https://algorithmwatch.org/en/feed/": "AlgorithmWatch",
  "https://www.debevoisedatablog.com/feed/": "Debevoise Data Blog",
  "https://gdprhub.eu/index.php?title=Special:NewPages&feed=atom&hideredirs=1&limit=10&render=1": "GDPRhub",
};

// Custom scrapers for sites without RSS feeds
const CUSTOM_SCRAPERS = {
  "ico.org.uk": {
    type: "ico",
    source: "ICO",
    sourceUrl: "https://ico.org.uk",
    apiUrl: "https://ico.org.uk/api/search",
    rootPageId: 2816,
  },
  "iapp.org/gdpr+aiact": {
    type: "iapp",
    source: "IAPP",
    sourceUrl: "https://iapp.org",
    laws: ["GDPR", "EU AI Act"],
  },
  "iapp.org/ccpa": {
    type: "iapp",
    source: "IAPP",
    sourceUrl: "https://iapp.org",
    laws: ["CCPA/CPRA"],
  },
  "iapp.org/global": {
    type: "iapp",
    source: "IAPP",
    sourceUrl: "https://iapp.org",
    laws: ["LGPD", "PIPL"],
  },
  "simmons/eu": {
    type: "simmons",
    source: "Simmons & Simmons",
    sourceUrl: "https://www.simmons-simmons.com",
    jurisdiction: "European Union",
  },
  "simmons/uk": {
    type: "simmons",
    source: "Simmons & Simmons",
    sourceUrl: "https://www.simmons-simmons.com",
    jurisdiction: "UK",
  },
  "simmons/global": {
    type: "simmons",
    source: "Simmons & Simmons",
    sourceUrl: "https://www.simmons-simmons.com",
    jurisdiction: "Global",
  },
  "simmons/me": {
    type: "simmons",
    source: "Simmons & Simmons",
    sourceUrl: "https://www.simmons-simmons.com",
    jurisdiction: "Middle East",
  },
  "twobirds/tmt": {
    type: "twobirds",
    source: "Bird & Bird",
    sourceUrl: "https://www.twobirds.com",
    sector: "Technology & Communications",
  },
  "reuters/cyber": {
    type: "reuters-sitemap",
    source: "Reuters",
    sourceUrl: "https://www.reuters.com",
    topic: "cybersecurity",
  },
  "reuters/privacy": {
    type: "reuters-sitemap",
    source: "Reuters",
    sourceUrl: "https://www.reuters.com",
    topic: "data-privacy",
  },
  "cyberscoop": {
    type: "wp-api",
    source: "CyberScoop",
    sourceUrl: "https://cyberscoop.com",
    apiBase: "https://cyberscoop.com/wp-json/wp/v2/posts",
    perPage: 100,
  },
  "cyberscoop/ai": {
    type: "wp-api",
    source: "CyberScoop AI",
    sourceUrl: "https://cyberscoop.com",
    apiBase: "https://cyberscoop.com/wp-json/wp/v2/posts",
    perPage: 100,
    category: 6955,
  },
  lawfare: {
    type: "playwright-scrape",
    source: "Lawfare",
    sourceUrl: "https://www.lawfaremedia.org",
  },
  "curia/pending": {
    type: "playwright-scrape",
    source: "CJEU (New Cases)",
    sourceUrl: "https://infocuria.curia.europa.eu",
    sort: "INTRODUCTION_DATE-DESC",
    statusFilter: "Pending",
  },
  "curia/closed": {
    type: "playwright-scrape",
    source: "CJEU (Decided Cases)",
    sourceUrl: "https://infocuria.curia.europa.eu",
    sort: "CLOSE_DATE-DESC",
    statusFilter: "Closed",
  },
  "freshfields-tq": {
    type: "sitemap-scrape",
    source: "Freshfields TQ",
    sourceUrl: "https://technologyquotient.freshfields.com",
    sitemapUrl: "https://technologyquotient.freshfields.com/sitemap",
    urlPattern: "/post/",
  },
};

let browser = null;

function decodeEntities(text) {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&apos;/g, "'")
    .replace(/&#8216;/g, "\u2018").replace(/&#8217;/g, "\u2019")
    .replace(/&#8220;/g, "\u201C").replace(/&#8221;/g, "\u201D")
    .replace(/&#8211;/g, "\u2013").replace(/&#8212;/g, "\u2014")
    .replace(/&#\d+;/g, m => String.fromCharCode(parseInt(m.slice(2, -1))))
    .trim();
}

function cleanSnippet(text, maxLen) {
  let s = decodeEntities(text)
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^(illustration|image|photo|picture|credit)[:\s].{0,80}\n?/i, "")
    .replace(/^arXiv:\S+\s+Announce Type:\s*\w+\s*/i, "")
    .replace(/^Abstract:\s*/i, "")
    .replace(/^[\w]+:\s*Created page with\s*/i, "")
    .replace(/\{\{[^}]*\}\}/g, "")
    .replace(/\|[A-Za-z_]+=\s*/g, " ")
    .replace(/\[\[[^\]]*\]\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (s.length <= maxLen) return s;
  const cut = s.lastIndexOf(" ", maxLen);
  return s.slice(0, cut > 0 ? cut : maxLen) + "\u2026";
}

function extractGDPRhubSnippet(raw) {
  // Extract the description between the end of the DPAdecisionBOX template and == English Summary ==
  const afterBox = raw.split(/\}\}\s*(?:<br\s*\/?>[\s\n]*){1,4}/i);
  if (afterBox.length < 2) return "";
  const tail = afterBox[afterBox.length - 1];
  // Take text before == English Summary == or == Facts == or end
  const beforeSection = tail.split(/==\s*(?:English Summary|Facts)\s*==/i)[0];
  // Strip HTML tags and clean up
  const text = beforeSection
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\{\{[^}]*\}\}/g, "")
    .replace(/\|[A-Za-z_]+=\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length < 10) return "";
  if (text.length > 300) return text.slice(0, text.lastIndexOf(" ", 300)) + "\u2026";
  return text;
}

function parseItems(feed, url) {
  const sourceName =
    SOURCE_OVERRIDES[url] || feed.title || new URL(url).hostname;
  return feed.items.map((item) => ({
    title: decodeEntities(item.title || "Untitled"),
    link: item.link || "",
    pubDate: item.pubDate || item.isoDate || "",
    source: sourceName,
    sourceUrl: feed.link || new URL(url).origin,
    snippet: url.includes("gdprhub.eu")
      ? extractGDPRhubSnippet(item.content || item.summary || item.description || "")
      : cleanSnippet(
          item.contentSnippet || item.summary || item.description || "",
          300,
        ),
  }));
}

// Fallback: use headless browser to bypass Cloudflare JS challenge
async function fetchWithBrowser(url) {
  if (!browser) {
    console.log("  Launching headless browser...");
    browser = await chromium.launch({
      headless: false,  // Use headed mode — less detectable by Cloudflare
      args: ["--headless=new"],  // New headless mode (Chrome's native, not Playwright's)
    });
  }
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    locale: "en-US",
  });
  const page = await context.newPage();
  try {
    // Navigate, let Cloudflare challenge run
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
    // Wait for content to appear (Cloudflare JS challenge)
    await page.waitForSelector('pre, body', { timeout: 5000 }).catch(() => {});
    // The browser renders XML inside an HTML <pre> tag with HTML-encoded entities.
    // Extract the raw text content from the page instead.
    const text = await page.innerText("body");
    if (!text.includes("<?xml") && !text.includes("<rss") && !text.includes("<feed")) {
      throw new Error("Response is not RSS/XML — likely still on Cloudflare challenge page");
    }
    return text;
  } finally {
    await page.close();
    await context.close();
  }
}

// Scrape ICO news via their internal JSON API (RSS feeds are disabled)
async function scrapeICO(scraperConfig) {
  const { source, sourceUrl, apiUrl, rootPageId } = scraperConfig;
  console.log(`  Scraping: ${source} (${apiUrl})`);
  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filters: [],
        pageNumber: 1,
        order: "newest",
        rootPageId,
      }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    const items = (data.results || []).map((item) => ({
      title: decodeEntities(item.title || "Untitled"),
      link: `${sourceUrl}${item.url}`,
      pubDate: item.createdDateTime || "",
      source,
      sourceUrl,
      snippet: cleanSnippet(item.description || "", 300),
    }));
    console.log(`  ✓ ${source}: ${items.length} items (scraped)`);
    return items;
  } catch (err) {
    console.warn(`  ✗ Failed to scrape ${source}: ${err.message}`);
    return [];
  }
}

// Scrape Simmons & Simmons insights via their Algolia search API (no RSS)
const SIMMONS_ALGOLIA = {
  appId: "C9S9O2OFPV",
  apiKey: "7ff1c4d30eee83d68ff7961455930a8f",
  index: "production_public_Insights_News",
};

async function scrapeSimmons(scraperConfig) {
  const { source, sourceUrl, jurisdiction } = scraperConfig;
  console.log(`  Scraping: ${source} [${jurisdiction}]`);
  try {
    const filters = `sectors.fields.title:"Technology, Media and Telecommunications" AND parent.__typename:Article AND applicableLaws.fields.title:"${jurisdiction}"`;
    const res = await fetch(
      `https://${SIMMONS_ALGOLIA.appId}-dsn.algolia.net/1/indexes/${SIMMONS_ALGOLIA.index}/query`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-algolia-api-key": SIMMONS_ALGOLIA.apiKey,
          "x-algolia-application-id": SIMMONS_ALGOLIA.appId,
        },
        body: JSON.stringify({
          query: "",
          hitsPerPage: 50,
          page: 0,
          filters,
          attributesToRetrieve: ["title", "slug", "sorting", "description", "parent"],
        }),
      },
    );
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    const hits = data.hits || [];
    const items = hits.map((hit) => {
      const parentId = hit.parent?.id || hit.parent?._id || "";
      const slug = hit.slug || "";
      return {
        title: decodeEntities(hit.title || "Untitled"),
        link: `${sourceUrl}/en/publications/${parentId}/${slug}`,
        pubDate: hit.sorting ? new Date(hit.sorting).toISOString() : "",
        source,
        sourceUrl,
        snippet: cleanSnippet(hit.description || "", 300),
      };
    });
    console.log(`  ✓ ${source} [${jurisdiction}]: ${items.length} items (Algolia)`);
    return items;
  } catch (err) {
    console.warn(`  ✗ Failed to scrape ${source} [${jurisdiction}]: ${err.message}`);
    return [];
  }
}

// Scrape Bird & Bird insights via their Coveo search API (no RSS)
async function scrapeBirdBird(scraperConfig) {
  const { source, sourceUrl, sector } = scraperConfig;
  console.log(`  Scraping: ${source} [${sector}]`);
  try {
    const aq = `@z95xtemplatename=="T12 Insights Detail" @z95xdatabase=="web" @parsedlanguage=="english" @sectortitles=="${sector}"`;
    const params = new URLSearchParams({
      q: "",
      numberOfResults: "50",
      firstResult: "0",
      sortCriteria: "@publicationdate descending",
      aq,
    });
    const res = await fetch(`${sourceUrl}/coveo/rest`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    const results = data.results || [];
    const items = results.map((r) => {
      const raw = r.raw || {};
      const pubMs = raw.publicationdate;
      const pubDate = pubMs ? new Date(pubMs).toISOString() : "";
      // printableUri uses cm.twobirds.com (authoring server) — swap to www
      const link = (r.printableUri || "").replace("cm.twobirds.com", "www.twobirds.com");
      // Titles have " - Bird & Bird" suffix — strip it
      const title = (r.title || "Untitled").replace(/ - Bird & Bird$/i, "").trim();
      return {
        title,
        link,
        pubDate,
        source,
        sourceUrl,
        snippet: cleanSnippet(r.excerpt || "", 300),
      };
    });
    console.log(`  ✓ ${source}: ${items.length} items (Coveo)`);
    return items;
  } catch (err) {
    console.warn(`  ✗ Failed to scrape ${source}: ${err.message}`);
    return [];
  }
}

// Scrape IAPP news via their Algolia search API (RSS feeds are dead)
const IAPP_ALGOLIA = {
  appId: "JQI28CT642",
  apiKey: "05142b663d0923f3d221386f59c9702c",
  index: "all_resource_dates_desc",
};

async function scrapeIAPP(scraperConfig) {
  const { source, sourceUrl, laws } = scraperConfig;
  const lawLabel = laws.join(" + ");
  console.log(`  Scraping: ${source} [${lawLabel}]`);
  try {
    const facetFilters = laws.length === 1
      ? [[`news_tags.law_and_regulation.law_and_regulation:${laws[0]}`]]
      : [laws.map((l) => `news_tags.law_and_regulation.law_and_regulation:${l}`)];

    const res = await fetch(
      `https://${IAPP_ALGOLIA.appId}-dsn.algolia.net/1/indexes/*/queries`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-algolia-api-key": IAPP_ALGOLIA.apiKey,
          "x-algolia-application-id": IAPP_ALGOLIA.appId,
        },
        body: JSON.stringify({
          requests: [{
            indexName: IAPP_ALGOLIA.index,
            filters: "_content_type:news_article",
            facetFilters,
            hitsPerPage: 50,
            page: 0,
            attributesToRetrieve: ["url", "article_details", "news_tags"],
          }],
        }),
      },
    );
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    const hits = data.results?.[0]?.hits || [];
    const items = hits.map((hit) => ({
      title: decodeEntities(hit.article_details?.headline || "Untitled"),
      link: `${sourceUrl}${hit.url}`,
      pubDate: hit.article_details?.date ? new Date(hit.article_details.date).toISOString() : "",
      source,
      sourceUrl,
      snippet: "",
    }));
    console.log(`  ✓ ${source} [${lawLabel}]: ${items.length} items (Algolia)`);
    return items;
  } catch (err) {
    console.warn(`  ✗ Failed to scrape ${source} [${lawLabel}]: ${err.message}`);
    return [];
  }
}

// Scrape Reuters via their open sitemaps (bypasses Datadome bot protection)
// Two sitemaps are used:
//   1. News sitemap (/arc/outboundfeeds/news-sitemap/) — ~1,700 articles, has titles+dates, covers ~2-3 days
//   2. Regular sitemap (/arc/outboundfeeds/sitemap/) — ~10,000 URLs, has lastmod dates, covers ~25 days
// We filter by keyword patterns in titles (news sitemap) and URL slugs (regular sitemap).
const REUTERS_TOPIC_PATTERNS = {
  cybersecurity: {
    // For matching against titles (news sitemap)
    title: [
      /\bcyber\w*/i, /\bhack(er|ed|ing|s)?\b/i, /\bransomware\b/i,
      /\bmalware\b/i, /\bphishing\b/i, /\bdata breach/i, /\bbotnet/i,
      /\bddos\b/i, /\bzero.day\b/i, /\bspyware\b/i, /\bcyberattack/i,
      /\bcybercrim/i, /\bthreat actor/i, /\bdark web\b/i,
    ],
    // For matching against URL slugs (regular sitemap)
    slug: [
      /cyber/, /\bhack/, /ransomware/, /malware/, /phishing/,
      /data-breach/, /botnet/, /ddos/, /spyware/, /zero-day/,
    ],
  },
  "data-privacy": {
    title: [
      /\bprivacy\b/i, /\bdata protection\b/i, /\bgdpr\b/i,
      /\bfacial recognition\b/i, /\bbiometric\b/i, /\bpersonal data\b/i,
      /\bdata collect/i, /\bdigital rights\b/i, /\bwiretap/i,
      /\bend.to.end encrypt/i, /\bdata privacy\b/i, /\bprivacy watchdog/i,
      /\bprivacy law\b/i, /\bprivacy regul/i, /\bprivacy fine/i,
    ],
    slug: [
      /\bprivacy/, /data-protection/, /gdpr/, /facial-recognition/,
      /biometric/, /personal-data/, /data-privacy/, /privacy-watchdog/,
      /privacy-law/, /privacy-fine/, /privacy-regul/,
    ],
  },
};

async function scrapeWordPressAPI(scraperConfig) {
  const { source, sourceUrl, apiBase, perPage = 100, category } = scraperConfig;
  const label = category ? `${source} (category ${category})` : source;
  console.log(`  Scraping: ${label} via WordPress API`);
  try {
    let url = `${apiBase}?per_page=${perPage}&_fields=title,date,link,excerpt`;
    if (category) url += `&categories=${category}`;
    const res = await fetch(url, { headers: BROWSER_HEADERS });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const posts = await res.json();
    const items = posts.map((p) => ({
      title: decodeEntities(p.title?.rendered || ""),
      link: p.link,
      pubDate: new Date(p.date).toISOString(),
      description: cleanSnippet(p.excerpt?.rendered || "", 280),
      source,
      sourceUrl,
    }));
    console.log(`  ✓ ${source}: ${items.length} items (WP API)`);
    return items;
  } catch (e) {
    console.error(`  ✗ ${source} WP API failed: ${e.message}`);
    return [];
  }
}

async function scrapeLawfare(scraperConfig) {
  const { source, sourceUrl } = scraperConfig;
  console.log(`  Scraping: ${source} via Playwright`);
  try {
    if (!browser) browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://www.lawfaremedia.org/", {
      waitUntil: "domcontentloaded",
      timeout: 20000,
    });
    await page.waitForSelector('a[href*="/article/"]', { timeout: 10000 }).catch(() => {});
    const items = await page.evaluate(() => {
      const results = [];
      const seen = new Set();
      const months = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
        January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
        July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
      };
      document.querySelectorAll('a[href*="/article/"]').forEach((a) => {
        const title = a.textContent?.trim();
        const link = a.href;
        if (
          !title || title.length < 8 || seen.has(link) ||
          /^View All/i.test(title) || /^Intern with/i.test(title)
        ) return;
        seen.add(link);
        // Try to find a date near the link
        const parent = a.closest("div, li, section, article");
        const dateMatch = parent?.textContent?.match(
          /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*)\s+(\d{1,2}),?\s+(\d{4})/
        );
        let pubDate = null;
        if (dateMatch) {
          const m = months[dateMatch[1]];
          if (m !== undefined) {
            pubDate = new Date(
              parseInt(dateMatch[3]), m, parseInt(dateMatch[2])
            ).toISOString();
          }
        }
        results.push({ title, link, pubDate });
      });
      return results;
    });
    await page.close();
    const cleaned = items
      .filter((i) => i.pubDate) // only items with dates
      .map((i) => ({
        title: i.title,
        link: i.link,
        pubDate: i.pubDate,
        description: "",
        source,
        sourceUrl,
      }));
    console.log(`  ✓ ${source}: ${cleaned.length} items (Playwright)`);
    return cleaned;
  } catch (e) {
    console.error(`  ✗ ${source} scrape failed: ${e.message}`);
    return [];
  }
}

async function scrapeCURIA(scraperConfig) {
  const { source, sourceUrl, sort, statusFilter } = scraperConfig;
  console.log(`  Scraping: ${source} via Playwright`);
  try {
    if (!browser) browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const baseUrl =
      "https://infocuria.curia.europa.eu/tabs/affair?lang=en&matiere=RAPL.ICT%2CRAPL.RMSN.RMN%2CRAPL.RMSN.RSN%2CRAPL.RMSN%2CPRIN.PDON";
    const url = sort ? `${baseUrl}&sort=${sort}` : baseUrl;
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    // Click "Initiate search" to load results
    const searchBtn = await page.$('button:has-text("Initiate search")');
    if (searchBtn) {
      await searchBtn.click();
      await page.waitForTimeout(8000);
    }

    const cases = await page.evaluate(() => {
      const results = [];
      const seen = new Set();
      const rows = document.querySelectorAll("li, [role=row], tr, div");
      rows.forEach((row) => {
        const text = row.textContent?.trim();
        const match = text?.match(
          /([CT]-\d+\/\d+)\s*-\s*([^]*?)(?:Display|$)/
        );
        if (!match || seen.has(match[1])) return;
        seen.add(match[1]);
        // Cases show one or two dates: "DD/MM/YYYY" (intro) or "DD/MM/YYYY - DD/MM/YYYY" (intro - closure)
        const allDates = [...text.matchAll(/(\d{2})\/(\d{2})\/(\d{4})/g)];
        const status = text.match(/(Pending|Closed|Removed)/)?.[1] || "";
        // For closed cases use the closure date (second), otherwise use intro date (first)
        const dateIdx = (status === "Closed" && allDates.length > 1) ? allDates.length - 1 : 0;
        let pubDate = null;
        if (allDates[dateIdx]) {
          const d = allDates[dateIdx];
          pubDate = new Date(
            parseInt(d[3]),
            parseInt(d[2]) - 1,
            parseInt(d[1])
          ).toISOString();
        }
        results.push({
          caseNum: match[1],
          title: match[2].trim(),
          pubDate,
          status,
        });
      });
      return results;
    });

    await page.close();
    const cleaned = cases
      .filter((c) => c.pubDate && (!statusFilter || c.status === statusFilter))
      .map((c) => ({
        title: `CJEU ${c.caseNum} — ${c.title}${c.status ? ` [${c.status}]` : ""}`,
        link: `https://infocuria.curia.europa.eu/tabs/affair?lang=EN&searchTerm=%22${encodeURIComponent(c.caseNum)}%22&publishedId=${encodeURIComponent(c.caseNum)}`,
        pubDate: c.pubDate,
        description: "",
        source,
        sourceUrl,
      }));
    console.log(`  ✓ ${source}: ${cleaned.length} items (Playwright)`);
    return cleaned;
  } catch (e) {
    console.error(`  ✗ ${source} scrape failed: ${e.message}`);
    return [];
  }
}

// Scrape articles from a sitemap.xml — used for sites with no RSS but a clean sitemap (e.g. Freshfields TQ)
async function scrapeSitemap(scraperConfig) {
  const { source, sourceUrl, sitemapUrl, urlPattern } = scraperConfig;
  console.log(`  Scraping: ${source} via sitemap`);
  try {
    const res = await fetch(sitemapUrl, { headers: BROWSER_HEADERS, redirect: "follow" });
    const xml = await res.text();
    const items = [];
    // Parse <url> entries with <loc> and <lastmod>
    const urlBlocks = xml.match(/<url>[\s\S]*?<\/url>/g) || [];
    for (const block of urlBlocks) {
      const locMatch = block.match(/<loc>([^<]+)<\/loc>/);
      const modMatch = block.match(/<lastmod>([^<]+)<\/lastmod>/);
      if (!locMatch) continue;
      const loc = locMatch[1];
      if (urlPattern && !loc.includes(urlPattern)) continue;
      // Extract title from URL slug
      const slug = loc.split("/").pop() || "";
      const title = decodeEntities(
        slug.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())
      );
      items.push({
        title,
        link: loc,
        pubDate: modMatch ? modMatch[1] : new Date().toISOString(),
        source,
        sourceUrl,
        description: "",
      });
    }
    console.log(`  ✓ ${source}: ${items.length} items (sitemap)`);
    return items;
  } catch (err) {
    console.error(`  ✗ ${source} sitemap failed: ${err.message}`);
    return [];
  }
}

async function scrapeReuters(scraperConfig) {
  const { source, sourceUrl, topic } = scraperConfig;
  const patterns = REUTERS_TOPIC_PATTERNS[topic];
  if (!patterns) {
    console.warn(`  ✗ Unknown Reuters topic: ${topic}`);
    return [];
  }
  console.log(`  Scraping: ${source} [${topic}] via sitemaps`);
  try {
    const seen = new Set();
    const items = [];

    const addItem = (url, date, title) => {
      if (seen.has(url)) return;
      seen.add(url);
      items.push({
        title,
        link: url,
        pubDate: new Date(date).toISOString(),
        source,
        sourceUrl,
        snippet: "",
      });
    };

    // 1. News sitemap — has titles, ~1,700 articles, covers last ~2-3 days
    const newsSitemapBase = "https://www.reuters.com/arc/outboundfeeds/news-sitemap/?outputType=xml";
    const newsPagePromises = [];
    for (let from = 0; from <= 1600; from += 100) {
      const url = from === 0 ? newsSitemapBase : `${newsSitemapBase}&from=${from}`;
      newsPagePromises.push(
        fetch(url, { headers: { "User-Agent": BROWSER_HEADERS["User-Agent"] } })
          .then((r) => (r.ok ? r.text() : ""))
          .catch(() => ""),
      );
    }
    const newsPages = await Promise.all(newsPagePromises);
    const newsEntryRegex =
      /<loc>(https:\/\/www\.reuters\.com\/[^<]+)<\/loc>.*?<news:publication_date>([^<]+)<\/news:publication_date>.*?<news:title><!\[CDATA\[([^\]]+)\]\]><\/news:title>/gs;
    for (const xml of newsPages) {
      let match;
      while ((match = newsEntryRegex.exec(xml)) !== null) {
        const [, url, date, title] = match;
        if (patterns.title.some((p) => p.test(title))) {
          addItem(url, date, title);
        }
      }
    }
    const newsCount = items.length;

    // 2. Regular sitemap — URL slugs only, ~10,000 entries, covers ~25 days
    const sitemapBase = "https://www.reuters.com/arc/outboundfeeds/sitemap/?outputType=xml";
    const sitemapPagePromises = [];
    for (let from = 0; from <= 9900; from += 100) {
      const url = from === 0 ? sitemapBase : `${sitemapBase}&from=${from}`;
      sitemapPagePromises.push(
        fetch(url, { headers: { "User-Agent": BROWSER_HEADERS["User-Agent"] } })
          .then((r) => (r.ok ? r.text() : ""))
          .catch(() => ""),
      );
    }
    const sitemapPages = await Promise.all(sitemapPagePromises);
    const sitemapEntryRegex = /<loc>(https:\/\/www\.reuters\.com\/[^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/gs;
    for (const xml of sitemapPages) {
      let match;
      while ((match = sitemapEntryRegex.exec(xml)) !== null) {
        const [, url, date] = match;
        const slug = url.endsWith("/") ? url.split("/").slice(-2)[0] : url.split("/").pop();
        if (patterns.slug.some((p) => p.test(slug))) {
          // Generate a readable title from the slug (will be overridden if news sitemap had it)
          const title = slug
            .replace(/-\d{4}-\d{2}-\d{2}$/, "")
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          addItem(url, date, title);
        }
      }
    }

    // Sort by date descending, limit to 50
    items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    const limited = items.slice(0, 50);
    console.log(`  ✓ ${source} [${topic}]: ${limited.length} items (${newsCount} from news sitemap, ${limited.length - newsCount > 0 ? limited.length - newsCount : 0}+ from regular sitemap)`);
    return limited;
  } catch (err) {
    console.warn(`  ✗ Failed to scrape ${source} [${topic}]: ${err.message}`);
    return [];
  }
}

// Fetch an RSS feed and filter items by a predicate
async function fetchFilteredFeed(config) {
  const { url, urls, source, sourceUrl, filter, transformTitle } = config;
  const feedUrls = urls || [url];
  const allItems = [];
  for (const feedUrl of feedUrls) {
    console.log(`  Fetching (filtered): ${feedUrl} → ${source}`);
    try {
      const res = await fetch(feedUrl, { headers: BROWSER_HEADERS });
      if (!res.ok) throw new Error(`Status code ${res.status}`);
      const xml = await res.text();
      const feed = await parser.parseString(xml);
      for (const item of feed.items) {
        let title = decodeEntities(item.title || "Untitled");
        if (transformTitle) title = transformTitle(title);
        allItems.push({
          title,
          link: item.link || "",
          pubDate: item.pubDate || item.isoDate || "",
          source,
          sourceUrl,
          snippet: cleanSnippet(item.contentSnippet || item.summary || item.description || "", 300),
          categories: item.categories || [],
        });
      }
    } catch (err) {
      console.warn(`  ✗ Failed: ${feedUrl} — ${err.message}`);
    }
  }
  const filtered = allItems.filter(filter);
  const items = filtered.map(({ categories, ...rest }) => rest);
  console.log(`  ✓ ${source}: ${items.length} items (filtered from ${allItems.length})`);
  return items;
}

async function fetchFeed(url) {
  try {
    console.log(`  Fetching: ${url}`);
    // Try normal fetch first
    const res = await fetch(url, { headers: BROWSER_HEADERS });
    if (!res.ok) throw new Error(`Status code ${res.status}`);
    const xml = await res.text();
    const feed = await parser.parseString(xml);
    const items = parseItems(feed, url);
    console.log(
      `  ✓ ${SOURCE_OVERRIDES[url] || feed.title}: ${items.length} items`,
    );
    return items;
  } catch (err) {
    // Fallback to headless browser for Cloudflare-blocked feeds
    console.log(`  ⚠ Normal fetch failed (${err.message}), trying headless browser...`);
    try {
      const xml = await fetchWithBrowser(url);
      const feed = await parser.parseString(xml);
      const items = parseItems(feed, url);
      console.log(
        `  ✓ ${SOURCE_OVERRIDES[url] || feed.title}: ${items.length} items (via browser)`,
      );
      return items;
    } catch (browserErr) {
      console.warn(`  ✗ Failed: ${url} — ${browserErr.message}`);
      return [];
    }
  }
}

async function fetchFeedItems(urls) {
  if (!urls || urls.length === 0) return [];
  const results = await Promise.allSettled(
    urls.map((u) => {
      // Check if this is a filtered feed (e.g. "filter:ec-digital-news")
      if (u.startsWith("filter:")) {
        const filterKey = u.slice(7);
        const config = FILTERED_FEEDS[filterKey];
        if (!config) {
          console.warn(`  ✗ Unknown filtered feed: ${filterKey}`);
          return Promise.resolve([]);
        }
        return fetchFilteredFeed(config);
      }
      // Check if this is a custom scraper (e.g. "scrape:ico.org.uk")
      if (u.startsWith("scrape:")) {
        const scraperKey = u.slice(7);
        const config = CUSTOM_SCRAPERS[scraperKey];
        if (!config) {
          console.warn(`  ✗ Unknown scraper: ${scraperKey}`);
          return Promise.resolve([]);
        }
        if (config.type === "iapp") return scrapeIAPP(config);
        if (config.type === "simmons") return scrapeSimmons(config);
        if (config.type === "twobirds") return scrapeBirdBird(config);
        if (config.type === "ico") return scrapeICO(config);
        if (config.type === "reuters-sitemap") return scrapeReuters(config);
        if (config.type === "wp-api") return scrapeWordPressAPI(config);
        if (config.type === "playwright-scrape" && config.source === "Lawfare") return scrapeLawfare(config);
        if (config.type === "playwright-scrape" && config.source.startsWith("CJEU")) return scrapeCURIA(config);
        if (config.type === "sitemap-scrape") return scrapeSitemap(config);
        console.warn(`  ✗ Unknown scraper type: ${config.type}`);
        return Promise.resolve([]);
      }
      return fetchFeed(u);
    }),
  );
  const allItems = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      allItems.push(...result.value);
    }
  }
  allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  return allItems;
}

async function main() {
  console.log("Building feed data...\n");

  const config = JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
  const data = { categories: [], updatedAt: new Date().toISOString() };

  const fetches = config.categories.map(async (cat) => {
    console.log(`Category: ${cat.name}`);
    if (cat.subcategories) {
      const subFetches = cat.subcategories.map(async (sub) => {
        console.log(`  Subcategory: ${sub.name}`);
        return {
          name: sub.name,
          items: await fetchFeedItems(sub.feeds),
        };
      });
      const subcategories = await Promise.all(subFetches);

      // Merge all subcategory items into "Global"
      const globalSub = subcategories.find((s) => s.name === "Global");
      if (globalSub) {
        const otherItems = subcategories
          .filter((s) => s.name !== "Global")
          .flatMap((s) => s.items);
        globalSub.items = [...globalSub.items, ...otherItems]
          .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        console.log(`  → Global merged: ${globalSub.items.length} total items`);
      }

      return {
        name: cat.name,
        subcategories,
        items: [],
      };
    }
    return {
      name: cat.name,
      items: await fetchFeedItems(cat.feeds),
    };
  });

  data.categories = await Promise.all(fetches);

  // Close browser if it was opened
  if (browser) await browser.close();

  writeFileSync(OUTPUT_PATH, JSON.stringify(data));
  console.log(`\n✓ Wrote ${OUTPUT_PATH}`);
  console.log(`  Updated at: ${data.updatedAt}`);

  // Summary
  let totalItems = 0;
  for (const cat of data.categories) {
    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        totalItems += sub.items.length;
      }
    } else {
      totalItems += (cat.items || []).length;
    }
  }
  console.log(`  Total items: ${totalItems}`);
}

main().catch(async (err) => {
  if (browser) await browser.close();
  console.error("Build failed:", err);
  process.exit(1);
});
