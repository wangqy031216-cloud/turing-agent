/* =====================================================================
   Site-wide config: top banner, footer, news.
   - Add a new page: copy page-template.html, then add one line to `nav`.
   - News items (home page + news.html) live in data/news.js.
   ===================================================================== */
window.TA = window.TA || {};

TA.site = {
  version: "202611121025",   // set by tools/bump_version.py
  name: "Turing Agent",
  tagline: "Formal Verification Portal",
  affiliation: "Shanghai Artificial Intelligence Laboratory",
  lastUpdated: "2026-11-11",

  // Leave a URL empty ("") to hide its button.
  links: {
    report: "",   // technical report PDF / arXiv link
    code: ""      // public code repository
  },

  // Top banner. `href` is the page file; the current page is highlighted automatically.
  nav: [
    { label: "Home",            href: "index.html" },
    { label: "Harness",         href: "harness.html" },
    { label: "OpenAI Problems", href: "openai.html" },
    { label: "Demos",           href: "demos.html" },
    { label: "News",            href: "news.html" }
  ]
};
