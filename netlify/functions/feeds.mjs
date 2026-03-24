// Netlify Function — proxies and parses RSS feeds server-side to avoid CORS issues.
// The frontend calls this with the feed config, and it returns parsed items.

import RSSParser from "rss-parser";

const parser = new RSSParser({
  timeout: 10000,
  headers: { "User-Agent": "RSS Feed Aggregator/1.0" },
});

function cleanSnippet(text, maxLen) {
  let s = text
    .replace(/\n+/g, " ")           // collapse newlines
    .replace(/\s+/g, " ")           // collapse whitespace
    .replace(/^(illustration|image|photo|picture|credit)[:\s].{0,80}\n?/i, "") // strip image credits
    .trim();
  if (s.length <= maxLen) return s;
  // cut at last space before maxLen, add ellipsis
  const cut = s.lastIndexOf(" ", maxLen);
  return s.slice(0, cut > 0 ? cut : maxLen) + "\u2026";
}

// Override bad/generic feed titles
const SOURCE_OVERRIDES = {
  "https://www.edps.europa.eu/feed/news_en": "EDPS News",
};

async function fetchFeed(url) {
  try {
    // Try normal rss-parser first
    const feed = await parser.parseURL(url);
    const sourceName = SOURCE_OVERRIDES[url] || feed.title || new URL(url).hostname;
    return feed.items.map((item) => ({
      title: item.title || "Untitled",
      link: item.link || "",
      pubDate: item.pubDate || item.isoDate || "",
      source: sourceName,
      snippet: cleanSnippet(item.contentSnippet || item.summary || item.description || "", 300),
    }));
  } catch (err) {
    console.warn(`Failed to fetch ${url}: ${err.message}`);
    return [];
  }
}

export default async function handler(request) {
  const url = new URL(request.url);
  const feedUrls = url.searchParams.get("urls");

  if (!feedUrls) {
    return new Response(JSON.stringify({ error: "No urls provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const urls = feedUrls.split(",").map((u) => u.trim());
  const allItems = [];

  const results = await Promise.allSettled(urls.map((u) => fetchFeed(u)));
  for (const result of results) {
    if (result.status === "fulfilled") {
      allItems.push(...result.value);
    }
  }

  allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  return new Response(JSON.stringify({ items: allItems }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=1800",
    },
  });
}
