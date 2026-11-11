/* =====================================================================
   Site-wide config: top banner, footer, news.
   - Add a new page: copy page-template.html, then add one line to `nav`.
   - Add a news item: put it at the TOP of `news` (newest first).
   ===================================================================== */
window.TA = window.TA || {};

TA.site = {
  version: "202611110717",   // set by tools/bump_version.py
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
    { label: "Workshops",       href: "workshops.html" }
  ],

  // Shown on the home page. Newest first. `html` may contain links.
  news: [
    {
      date: "2026-10-30",
      html: 'Held the <a href="workshops.html">AI4TCS Workshop — After AI Can Solve Problems: Toward TCS 2.0</a>, with invited talks on mathematical agents, AI-assisted combinatorial optimization and certificates between AI and formal verification.'
    }
  ]
};
