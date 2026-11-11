/* =====================================================================
   Site-wide config: top banner, footer, news.
   - Add a new page: copy page-template.html, then add one line to `nav`.
   - Add a news item: put it at the TOP of `news` (newest first).
   ===================================================================== */
window.TA = window.TA || {};

TA.site = {
  version: "202611110655",   // set by tools/bump_version.py
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
      date: "2026-11-11",
      html: 'Project portal launched: harness overview, OpenAI problem write-ups, demos and workshop archive.'
    },
    {
      date: "2026-11",
      html: 'Turing Agent completes formal verification of <a href="openai.html">4 previously unresolved TCS problems</a> from OpenAI\'s 722-manuscript collection, using DeepSeek-V4-Pro.'
    },
    {
      date: "2026-11",
      html: '61.53% faithful theorem-formalization success on Formal TCS Bench and 82.87% pass@1 on the RLMEval TCS subset. <a href="harness.html#results">See results</a>.'
    }
  ]
};
