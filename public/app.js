// --- HTML Entity Decoder ---
const _decodeEl = document.createElement("textarea");
function decodeEntities(str) {
  if (!str) return str;
  _decodeEl.innerHTML = str;
  return _decodeEl.value;
}

// --- URL Routing Maps ---
const TAB_TO_PATH = {
  home: "/",
  news: "/news",
  guides: "/blog",
  resources: "/privacy-resources",
  contact: "/contact",
  privacy: "/privacy-notice",
};
const PATH_TO_TAB = Object.fromEntries(
  Object.entries(TAB_TO_PATH).map(([k, v]) => [v, k])
);
PATH_TO_TAB["/home"] = "home";

const CATEGORY_SLUGS = {
  "General Tech": "general-tech",
  "AI Updates": "ai-updates",
  "Tech Law | Policy | Regulatory": "tech-law",
  "Privacy | Security | Digital Rights": "privacy-security",
};
const SLUG_TO_CATEGORY = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([k, v]) => [v, k])
);

const SUBCATEGORY_SLUGS = {
  Global: "global",
  EU: "eu",
  UK: "uk",
  US: "us",
  "Middle East": "middle-east",
};
const SLUG_TO_SUBCATEGORY = Object.fromEntries(
  Object.entries(SUBCATEGORY_SLUGS).map(([k, v]) => [v, k])
);

// --- Guides Data ---
const GUIDES = [
  {
    slug: "we-are-being-watched",
    title: "We are Being Watched: Privacy, Security and the Law in a Hyper-Digitized Age",
    date: "2023-12-26",
    description: "We are being watched. Every second of everyday.",
    cover: "/images/manyscreens.jpg",
    section: "Our Digital Reality",
  },
  {
    slug: "engineering-of-consent",
    title: "The Engineering of Consent: Political Microtargeting",
    date: "2024-04-08",
    description: "The future of political advertising and online manipulation.",
    cover: "/images/aielectionposter.jpg",
    section: "Our Digital Reality",
  },
  {
    slug: "encryption-under-attack",
    title: "Encryption Under Attack (Yet Again)",
    date: "2024-05-06",
    description: "The global push to undermine your privacy and security through client side scanning.",
    cover: "/images/cryptowars.jpg",
    section: "Our Digital Reality",
  },
  {
    slug: "threat-modelling",
    title: "Reclaim your Privacy | Part 1: Threat Modelling",
    date: "2024-01-08",
    description: "Part 1 out of 3 on how to protect yourself online and regain control over your privacy.",
    cover: "/images/threatmodelcover.jpg",
    series: "Reclaim your Privacy",
    part: 1,
  },
  {
    slug: "digital-security",
    title: "Reclaim Your Privacy | Part 2: Digital Security",
    date: "2024-02-01",
    description: "Part 2 out of 3 on how to protect yourself online and regain control over your privacy.",
    cover: "/images/securitycover.jpg",
    series: "Reclaim your Privacy",
    part: 2,
  },
  {
    slug: "escaping-the-privacy-paradox",
    title: "Reclaim your Privacy | Part 3: Escaping the Privacy Paradox",
    date: "2024-04-04",
    description: "Part 3 out of 3 on how to protect yourself online and regain control over your privacy.",
    cover: "/images/facebookwatchingscreen.jpg",
    series: "Reclaim your Privacy",
    part: 3,
  },
  {
    slug: "futo-keyboard-review",
    title: "FUTO Keyboard Review: An Android Keyboard that is Private and Functional",
    section: "Reviews & Showcases",
    date: "2024-07-03",
    description: "Your Android keyboard could be a security and privacy risk. Here is why you should use FUTO Keyboard instead!",
    cover: "/images/futokeyboardlogo.jpg",
  },
];

const RESOURCES = [
  {
    slug: "websites-and-guides",
    title: "Websites & Guides",
    description: "Websites that can serve as your guides to personal privacy and security.",
  },
  {
    slug: "books-and-articles",
    title: "Books & Articles",
    description: "My personal library on all things privacy, surveillance and cybersecurity.",
  },
  {
    slug: "videos-and-film",
    title: "Videos, Speeches & Film",
    description: "Engaging documentaries, speeches, films and T.V shows on all things privacy.",
  },
  {
    slug: "content-creators",
    title: "Content Creators",
    description: "Follow these content creators to learn about privacy.",
  },
  {
    slug: "online-communities",
    title: "Online Communities",
    description: "Join and follow these online privacy related communities to engage with others.",
  },
];

const CATEGORY_META = {
  "General Tech": { accent: "#5E81AC" },
  "AI Updates": { accent: "#B48EAD" },
  "Tech Law | Policy | Regulatory": { accent: "#EBCB8B" },
  "Privacy, Security & Digital Rights": { accent: "#A3BE8C" },
};

const SUBCATEGORY_META = {
  EU: { accent: "#5E81AC" },
  UK: { accent: "#81A1C1" },
  US: { accent: "#8FBCBB" },
  "Middle East": { accent: "#88C0D0" },
};

const state = {
  data: null,
  currentCategory: null,
  returnTo: "home",
  feedItems: [],       // unfiltered items for current feed view
  feedTitle: "",
  feedAccent: null,
  timeFilter: "48h",   // "24h", "48h", "1w", "2w", "1m", "3m", "6m"
  excludedSources: new Set(),
};

// --- Theme ---
(function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    /* user explicitly chose dark — stay dark */
  } else if (saved === "light" || !window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.body.classList.add("light");
  }
})();

// --- URL Routing ---
function updateURL(path, replace = false) {
  const titles = {
    "/": "Home",
    "/news": "PrivSecLaw News",
    "/blog": "PrivSecLaw Blog",
    "/privacy-resources": "PrivSecLaw Resources",
    "/contact": "Contact",
    "/privacy-notice": "Privacy Notice",
  };
  document.title = titles[path] || (state.feedTitle ? state.feedTitle : "privseclaw.info");

  if (window.location.pathname !== path) {
    const method = replace ? "replaceState" : "pushState";
    history[method]({ path }, "", path);
  }
}

// --- Init ---
document.addEventListener("DOMContentLoaded", async () => {
  // Theme toggle
  document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
  });

  // Shared tab-switching helper
  function switchTab(tabName, pushURL = true, resetNews = true) {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
    const tabBtn = document.querySelector(`.tab[data-tab="${tabName}"]`);
    if (tabBtn) tabBtn.classList.add("active");
    document.getElementById(`tab-${tabName}`).classList.add("active");
    // Sync burger menu active state
    document.querySelectorAll(".burger-item").forEach((b) => {
      b.classList.toggle("active", b.dataset.tab === tabName);
    });
    // Reset news to category cards when switching to news tab
    if (tabName === "news" && state.data && resetNews) {
      renderHome(state.data);
    }
    // Render guides list when switching to guides tab
    if (tabName === "guides") {
      renderGuidesList();
    }
    // Render resources list when switching to resources tab
    if (tabName === "resources") {
      renderResourcesList();
    }
    if (pushURL) {
      updateURL(TAB_TO_PATH[tabName] || "/");
    }
  }

  function navigateToPath(pathname, pushState = true) {
    if (!state.data) return;
    window.scrollTo(0, 0);

    const path = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
    const segments = path.split("/").filter(Boolean);

    // Case 1: Home or unknown root
    if (segments.length === 0 || segments[0] === "home") {
      switchTab("home", pushState);
      return;
    }

    // Case 2: Blog deep link (/blog/{slug})
    if (segments[0] === "blog" && segments.length === 2) {
      const guideSlug = segments[1];
      const guide = GUIDES.find((g) => g.slug === guideSlug);
      if (guide) {
        switchTab("guides", false);
        renderGuidesList();
        loadGuideArticle(guideSlug);
        if (pushState) updateURL(path);
        return;
      }
    }

    // Case 2b: Resource deep link (/privacy-resources/{slug})
    if (segments[0] === "privacy-resources" && segments.length === 2) {
      const resourceSlug = segments[1];
      const resource = RESOURCES.find((r) => r.slug === resourceSlug);
      if (resource) {
        switchTab("resources", false);
        renderResourcesList();
        loadResourceArticle(resourceSlug);
        if (pushState) updateURL(path);
        return;
      }
    }

    // Case 3: Simple tab (blog, guides, etc.)
    const tabName = PATH_TO_TAB["/" + segments[0]];
    if (tabName && tabName !== "news") {
      switchTab(tabName, pushState);
      return;
    }

    if (segments[0] !== "news") {
      switchTab("home", pushState);
      return;
    }

    // Case 3: /news — category cards
    switchTab("news", false, false);

    if (segments.length === 1) {
      renderHome(state.data);
      if (pushState) updateURL("/news");
      return;
    }

    // Case 4: /news/{category-slug}
    const catName = SLUG_TO_CATEGORY[segments[1]];
    if (!catName) {
      renderHome(state.data);
      if (pushState) updateURL("/news", true);
      return;
    }
    const cat = state.data.categories.find((c) => c.name === catName);
    if (!cat) {
      renderHome(state.data);
      if (pushState) updateURL("/news", true);
      return;
    }

    if (segments.length === 2) {
      if (cat.subcategories) {
        renderSubcategories(cat);
      } else {
        const meta = CATEGORY_META[cat.name] || {};
        renderFeeds(cat.name, cat.items || [], "home", meta.accent);
      }
      if (pushState) updateURL(path);
      return;
    }

    // Case 5: /news/{category-slug}/{subcategory-slug}
    if (segments.length === 3 && cat.subcategories) {
      const subName = SLUG_TO_SUBCATEGORY[segments[2]];
      const sub = subName ? cat.subcategories.find((s) => s.name === subName) : null;
      if (sub) {
        state.currentCategory = cat;
        const meta = SUBCATEGORY_META[sub.name] || {};
        renderFeeds(sub.name, sub.items, "subcategories", meta.accent);
        if (pushState) updateURL(path);
      } else {
        renderSubcategories(cat);
        if (pushState) updateURL(`/news/${segments[1]}`, true);
      }
      return;
    }

    // Fallback
    renderHome(state.data);
    if (pushState) updateURL("/news", true);
  }

  // Tab switching
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });

  // Burger menu
  const burgerBtn = document.getElementById("burger-btn");
  const burgerMenu = document.getElementById("burger-menu");
  burgerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    burgerBtn.classList.toggle("active");
    burgerMenu.classList.toggle("open");
    // Set active state on current tab
    const activeTab = document.querySelector(".tab.active");
    if (activeTab) {
      document.querySelectorAll(".burger-item").forEach((b) => {
        b.classList.toggle("active", b.dataset.tab === activeTab.dataset.tab);
      });
    }
  });
  document.querySelectorAll(".burger-item").forEach((item) => {
    item.addEventListener("click", () => {
      switchTab(item.dataset.tab);
      burgerMenu.classList.remove("open");
      burgerBtn.classList.remove("active");
    });
  });
  // Close burger menu on outside click
  document.addEventListener("click", () => {
    burgerMenu.classList.remove("open");
    burgerBtn.classList.remove("active");
  });
  burgerMenu.addEventListener("click", (e) => e.stopPropagation());

  // Back buttons
  document.getElementById("back-to-home").addEventListener("click", () => {
    renderHome(state.data);
    updateURL("/news");
  });
  document.getElementById("back-from-feeds").addEventListener("click", () => {
    if (state.returnTo === "subcategories" && state.currentCategory) {
      const catSlug = CATEGORY_SLUGS[state.currentCategory.name];
      renderSubcategories(state.currentCategory);
      updateURL(`/news/${catSlug}`);
    } else {
      renderHome(state.data);
      updateURL("/news");
    }
  });
  // Back to guides list
  document.getElementById("back-to-guides").addEventListener("click", () => {
    switchGuideView("list");
    updateURL("/blog");
    window.scrollTo(0, 0);
  });
  // Back to resources list
  document.getElementById("back-to-resources").addEventListener("click", () => {
    switchResourceView("list");
    updateURL("/privacy-resources");
    window.scrollTo(0, 0);
  });

  // Title click goes to Home tab
  document.getElementById("home-link").addEventListener("click", () => {
    switchTab("home");
  });

  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const filterType = btn.dataset.filter;
      const value = btn.dataset.value;

      // Update active state for this filter group
      document.querySelectorAll(`.filter-btn[data-filter="${filterType}"]`).forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      if (filterType === "time") {
        state.timeFilter = value;
      }

      // Re-render with filters
      if (state.feedItems.length > 0) {
        renderFeedItems(applyFilters(state.feedItems));
      }
    });
  });

  // Popstate handler for browser back/forward
  window.addEventListener("popstate", () => {
    if (!state.data) return;
    navigateToPath(window.location.pathname, false);
    updateURL(window.location.pathname, true); // update title without pushing
  });

  try {
    const data = await fetch("/feeds-data.json").then((r) => r.json());
    state.data = data;
    renderHomePage(data);
    // Route to current URL (deep link support)
    navigateToPath(window.location.pathname, false);
    updateURL(window.location.pathname, true); // set title + replaceState
  } catch {
    document.getElementById("home-latest-items").innerHTML =
      '<p class="loading">Unable to load feed data.</p>';
    document.getElementById("view-home").innerHTML =
      '<p class="loading">Unable to load feed data.</p>';
    switchView("home");
  }
});

// --- View Switching ---
function switchView(name) {
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  const target = document.getElementById(`view-${name}`);
  if (target) target.classList.add("active");
}

// --- Timestamp ---
function updateTimestamp(data) {
  const el = document.getElementById("updated-at");
  if (data.updatedAt) {
    const d = new Date(data.updatedAt);
    el.textContent = `${d.toLocaleDateString("en-GB")} ${d.toLocaleTimeString()}`;
  }
}

// --- Render Home Page (Home tab) ---
function renderHomePage(data) {
  updateTimestamp(data);
  const container = document.getElementById("home-latest-items");
  container.innerHTML = "";

  // Priority categories get weighted higher in the home feed
  const PRIORITY_CATEGORIES = new Set([
    "Privacy, Security & Digital Rights",
    "AI Updates",
    "Tech Law | Policy | Regulatory",
  ]);

  // Collect items tagged with their category priority
  const allItems = [];
  for (const cat of data.categories) {
    const priority = PRIORITY_CATEGORIES.has(cat.name);
    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        for (const item of sub.items) {
          allItems.push({ ...item, _priority: priority });
        }
      }
    } else if (cat.items) {
      for (const item of cat.items) {
        allItems.push({ ...item, _priority: priority });
      }
    }
  }

  // Deduplicate by link (keep first = highest priority if dupe across categories)
  const seen = new Set();
  const unique = allItems.filter((item) => {
    if (seen.has(item.link)) return false;
    seen.add(item.link);
    return true;
  });

  // Weighted sort: priority items get a 12-hour time boost so they rank higher
  const BOOST_MS = 12 * 60 * 60 * 1000;
  unique.sort((a, b) => {
    const aTime = new Date(a.pubDate).getTime() + (a._priority ? BOOST_MS : 0);
    const bTime = new Date(b.pubDate).getTime() + (b._priority ? BOOST_MS : 0);
    return bTime - aTime;
  });
  const latest = unique.slice(0, 25);

  if (latest.length === 0) {
    container.innerHTML = '<p class="empty-note">No items yet.</p>';
    return;
  }

  for (const item of latest) {
    const el = document.createElement("div");
    el.className = "feed-item";

    const link = document.createElement("a");
    link.href = item.link;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = decodeEntities(item.title);
    el.appendChild(link);

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.innerHTML = `<span>${escapeHtml(item.source)}</span>`;
    if (item.pubDate) {
      meta.innerHTML += `<span>${timeAgo(new Date(item.pubDate))}</span>`;
    }
    el.appendChild(meta);

    container.appendChild(el);
  }
}

// --- Render News Home (category cards) ---
function renderHome(data) {
  updateTimestamp(data);
  const grid = document.getElementById("category-cards");
  grid.innerHTML = "";

  for (const cat of data.categories) {
    const meta = CATEGORY_META[cat.name] || {};

    const itemCount = cat.subcategories
      ? cat.subcategories.reduce((sum, s) => sum + s.items.length, 0)
      : cat.items
        ? cat.items.length
        : 0;

    const card = document.createElement("div");
    card.className = "category-card";
    card.style.setProperty("--accent-color", meta.accent || "#4C566A");

    card.innerHTML =
      `<div class="card-accent"></div>` +
      `<h2>${escapeHtml(cat.name)}</h2>` +
      `<span class="card-count">${itemCount} item${itemCount !== 1 ? "s" : ""}</span>`;

    card.addEventListener("click", () => onCategoryClick(cat));
    grid.appendChild(card);
  }

  switchView("home");
}

// --- Category Click ---
function onCategoryClick(cat) {
  const catSlug = CATEGORY_SLUGS[cat.name];
  if (cat.subcategories) {
    renderSubcategories(cat);
  } else {
    const meta = CATEGORY_META[cat.name] || {};
    renderFeeds(cat.name, cat.items || [], "home", meta.accent);
  }
  updateURL(`/news/${catSlug}`);
}

// --- Render Subcategories ---
function renderSubcategories(cat) {
  state.currentCategory = cat;
  document.getElementById("subcategory-title").textContent = cat.name;

  const grid = document.getElementById("subcategory-cards");
  grid.innerHTML = "";

  for (const sub of cat.subcategories) {
    const meta = SUBCATEGORY_META[sub.name] || {};

    const card = document.createElement("div");
    card.className = "category-card";
    card.style.setProperty("--accent-color", meta.accent || "#4C566A");

    card.innerHTML =
      `<div class="card-accent"></div>` +
      `<h2>${escapeHtml(sub.name)}</h2>` +
      `<span class="card-count">${sub.items.length} item${sub.items.length !== 1 ? "s" : ""}</span>`;

    card.addEventListener("click", () => {
      const catSlug = CATEGORY_SLUGS[cat.name];
      const subSlug = SUBCATEGORY_SLUGS[sub.name];
      renderFeeds(sub.name, sub.items, "subcategories", meta.accent);
      updateURL(`/news/${catSlug}/${subSlug}`);
    });
    grid.appendChild(card);
  }

  switchView("subcategories");
}

// --- Filter Logic ---
function applyFilters(items) {
  let filtered = items;

  // Time filter
  const now = Date.now();
  const cutoffs = { "24h": 24 * 60 * 60 * 1000, "48h": 48 * 60 * 60 * 1000, "1w": 7 * 24 * 60 * 60 * 1000, "2w": 14 * 24 * 60 * 60 * 1000, "1m": 30 * 24 * 60 * 60 * 1000, "3m": 90 * 24 * 60 * 60 * 1000, "6m": 180 * 24 * 60 * 60 * 1000 };
  const cutoff = cutoffs[state.timeFilter];
  if (cutoff) {
    filtered = filtered.filter((item) => {
      if (!item.pubDate) return true;
      return now - new Date(item.pubDate).getTime() <= cutoff;
    });
  }

  // Source filter
  if (state.excludedSources.size > 0) {
    filtered = filtered.filter((item) => !state.excludedSources.has(item.source));
  }

  return filtered;
}

// --- Render Feeds ---
const CATEGORY_DEFAULT_TIME = {
  "General Tech": "24h",
};

function renderFeeds(title, items, returnTo, accent) {
  state.returnTo = returnTo;
  state.feedItems = items;
  state.excludedSources = new Set();
  state.feedTitle = title;
  state.feedAccent = accent;

  // Set per-category default time filter (check parent category for subcategories)
  const parentName = state.currentCategory?.name || title;
  const defaultTime = CATEGORY_DEFAULT_TIME[parentName] || CATEGORY_DEFAULT_TIME[title] || "48h";
  state.timeFilter = defaultTime;
  document.querySelectorAll('.filter-btn[data-filter="time"]').forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.value === defaultTime);
  });

  document.getElementById("feed-view-title").textContent = title;

  renderFeedItems(applyFilters(items));
  switchView("feeds");
}

function renderFeedItems(items) {
  const container = document.getElementById("feed-items");
  container.innerHTML = "";

  // Show sources list in separate container above columns
  const sourcesContainer = document.getElementById("feed-sources");
  sourcesContainer.innerHTML = "";
  const sources = new Map();
  for (const item of state.feedItems) {
    if (item.source && !sources.has(item.source)) {
      sources.set(item.source, item.sourceUrl || "");
    }
  }
  if (sources.size > 0) {
    const sourcesDiv = document.createElement("div");
    sourcesDiv.className = "feed-sources";
    const label = document.createElement("span");
    label.className = "sources-label";
    label.textContent = "Sources";
    sourcesDiv.appendChild(label);
    // Toggle all button
    const toggleAll = document.createElement("button");
    const allExcluded = sources.size > 0 && state.excludedSources.size >= sources.size;
    toggleAll.className = "source-badge source-toggle-all" + (allExcluded ? " select-all" : "");
    toggleAll.textContent = allExcluded ? "Select All" : "Deselect All";
    toggleAll.addEventListener("click", () => {
      if (state.excludedSources.size >= sources.size) {
        state.excludedSources.clear();
      } else {
        for (const [name] of sources) state.excludedSources.add(name);
      }
      renderFeedItems(applyFilters(state.feedItems));
    });
    sourcesDiv.appendChild(toggleAll);
    for (const [name] of sources) {
      const badge = document.createElement("button");
      badge.className = "source-badge";
      if (state.excludedSources.has(name)) badge.classList.add("excluded");
      badge.textContent = name;
      badge.addEventListener("click", () => {
        if (state.excludedSources.has(name)) {
          state.excludedSources.delete(name);
        } else {
          state.excludedSources.add(name);
        }
        renderFeedItems(applyFilters(state.feedItems));
      });
      sourcesDiv.appendChild(badge);
    }
    sourcesContainer.appendChild(sourcesDiv);
  }

  if (items.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.className = "empty-note";
    emptyMsg.textContent = "No items match the current filters.";
    container.appendChild(emptyMsg);
    return;
  }

  for (const item of items) {
    const el = document.createElement("div");
    el.className = "feed-item";

    const link = document.createElement("a");
    link.href = item.link;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = decodeEntities(item.title);
    el.appendChild(link);

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.innerHTML = `<span>${escapeHtml(item.source)}</span>`;
    if (item.pubDate) {
      meta.innerHTML += `<span>${timeAgo(new Date(item.pubDate))}</span>`;
    }
    el.appendChild(meta);

    if (item.snippet) {
      const snippet = document.createElement("p");
      snippet.className = "snippet";
      snippet.textContent = item.snippet;
      el.appendChild(snippet);
    }

    container.appendChild(el);
  }
}

// --- Blog / Guides ---
function renderGuidesList() {
  const grid = document.getElementById("guides-cards");
  grid.innerHTML = "";

  /* Defined section order — sections appear even if empty */
  const SECTION_ORDER = ["Our Digital Reality", "Reclaim your Privacy", "Reviews & Showcases"];

  const sections = [];
  const sectionMap = new Map();

  for (const guide of GUIDES) {
    const sectionName = guide.series || guide.section || "Other";
    if (!sectionMap.has(sectionName)) {
      sectionMap.set(sectionName, []);
      sections.push(sectionName);
    }
    sectionMap.get(sectionName).push(guide);
  }

  // Use defined order; any unlisted sections appear at the end
  const orderedSections = [...SECTION_ORDER, ...sections.filter((s) => !SECTION_ORDER.includes(s))];

  const isMobile = window.innerWidth <= 700;

  for (const sectionName of orderedSections) {
    const headingRow = document.createElement("div");
    headingRow.className = "guides-section-header";

    const heading = document.createElement("h2");
    heading.className = "guides-section-heading";
    heading.textContent = sectionName;
    headingRow.appendChild(heading);

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "guides-section-toggle";
    toggleBtn.textContent = isMobile ? "Show Posts" : "Hide Posts";
    headingRow.appendChild(toggleBtn);

    grid.appendChild(headingRow);

    const guides = sectionMap.get(sectionName) || [];
    if (guides.length === 0) {
      const placeholder = document.createElement("p");
      placeholder.className = "guides-section-placeholder";
      placeholder.textContent = "Coming soon.";
      grid.appendChild(placeholder);
      continue;
    }

    const sectionGrid = document.createElement("div");
    sectionGrid.className = "guides-section-grid";
    if (isMobile) sectionGrid.classList.add("collapsed");

    toggleBtn.addEventListener("click", () => {
      sectionGrid.classList.toggle("collapsed");
      toggleBtn.textContent = sectionGrid.classList.contains("collapsed") ? "Show Posts" : "Hide Posts";
    });

    for (const guide of guides) {
      const card = document.createElement("div");
      card.className = "guide-card";

      const img = document.createElement("img");
      img.src = guide.cover;
      img.alt = "";
      img.className = "guide-card-img";
      img.loading = "lazy";
      card.appendChild(img);

      const body = document.createElement("div");
      body.className = "guide-card-body";

      const title = document.createElement("h3");
      title.textContent = guide.title;
      body.appendChild(title);

      const date = document.createElement("time");
      date.dateTime = guide.date;
      date.textContent = new Date(guide.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
      body.appendChild(date);

      const desc = document.createElement("p");
      desc.textContent = guide.description;
      body.appendChild(desc);

      card.appendChild(body);

      card.addEventListener("click", () => {
        loadGuideArticle(guide.slug);
        updateURL(`/blog/${guide.slug}`);
      });

      sectionGrid.appendChild(card);
    }

    grid.appendChild(sectionGrid);
  }

  // Show list view, hide article view
  switchGuideView("list");
}

function switchGuideView(view) {
  const list = document.getElementById("view-guides-list");
  const article = document.getElementById("view-guides-article");
  if (list) list.classList.toggle("active", view === "list");
  if (article) article.classList.toggle("active", view === "article");
}

async function loadGuideArticle(slug) {
  const container = document.getElementById("guide-content");
  container.innerHTML = '<p class="loading">Loading guide...</p>';
  switchGuideView("article");
  window.scrollTo(0, 0);

  try {
    const res = await fetch(`/guides/${slug}.inc`);
    if (!res.ok) throw new Error(`${res.status}`);
    const html = await res.text();
    container.innerHTML = html;

    // Set page title
    const guide = GUIDES.find((g) => g.slug === slug);
    if (guide) {
      document.title = guide.title;
    }

    // Activate YouTube click-to-load placeholders
    container.querySelectorAll(".youtube-placeholder").forEach((placeholder) => {
      placeholder.addEventListener("click", () => {
        const videoId = placeholder.dataset.videoId;
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
        iframe.width = "100%";
        iframe.height = "100%";
        iframe.frameBorder = "0";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        placeholder.innerHTML = "";
        placeholder.classList.add("youtube-active");
        placeholder.appendChild(iframe);
      });
    });

    // Handle internal guide links
    container.querySelectorAll('a[href^="/blog/"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const guideSlug = link.getAttribute("href").replace("/blog/", "");
        loadGuideArticle(guideSlug);
        updateURL(`/blog/${guideSlug}`);
      });
    });
    container.querySelectorAll('a[href="/privacy-resources"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        // switchTab is inside DOMContentLoaded closure, so dispatch a custom approach
        document.querySelector('.tab[data-tab="resources"]')?.click();
      });
    });
  } catch (err) {
    container.innerHTML = `<p class="loading">Failed to load guide.</p>`;
  }
}

// --- Resources Rendering ---
function renderResourcesList() {
  const grid = document.getElementById("resources-cards");
  grid.innerHTML = "";

  const sectionGrid = document.createElement("div");
  sectionGrid.className = "guides-section-grid";

  for (const resource of RESOURCES) {
    const card = document.createElement("div");
    card.className = "guide-card resource-card";

    const body = document.createElement("div");
    body.className = "guide-card-body";

    const title = document.createElement("h3");
    title.textContent = resource.title;
    body.appendChild(title);

    const desc = document.createElement("p");
    desc.textContent = resource.description;
    body.appendChild(desc);

    card.appendChild(body);

    card.addEventListener("click", () => {
      loadResourceArticle(resource.slug);
      updateURL(`/privacy-resources/${resource.slug}`);
    });

    sectionGrid.appendChild(card);
  }

  grid.appendChild(sectionGrid);
  switchResourceView("list");
}

function switchResourceView(view) {
  const list = document.getElementById("view-resources-list");
  const article = document.getElementById("view-resources-article");
  if (list) list.classList.toggle("active", view === "list");
  if (article) article.classList.toggle("active", view === "article");
}

async function loadResourceArticle(slug) {
  const container = document.getElementById("resource-content");
  container.innerHTML = '<p class="loading">Loading resource...</p>';
  switchResourceView("article");
  window.scrollTo(0, 0);

  try {
    const res = await fetch(`/resources/${slug}.inc`);
    if (!res.ok) throw new Error(`${res.status}`);
    const html = await res.text();
    container.innerHTML = html;

    // Set page title
    const resource = RESOURCES.find((r) => r.slug === slug);
    if (resource) {
      document.title = resource.title;
    }
  } catch (err) {
    container.innerHTML = `<p class="loading">Failed to load resource.</p>`;
  }
}

// --- Utilities ---
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
