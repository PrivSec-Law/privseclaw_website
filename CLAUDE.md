# privseclaw.info — Project Guide

## What This Is
RSS feed aggregator and blog for privacy law, cybersecurity, digital rights, AI policy, and tech regulation. Static site hosted on Netlify. Feeds are fetched at build time and baked into a JSON file.

## Architecture
- **Static site** — no backend. All feed data fetched at build time by `scripts/build-feeds.mjs`
- **Build output** → `public/` directory (served by Netlify)
- `feeds.config.json` (root) is the source of truth for feed URLs. Copied to `public/` during build.
- `public/feeds-data.json` — generated at build time, contains all fetched articles
- **Twice-daily rebuilds** via Netlify build hook + cron (to be set up)

## Key Files
| File | Purpose |
|------|---------|
| `scripts/build-feeds.mjs` | Build-time feed fetcher (RSS, filtered feeds, ICO/IAPP/Simmons/Bird&Bird scrapers, Reuters sitemap, CyberScoop WP API, Lawfare/CJEU Playwright scrapers, Freshfields sitemap scraper, Playwright fallback) |
| `feeds.config.json` | Feed URL config — categories, subcategories, RSS URLs, `scrape:` and `filter:` prefixed custom sources |
| `public/index.html` | Single-page HTML with tabs: Home, PrivSecLaw News Feeds, PrivSecLaw Blog, PrivSecLaw Resources, Contact. Privacy Notice accessible via burger menu only. Beta banner above sticky header. |
| `public/app.js` | All client-side JS — tab switching, feed rendering, filtering, source toggle, theme toggle, burger menu, guide/resource loading |
| `public/style.css` | CSS with custom properties for dark/light theming |
| `public/guides/*.inc` | Blog post HTML fragments (7 articles), loaded dynamically by app.js |
| `public/resources/*.inc` | Privacy resource page HTML fragments (5 pages), loaded dynamically by app.js |
| `public/images/` | Blog post images (manyscreens.jpg, cryptowars.jpg, aielectionposter.jpg, nsacollectionposture.jpg, nsaprismcollectiondetails.jpg) |
| `package.json` | Build scripts, dependencies (rss-parser, playwright) |

## Feed URL Prefixes
- **No prefix** — standard RSS/Atom feed URL, parsed normally
- **`scrape:`** — routes to a custom scraper function (e.g. `scrape:ico.org.uk`, `scrape:simmons/eu`, `scrape:cyberscoop`, `scrape:lawfare`, `scrape:curia/pending`, `scrape:freshfields-tq`)
- **`filter:`** — fetches an RSS feed then applies a post-fetch filter (e.g. `filter:ec-digital-news`, `filter:proton-privacy-news`)

## Custom Scrapers

### ICO (`scrape:ico.org.uk`)
- **API**: POST `https://ico.org.uk/api/search` with `rootPageId: 2816`
- Returns JSON with news results

### IAPP Algolia (`scrape:iapp.org/*`)
- **Service**: Algolia
- **App ID**: `JQI28CT642` | **API Key**: `05142b663d0923f3d221386f59c9702c`
- **Index**: `all_resource_dates_desc`
- **Filters**: `_content_type:news_article` + facetFilters on `news_tags.law_and_regulation.law_and_regulation`
- **Feeds**: `iapp.org/gdpr+aiact` (EU), `iapp.org/ccpa` (US), `iapp.org/global` (LGPD+PIPL)

### Simmons & Simmons Algolia (`scrape:simmons/*`)
- **Service**: Algolia
- **App ID**: `C9S9O2OFPV` | **API Key**: `7ff1c4d30eee83d68ff7961455930a8f`
- **Index**: `production_public_Insights_News`
- **Filters**: Sector "Technology, Media and Telecommunications" + `parent.__typename:Article` + `applicableLaws.fields.title` for jurisdiction
- **Feeds**: `simmons/eu` (European Union), `simmons/uk` (UK), `simmons/global` (Global), `simmons/me` (Middle East)
- **URL pattern**: `/en/publications/{parentId}/{slug}`
- ~1,738 total TMT articles; well-tagged by jurisdiction

### Bird & Bird Coveo (`scrape:twobirds/tmt`)
- **Service**: Coveo for Sitecore (no auth required)
- **Endpoint**: POST `https://www.twobirds.com/coveo/rest` (form-urlencoded)
- **Query**: `@z95xtemplatename=="T12 Insights Detail" @z95xdatabase=="web" @parsedlanguage=="english" @sectortitles=="Technology & Communications"`
- **Sort**: `@publicationdate descending`
- **Feed**: `twobirds/tmt` under Global (most articles lack country tags, so splitting by jurisdiction loses content)
- **URL fix**: `printableUri` uses `cm.twobirds.com` — must swap to `www.twobirds.com`
- **Title fix**: Strip " - Bird & Bird" suffix
- ~1,696 total TMT insights

### Reuters Sitemap (`scrape:reuters/*`)
- **Method**: Fetches Reuters' open news sitemap (`/arc/outboundfeeds/news-sitemap/`) which is NOT behind Datadome
- **Sitemap**: 17 pages x 100 entries = ~1,700 recent articles with titles, dates, and URLs
- **Filtering**: Regex keyword patterns matched against article titles (e.g. `\bcyber\w*`, `\bransomware\b`, `\bprivacy\b`)
- **Feeds**: `reuters/cyber` (cybersecurity keywords), `reuters/privacy` (data privacy keywords)
- **Note**: Reuters main pages are behind Datadome CAPTCHA (blocks Playwright, patchright, curl). The sitemap is the only open endpoint.
- **Yield**: ~5-10 cybersecurity + ~1-3 privacy articles per 2-3 day window

### CyberScoop WordPress API (`scrape:cyberscoop`, `scrape:cyberscoop/ai`)
- **Type**: `wp-api` — fetches from WordPress REST API
- **Endpoint**: `https://cyberscoop.com/wp-json/wp/v2/posts` with `per_page=100`
- **Feeds**: `cyberscoop` (all posts), `cyberscoop/ai` (category 6955 — AI-specific articles)
- **Used in**: Privacy/Cybersecurity category (all posts), AI Updates category (AI category)

### Lawfare Playwright (`scrape:lawfare`)
- **Type**: `playwright-scrape` — uses headless Chromium to scrape rendered page
- **Target**: `https://www.lawfaremedia.org` homepage
- **Method**: Playwright loads the homepage, extracts article links and publication dates from the rendered DOM
- **Build time**: ~10s
- **Used in**: Tech Law > Global

### CJEU Playwright (`scrape:curia/pending`, `scrape:curia/closed`)
- **Type**: `playwright-scrape` — scrapes Infocuria (CJEU case search)
- **Subject matter filters**: ICT, digital markets/services, personal data
- **Two feeds**:
  - `curia/pending` — pending cases sorted by introduction date (`INTRODUCTION_DATE-DESC`)
  - `curia/closed` — decided cases sorted by closure date (`CLOSE_DATE-DESC`). Extracts the closure date (second date) instead of intro date.
- **Wait strategy**: Uses `networkidle` + 8s timeout. The Infocuria SPA will NOT render results with `domcontentloaded` alone.
- **Build time**: ~40s total for both feeds (~20s each)
- **Used in**: Tech Law > EU

### Freshfields TQ Sitemap (`scrape:freshfields-tq`)
- **Type**: `sitemap-scrape` — fetches sitemap XML from `https://technologyquotient.freshfields.com/sitemap`
- **Method**: Parses sitemap, filters URLs matching `/post/`, extracts `lastmod` dates
- **Title generation**: Titles generated from URL slugs (slug-to-title conversion)
- **Used in**: Tech Law > Global

### GDPRhub (NewPages Atom Feed)
- **URL**: `https://gdprhub.eu/index.php?title=Special:NewPages&feed=atom&hideredirs=1&limit=10&render=1`
- **Method**: Standard atom feed from MediaWiki Special:NewPages (NOT Recent Changes — that feed is useless wiki diffs)
- **Description extraction**: Parsed from wiki markup between `}}<br />` and `== English Summary ==`
- **Used in**: Tech Law > EU

## Filtered Feeds
- `filter:ec-digital-news` — EU Commission digital strategy RSS, filtered to `/en/news/` URLs only
- `filter:eulawblog-dataprotection` — European Law Blog RSS (PubPub platform), filtered to "data protection" / "digital governance" categories. Note: RSS limited to 25 items, tag-based feeds don't work (PubPub ignores `?tag=` param). Low volume — only ~2-3 matches per 2 months.
- `filter:eulawblog-ai` — European Law Blog RSS, filtered to "artificial intelligence" category
- `filter:fcc-tmt` — Multi-URL filtered feed pulling from FCC News_Release, Statement, and RO_NPRM RSS feeds, filtered by TMT keywords (broadband, spectrum, telecom, privacy, AI, etc.). Uses `urls` array in config. Reduced from 23 noisy items to ~1-3 relevant TMT items.
- `filter:proton-privacy-news` — Proton Blog RSS, filtered to "Privacy news" category only (excludes guides, business, product posts)

## Theming
- Light theme (default): warm cream/beige tones with teal accent (`#0FA4AF`)
- Dark theme: CSS variables in `:root`, activated for users with `prefers-color-scheme: dark`
- Theme persists via `localStorage.getItem("theme")`
- Self-executing init function applies theme before DOMContentLoaded to prevent flash
- Teal text selection sitewide: `::selection { background: rgba(15, 164, 175, 0.4); color: #fff; }`

## Typography
- **Three-tier font system**: Playfair Display (headings h1-h6, section headings, card titles), Merriweather (body/serif text), Inter (UI elements, buttons, nav, filters)
- **Font sizes**: Body base `1.2rem` with `1rem` overrides on `.header-sticky` and `.tab-nav` to keep UI chrome compact
- Google Fonts loaded: `Inter:wght@400;500;600;700`, `Merriweather:ital,wght@0,300;0,400;0,700;1,400`, `Playfair Display:ital,wght@0,400;0,700;1,400`

## Feed Categories (current)

### 1. General Tech (11 feeds)
The Register, The Verge, TechCrunch, BBC Tech, Der Standard (German), Bloomberg Technology, NYT Technology, MIT Technology Review, Ars Technica, The Guardian: Technology, South China Morning Post: Tech

### 2. AI Updates (12 feeds)
Luiza's Newsletter, Decoding Discontinuity, AI Safety Newsletter, The AI Ethics Brief, EU AI Act Newsletter, The Guardian AI, AI Now Institute, MIT News ML, The Register AI/ML, Import AI, CyberScoop AI (WP API scraper, category 6955)

### 3. Tech Law | Policy | Regulatory
- **Global**: Tech Policy Press, IAPP (LGPD+PIPL), Simmons & Simmons (Global), Bird & Bird (TMT), Debevoise Data Blog, Lawfare (Playwright scraper), Freshfields TQ (sitemap scraper)
- **EU**: Euractiv Tech, Politico EU Tech, EDPB, EDPS, IAPP (GDPR+AI Act), EU Commission Digital, European Law Blog (DP + AI), Simmons & Simmons (EU), EJLT, noyb, EU AI Act Newsletter, CNIL, GDPRhub (NewPages atom feed), CJEU New Cases (Playwright), CJEU Decided Cases (Playwright)
- **UK**: ICO, Simmons & Simmons (UK)
- **US**: IAPP (CCPA/CPRA), CPPA, FCC TMT (filtered), NIST
- **Middle East**: Simmons & Simmons (Middle East)

### 4. Privacy | Cybersecurity | Digital Rights & Society (25+ feeds)
EFF, Guardian Privacy, Guardian Surveillance, Access Now, EDRi, Big Brother Watch, Privacy Guides (News + Articles), PrivSec.dev, Schneier on Security, EPIC, The Record, arXiv cs.CY, 404 Media, WIRED Security, Proton Blog (filtered), netzpolitik.org (German), noyb, Mozilla Foundation, The Markup, Krebs on Security, CDT, CyberScoop (WP API), AlgorithmWatch, Reuters (cyber + privacy via sitemap), CyberInsider

## UI Features

### Beta Banner
- Teal gradient banner displayed above the sticky header
- Scrolls away with page content (not sticky)

### Source Toggle Button
- "Deselect All" (red) / "Select All" (green) toggle in the feed source filter
- Red/green color coding for toggle states

### Sources Container
- Feed source checkboxes in a separate `#feed-sources` div above `#feed-items`
- Prevents layout shift when toggling sources on/off

### Section Names
- News tab: "PrivSecLaw News Feeds"
- Resources tab: "PrivSecLaw Resources"

### Default Time Filters
- 48h for most feed categories
- 1 week for policy/law feeds

## Blog (PrivSecLaw Blog)
7 articles in two sections, loaded as HTML fragments from `public/guides/`:
- **Our Digital Reality**: we-are-being-watched, engineering-of-consent, encryption-under-attack
- **Reclaim Your Privacy**: threat-modelling, digital-security, escaping-the-privacy-paradox, futo-keyboard-review
- Articles imported from old Hugo site (Website1). Hugo shortcodes converted: `{{< youtube ID >}}` → privacy-enhanced click-to-load embed (youtube-nocookie.com), `{{< ref >}}` → internal links, `{{< figure >}}` → `<img>` tags
- Guide metadata defined in `GUIDES` array in app.js (slug, title, date, description, cover image, section)

## Privacy Resources
5 resource pages loaded as HTML fragments from `public/resources/`:
- books-and-articles, content-creators, online-communities, videos-and-film, websites-and-guides
- Card-based layout with teal accents and hover effects
- Resource metadata defined in `RESOURCES` array in app.js

## Home Page
- Centred hero layout: circular eye image, "PRIVSECLAW.INFO" in Playfair Display, subtitle, placeholder text (draft done, needs finalization)
- Latest Headlines on News tab: pulls from all categories, weighted sort (Digital Rights, AI, Law/Policy get 12h time boost). Shows all items — limited by timeframe filter only, not count.

## News Page Layout
- Category cards in a row at top (flex, equal width, vertically centred text)
- Latest headlines below in 3-column layout (`columns: 3`)
- Feed view also 3-column layout
- Subcategory cards centred with flexbox
- Time filter buttons: 24h, 48h, 1w, 2w, 1m, 3m, 6m
- Sticky back buttons with teal pill styling, pinned below header

## CSS Patterns
- **Scrollbar fix**: `html { overflow-y: scroll; }` prevents layout shift when switching tabs
- **Multi-column feeds**: `columns: 3; column-gap: 2rem; break-inside: avoid;` with mobile fallback to 1 column
- **Centred card grids**: `display: flex; flex-wrap: wrap; justify-content: center;` for subcategories and resources
- **News landing cards**: `display: flex; align-items: stretch;` with cards as `flex: 1; display: flex; align-items: center; justify-content: center;`
- **Sticky breadcrumb**: `position: sticky; top: 91px; z-index: 50;`

## Build Commands
```bash
npm run build    # Install Playwright Chromium, fetch all feeds, copy config to public/
npm run dev      # Build + serve locally with npx serve
```

## Build Performance
- **Playwright scrapers add ~60s to build time**:
  - CJEU (x2 feeds) = ~40s total
  - Lawfare = ~10s
  - Euractiv browser fallback = ~5s
- CJEU Infocuria requires `networkidle` wait strategy (NOT `domcontentloaded`) — it is a SPA that won't render results otherwise
- If build hangs due to zombie Chromium processes: `pkill -f chromium`
- OpenRSS Reuters Technology was removed (always timed out with VPN; will work on Netlify without VPN)

## Playwright
Used for:
1. **Cloudflare fallback** — bypass JS challenges on protected RSS feeds (e.g., Euractiv). Uses `--headless=new` Chrome mode.
2. **Lawfare scraper** — homepage article extraction
3. **CJEU Infocuria scraper** — case search with subject matter filters
4. Netlify build requires `npx playwright install chromium --with-deps` first.

## Build Script Utilities
- **`decodeEntities(text)`** — Strips HTML tags, converts named entities (`&amp;`, `&lt;`, etc.) and numeric entities (`&#8216;`, `&#8217;`, etc.) to proper characters. Applied to all feed titles.
- **`cleanSnippet(text, maxLen)`** — Calls `decodeEntities`, strips arXiv prefixes (`arXiv:...Announce Type:...Abstract:`), collapses whitespace, truncates with ellipsis. Used for all feed descriptions.
- **`fetchFilteredFeed(config)`** — Supports both single `url` and `urls` array. Fetches all URLs, applies filter function, returns clean items.
- **`SOURCE_OVERRIDES`** — Maps feed URLs to clean display names (e.g. `"https://feeds.bloomberg.com/technology/news.rss": "Bloomberg Technology"`)

## Important Notes
- `feeds.config.json` exists in BOTH root and `public/` — always keep in sync (build script copies root → public)
- SOURCE_OVERRIDES in build-feeds.mjs maps feed URLs to clean display names
- The "Global" subcategory under Tech Law merges items from ALL other subcategories at build time
- No analytics, no cookies, no personal data processing — footer and privacy notice state this explicitly
- Same feed can appear in multiple categories (e.g. noyb in both EU and Digital Rights, EU AI Act Newsletter in both AI and EU)
- German-language feeds: Der Standard (General Tech), netzpolitik.org (Digital Rights) — translation feature planned but not yet implemented
- Lexology — completely behind Cloudflare enterprise (no public API). Cannot be scraped. Dropped.
- Washington Post — completely blocks all scraping attempts. Skip.
- Privacy International — website was returning 500 errors. Revisit later.

## Pending / TODO
1. **Translation of non-English headlines** — discussed using `google-translate-api-x` npm package (no account needed). On hold.
2. **Home page text** — draft done, needs finalization
3. **Netlify build hook + cron** — set up twice-daily automated rebuilds
4. **Privacy International** — site was down (HTTP 500), revisit later
5. **Washington Post** — completely blocked, skip
6. **Lexology** — Cloudflare enterprise blocked, skip
