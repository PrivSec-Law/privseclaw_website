# Session Memories — privseclaw.info

## Project Info
- The site is referred to as **privseclaw.info**
- Project directory: `/Users/johnreese/Documents/Website/claude gen website/`
- Old Hugo site: `/Users/johnreese/Documents/Website/Website1/`
- User is a legal professional in the technology law field

## TODO (remaining)
1. **Translation of non-English headlines** — discussed using `google-translate-api-x` npm package (no account needed). On hold per user request.
2. **Home page text** — draft done, needs finalization
3. **Set up Netlify build hook + cron** for twice-daily rebuilds
4. **Privacy International** — site was down (HTTP 500), revisit later
5. **Washington Post** — completely blocked, skip
6. **Lexology** — Cloudflare enterprise blocked, skip

## Completed
- All feed categories populated (General Tech 11, AI Updates 12, Tech Law multi-sub, Privacy/Cyber/Digital Rights 25+)
- Blog articles imported (7 posts in 2 sections)
- Privacy Resources imported (5 pages)
- Contact tab done
- Privacy Notice done
- Font system established (Playfair Display headings, Merriweather body, Inter UI)
- Dark/light theming complete (light mode default, dark for prefers-color-scheme: dark)
- News page layout: cards in row, 3-column headlines, 3-column feed items
- Sticky back buttons, teal selection, scrollbar fix
- Link sanity check on all 234 blog URLs — all accessible
- Source toggle button (Deselect All red / Select All green)
- Sources container separated from feed items (prevents layout shift)
- Beta banner (teal gradient, scrolls away)
- Section renames: News → "PrivSecLaw News Feeds", Resources → "PrivSecLaw Resources"
- Category rename: "Privacy, Security & Digital Rights" → "Privacy | Cybersecurity | Digital Rights & Society"
- Default time filters: 48h for most feeds, 1 week for policy feeds
- CyberScoop WP API scraper (all posts + AI category 6955)
- Lawfare Playwright scraper
- CJEU Infocuria Playwright scraper (pending + closed cases)
- Freshfields TQ sitemap scraper
- GDPRhub NewPages atom feed integration
- OpenRSS Reuters Technology removed (always timed out)

## Default Scraping Approach
**When a site has no RSS feed, the default approach is:**
1. First try **Playwright headless browser** to load the page and extract data from the DOM or `__NEXT_DATA__` JSON
2. If the site uses a search API (Algolia, Coveo, Elasticsearch), find the public credentials in the page source/JS bundles and query the API directly — this is preferred over DOM scraping as it's faster and more reliable
3. If bot protection blocks Playwright, check for **open sitemaps** (news sitemaps especially — often not behind bot protection) and filter by keywords
4. **DO NOT use Google News RSS** — it produces irrelevant, stale results and the user has explicitly banned this approach

## Privacy Requirements
- **YouTube embeds in blog posts MUST use privacy-enhanced mode** (`youtube-nocookie.com`) and only load on user click — this is stated in the privacy notice
- No analytics, no non-essential cookies by default
- Any future third-party integrations must be opt-in (user-initiated) and documented in the privacy notice

## Owner Preferences
- **No emojis** in code or content — user explicitly dislikes them
- **No cutting headline counts** — all feeds should give their max items. Limited by timeframe filter only, not count.
- Prefers **centred card layouts with flexbox**
- Prefers **Playfair Display for headings**, teal accent color scheme
- Cares about **layout not shifting** when toggling filters — sources container is separate from feed items
- Wants **red/green color coding** for toggle states (Deselect All = red, Select All = green)
- Wants **fast builds** — optimize Playwright waits, avoid unnecessary timeouts
- Wants feeds from a mix of **mainstream news, specialist legal/policy, academic, and advocacy** sources
- German-language feeds are fine (Der Standard, netzpolitik.org) — translation planned later
- Privacy-conscious design throughout
- Contact email: privseclaw@pm.me

## Design Preferences
- User prefers warm cream/beige tones for light mode, NOT cool whites/grays
- **Light theme is default**; dark mode activates for users with `prefers-color-scheme: dark`
- Teal accent (#0FA4AF) must be preserved in both themes
- **Three-tier font system**: Playfair Display (all h1-h6 headings, section headings like "Our Digital Reality", card titles in blog/resources), Merriweather (body/serif), Inter (UI elements, buttons, nav, filters)
- **Body font 1.2rem** with 1rem overrides on header-sticky and tab-nav to keep UI chrome compact
- Theme toggle button sits right next to the site title (not off to the right)
- Burger menu on the right side of header, level with title, with "Menu" text label
- Privacy Notice is a menu-only section (not in the tab bar)
- Footer: "This site does not collect, store, perform analytics on or in any way process personal data."
- Home page latest headlines should prioritise Digital Rights, AI, and Law/Policy categories (weighted sort with 12h time boost)
- Teal text selection sitewide: `::selection { background: rgba(15, 164, 175, 0.4); color: #fff; }`
- Sticky back buttons with teal pill style, pinned below header at `top: 91px`
- 3-column layout for headlines and feed items on desktop, 1-column on mobile
- Category cards in news landing: horizontal row, equal width, vertically centred text
- Subcategory cards centred with flexbox (280px width)
- Resource landing cards: 320px, centred, larger text
- Card text centred in guide-card-body
- Scrollbar always visible (`overflow-y: scroll`) to prevent layout shift
- Beta banner: teal gradient, positioned above sticky header, scrolls away with content

## Technical Gotchas
- IAPP RSS feeds are dead (308 redirect to HTML) — use Algolia API scraper instead
- IAPP news articles use `news_tags.law_and_regulation.*` facet (NOT `resource_tags.*`)
- Euractiv returns 403 on normal fetch — needs Playwright headless browser fallback
- ICO has no RSS — uses their internal `/api/search` POST endpoint
- Simmons & Simmons has no RSS — uses Algolia (App ID: `C9S9O2OFPV`)
- Bird & Bird has no RSS — uses Coveo for Sitecore (POST to `/coveo/rest`, no auth). Most articles lack country tags so splitting by jurisdiction loses content — put under Global instead.
- Bird & Bird `printableUri` uses `cm.twobirds.com` — must swap to `www.twobirds.com`
- Bird & Bird titles have " - Bird & Bird" suffix — strip it in scraper
- Reuters main pages/API are behind Datadome (blocks Playwright, patchright, curl, everything) — BUT their news sitemap (`/arc/outboundfeeds/news-sitemap/`) is completely open
- Reuters articles on topic pages (data-privacy, cybersecurity) aren't filed under those URL paths — they're tag-based aggregations. Scraper filters by keyword regex patterns in titles instead
- **OpenRSS Reuters Technology** — always timed out with VPN. Removed. Will work fine on Netlify without VPN.
- **CJEU Infocuria** — requires `networkidle` wait strategy, NOT `domcontentloaded`. It is a SPA that won't render results otherwise. Uses 8s additional wait. ~20s per feed.
- **Lawfare** — Playwright scrape of homepage, ~10s build time
- **Freshfields TQ** — sitemap scraper, generates titles from URL slugs
- **GDPRhub** — Recent Changes feed is useless (wiki diffs). Use NewPages atom feed (`Special:NewPages&feed=atom`) instead. Descriptions extracted from wiki markup between `}}<br />` and `== English Summary ==`.
- **CyberScoop** — WP REST API scraper. AI category is ID 6955. `per_page=100`.
- **Privacy International** — website completely down (HTTP 500). Revisit later.
- **Washington Post** — completely blocks all scraping attempts. Skip.
- **Lexology** — completely behind Cloudflare managed challenge. No public API (enterprise/paid only via developer.lexology.com). No sitemap, no Algolia/Coveo. Even Playwright can't bypass. Dropped.
- **OAIC Australia** — feed has no dates on any items. Removed.
- Theme init must run as self-executing function BEFORE DOMContentLoaded to prevent flash of wrong theme
- `feeds.config.json` must be kept in sync between root and `public/`
- Tech Policy Press feed returns 3000+ items — consider limiting in future
- URL routing uses history.pushState — all asset paths in index.html must be absolute (start with `/`)
- Netlify needs `[[redirects]]` catch-all rewrite (status 200) for SPA routing
- **EU Law Blog** — PubPub platform. RSS limited to 25 items. `?tag=` parameter is ignored. Category-specific URLs (`/category/*/feed/`) return 404. Post-fetch filtering is the best approach. Low volume is genuine (~2-3 DP/AI matches per 2 months).
- **Privacy Guides** — old feed URL (`/articles/feed_rss_created.xml`) went stale (latest Nov 2025). Replaced with tag-based feeds: `/posts/tag/news/feed/` and `/posts/tag/articles/feed/`
- **arXiv feeds** — descriptions have prefix `arXiv:2603.18034v1 Announce Type: new \nAbstract:` — stripped by cleanSnippet()
- **FCC feeds** — raw feeds are very noisy (antenna registrations, license transfers). Replaced 7 individual feeds with single `filter:fcc-tmt` using keyword regex on titles only (descriptions are just "."). Multi-URL support via `urls` array in FILTERED_FEEDS config.
- **HTML entities in feed titles** — many feeds return `&#8216;`, `&#8217;`, `&amp;` etc. Fixed with `decodeEntities()` function applied to all title assignments
- **HTML tags in feed descriptions** — `<h4>`, `<p>`, `<strong>` etc. leaking through. `decodeEntities()` strips all HTML tags
- **Mozilla Foundation blog** — latest post Feb 2025. Appears inactive.
- **The Markup** — latest items from Nov 2025. May have reduced publishing.
- **Playwright build performance** — scrapers add ~60s total to build. CJEU x2 = ~40s, Lawfare ~10s, Euractiv fallback ~5s. Kill zombies with `pkill -f chromium` if build hangs.

## Scraper Reference

### ICO (`scrape:ico.org.uk`)
- POST `https://ico.org.uk/api/search`, body: `{ rootPageId: 2816, pageNumber: 1, order: "newest" }`

### IAPP Algolia (`scrape:iapp.org/*`)
- App ID: `JQI28CT642` | API Key: `05142b663d0923f3d221386f59c9702c`
- Index: `all_resource_dates_desc`
- Facet: `news_tags.law_and_regulation.law_and_regulation` with values: GDPR, EU AI Act, CCPA/CPRA, LGPD, PIPL
- Content type filter: `_content_type:news_article`

### Simmons & Simmons Algolia (`scrape:simmons/*`)
- App ID: `C9S9O2OFPV` | API Key: `7ff1c4d30eee83d68ff7961455930a8f`
- Index: `production_public_Insights_News`
- Sector filter: `sectors.fields.title:"Technology, Media and Telecommunications"`
- Content type: `parent.__typename:Article`
- Jurisdiction filter: `applicableLaws.fields.title:"European Union"` (or UK, Global, Middle East)
- URL: `/en/publications/{parent.id}/{slug}`
- ~1,738 total TMT articles, well-tagged by jurisdiction
- Available jurisdictions: UK (533), EU (493), Global (253), Germany (111), France, etc.

### Bird & Bird Coveo (`scrape:twobirds/tmt`)
- Endpoint: POST `https://www.twobirds.com/coveo/rest` (form-urlencoded, no auth)
- Advanced query: `@z95xtemplatename=="T12 Insights Detail" @z95xdatabase=="web" @parsedlanguage=="english" @sectortitles=="Technology & Communications"`
- Sort: `@publicationdate descending`
- ~1,696 total TMT insights
- Available facets: `sectortitles`, `practicetitles`, `countrytitles`, `trendingtopictitles`
- Country tags sparse on recent articles — don't split by jurisdiction
- Key fields in `raw`: `publicationdate` (ms timestamp), `sectortitles`, `practicetitles`, `countrytitles`

### Reuters Sitemap (`scrape:reuters/*`)
- **Method**: News sitemap at `https://www.reuters.com/arc/outboundfeeds/news-sitemap/?outputType=xml` (NOT behind Datadome)
- 17 pages x 100 entries = ~1,700 recent articles with `<news:title>`, `<news:publication_date>`, `<loc>` URL
- Keyword regex filtering on titles (not URL paths — cybersecurity/privacy are tag aggregations, not URL prefixes)
- `reuters/cyber`: matches `\bcyber\w*`, `\bhack(er|ed|ing|s)?\b`, `\bransomware\b`, `\bmalware\b`, `\bphishing\b`, `\bdata breach`, `\bbotnet`, `\bddos\b`, `\bzero.day\b`, `\bspyware\b`, `\bcyberattack`, `\bcybercrim`, `\bthreat actor`, `\bdark web\b`
- `reuters/privacy`: matches `\bprivacy\b`, `\bdata protection\b`, `\bgdpr\b`, `\bsurveillance\b`, `\bfacial recognition\b`, `\bbiometric\b`, `\bpersonal data\b`, etc.

### CyberScoop WordPress API (`scrape:cyberscoop`, `scrape:cyberscoop/ai`)
- Endpoint: `https://cyberscoop.com/wp-json/wp/v2/posts`
- `per_page=100`
- AI feed uses category filter: `categories=6955`

### Lawfare Playwright (`scrape:lawfare`)
- Loads `https://www.lawfaremedia.org` homepage with Playwright
- Extracts article links and publication dates from rendered DOM
- ~10s build time

### CJEU Infocuria Playwright (`scrape:curia/pending`, `scrape:curia/closed`)
- Scrapes Infocuria case search with subject matter filters (ICT, digital markets/services, personal data)
- `curia/pending`: sorted by `INTRODUCTION_DATE-DESC`, status filter "Pending"
- `curia/closed`: sorted by `CLOSE_DATE-DESC`, status filter "Closed", extracts closure date (second date)
- Requires `networkidle` + 8s wait (SPA rendering)
- ~20s per feed, ~40s total

### Freshfields TQ Sitemap (`scrape:freshfields-tq`)
- Fetches `https://technologyquotient.freshfields.com/sitemap`
- Filters URLs matching `/post/`, extracts `lastmod` dates
- Generates titles from URL slugs

### Filtered Feeds (`filter:*`)
- `ec-digital-news` — EU Commission RSS (`/en/rss.xml`), filtered to URLs containing `/en/news/`
- `eulawblog-dataprotection` — European Law Blog RSS, filtered to data protection/digital governance categories
- `eulawblog-ai` — European Law Blog RSS, filtered to AI category
- `fcc-tmt` — Multi-URL (News_Release, Statement, RO_NPRM), filtered by TMT keyword regex on titles
- `proton-privacy-news` — Proton Blog RSS, filtered to "Privacy news" category only

## Feed Sources by Category

### General Tech (11 feeds)
The Register, The Verge, TechCrunch, BBC Tech, Der Standard (German), Bloomberg Technology, NYT Technology, MIT Technology Review, Ars Technica, The Guardian: Technology, South China Morning Post: Tech

### AI Updates (12 feeds)
Luiza's Newsletter, Decoding Discontinuity, AI Safety Newsletter, The AI Ethics Brief, EU AI Act Newsletter, The Guardian AI, AI Now Institute, MIT News ML, The Register AI/ML, Import AI, CyberScoop AI (WP API, category 6955)

### Tech Law | Policy | Regulatory
- **Global**: Tech Policy Press, IAPP (LGPD+PIPL), Simmons & Simmons (Global), Bird & Bird (TMT), Debevoise Data Blog, Lawfare (Playwright), Freshfields TQ (sitemap)
- **EU**: Euractiv Tech, Politico EU Tech, EDPB, EDPS, IAPP (GDPR+AI Act), EU Commission Digital, European Law Blog (DP + AI), Simmons & Simmons (EU), EJLT, noyb, EU AI Act Newsletter, CNIL, GDPRhub (NewPages atom), CJEU New Cases (Playwright), CJEU Decided Cases (Playwright)
- **UK**: ICO, Simmons & Simmons (UK)
- **US**: IAPP (CCPA/CPRA), CPPA, FCC TMT (filtered), NIST
- **Middle East**: Simmons & Simmons (Middle East)

### Privacy | Cybersecurity | Digital Rights & Society (25+ feeds)
EFF, Guardian Privacy, Guardian Surveillance, Access Now, EDRi, Big Brother Watch, Privacy Guides (News + Articles), PrivSec.dev, Schneier on Security, EPIC, The Record, arXiv cs.CY, 404 Media, WIRED Security, Proton Blog (filtered), netzpolitik.org (German), noyb, Mozilla Foundation, The Markup, Krebs on Security, CDT, CyberScoop (WP API), AlgorithmWatch, Reuters (cyber + privacy via sitemap), CyberInsider

## Adding a New Feed — Checklist
1. Add URL to `feeds.config.json` under the right category
2. Add `SOURCE_OVERRIDES` entry in `build-feeds.mjs` for a clean display name
3. Run `npm run build` to verify it pulls correctly
4. If behind Cloudflare — Playwright fallback will try automatically. If that also fails, need a custom scraper or alternative source.
5. For filtered feeds: add config to `FILTERED_FEEDS` object in build-feeds.mjs, use `filter:keyname` in feeds.config.json
6. Same feed can appear in multiple categories (e.g. noyb in EU + Digital Rights)

## Session History
- **Session 1:** Built initial site structure, RSS fetcher, category/subcategory system, ICO scraper, IAPP Algolia scraper, dark/light theming, burger menu, Home tab, Contact tab, Privacy Notice, Privacy Guides/Resources split, font sizing, cream light theme
- **Session 2:** Rebuilt feeds, created CLAUDE.md and MEMORIES.md, made light theme creamier. Added EU Commission Digital (filtered RSS), European Law Blog (filtered RSS), CPPA RSS, FCC RSS feeds. Built Simmons & Simmons Algolia scraper (EU, UK, Global, Middle East). Built Bird & Bird Coveo scraper (TMT sector, under Global). Renamed GCC to Middle East.
- **Session 3:** Added The Record RSS. Built URL routing (history.pushState) with deep linking support, browser back/forward, and page titles. Fixed asset paths to absolute for deep URL support. Added Netlify SPA catch-all rewrite. Updated documentation.
- **Session 4:** Cracked Reuters — discovered their Arc XP news sitemap is completely open (no Datadome). Built keyword-regex scraper for cybersecurity and data-privacy topics.
- **Session 5:** Imported 3 "Our Digital Reality" blog articles from old Hugo site (we-are-being-watched, engineering-of-consent, encryption-under-attack). Imported Privacy Resources from old site, restyled with card layout. Major aesthetic overhaul: Playfair Display headings, teal selection, sticky back buttons, 3-column news layouts, centred cards. Fixed FCC feed noise with keyword-filtered multi-URL approach. Fixed HTML entity decoding in feed titles/descriptions. Home page redesign with centred hero. Uniform font sizing (1.2rem body). Scrollbar layout shift fix. Link sanity check on all 234 blog URLs. Removed outdated entries from resources (Techlore, GrapheneOS forums, X accounts, "Do You Trust This Computer"). Corrected film titles and links.
- **Session 6:** Massive feed expansion — added 21 new feeds across all categories. Populated AI Updates (was empty, now 9 sources). Added Bloomberg, NYT, MIT Tech Review to General Tech. Added 404 Media, WIRED Security, Proton Blog, netzpolitik.org, noyb, Mozilla Foundation, The Markup, arXiv cs.CY to Digital Rights. Added EJLT, noyb, EU AI Act Newsletter to EU. Fixed stale Privacy Guides feed. Renamed section to "Privacy | Cybersecurity | Digital Rights & Society". Investigated and dropped Lexology (Cloudflare blocked). Investigated EU Law Blog limitations (PubPub, 25 item RSS cap). Updated typography: Playfair Display on section headings and card titles. Centred card text and vertically centred news category cards. Updated CLAUDE.md and MEMORIES.md.
- **Session 7:** Added new scrapers: CyberScoop WP API (all + AI category 6955), Lawfare Playwright, CJEU Infocuria Playwright (pending + closed cases with subject matter filters), Freshfields TQ sitemap scraper, GDPRhub NewPages atom feed. Added Ars Technica, Guardian Technology, SCMP Tech to General Tech (now 11). Added Import AI, CyberScoop AI to AI Updates (now 12). Added Debevoise Data Blog, Lawfare, Freshfields TQ to Global. Added CNIL, GDPRhub, CJEU x2 to EU. Added NIST to US. Added Krebs on Security, CDT, CyberScoop, AlgorithmWatch, CyberInsider to Digital Rights (now 25+). Removed OpenRSS Reuters Technology (always timed out). UI changes: source toggle button (red/green), sources container separation, beta banner, light mode default, section renames, default time filters (48h / 1w for policy). Removed OAIC Australia (no dates). Confirmed Washington Post and Privacy International blocked/down.
