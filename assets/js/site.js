/* =====================================================================
   Turing Agent portal — shared behaviour.
   Every renderer below runs only if its mount element exists on the page,
   so each page includes this one file plus the data files it needs.
   Content lives in data/*.js — you normally never need to edit this file.
   ===================================================================== */
(function () {
  "use strict";
  var TA = window.TA || {};
  var site = TA.site || { nav: [], links: {} };

  /* ---------- helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // local images/videos named in data files get the site version, so a replaced file is not served from cache
  function ver(src) {
    if (!src || /^(https?:)?\/\//.test(src) || !site.version) return src;
    return src + (src.indexOf("?") < 0 ? "?" : "&") + "v=" + encodeURIComponent(site.version);
  }
  function isExternal(href) { return /^https?:\/\//.test(href || ""); }
  function linkAttrs(href) {
    return 'href="' + esc(href) + '"' + (isExternal(href) ? ' target="_blank" rel="noopener noreferrer"' : "");
  }
  function renderMath(el) {
    if (!el || typeof window.renderMathInElement !== "function") return;
    window.renderMathInElement(el, {
      delimiters: [
        { left: "\\[", right: "\\]", display: true },
        { left: "$", right: "$", display: false }
      ],
      throwOnError: false
    });
  }
  function currentPage() {
    var p = location.pathname.split("/").pop();
    return p === "" ? "index.html" : p;
  }
  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2200);
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  }
  function fallbackCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }

  /* ---------- top banner ---------- */
  function renderBanner() {
    var el = $("#banner");
    if (!el) return;
    var here = currentPage();
    var links = (site.nav || []).map(function (n) {
      var cur = n.href === here ? ' aria-current="page"' : "";
      return '<a ' + linkAttrs(n.href) + cur + ">" + esc(n.label) + "</a>";
    }).join("");
    el.innerHTML =
      '<div class="banner-inner">' +
        '<a class="brand" href="index.html"><img src="assets/img/logo.png" alt="" width="26" height="29">' +
          esc(site.name || "Turing Agent") +
          (site.tagline ? "<small>· " + esc(site.tagline) + "</small>" : "") +
        "</a>" +
        '<nav class="nav" aria-label="Main">' + links + "</nav>" +
      "</div>";
  }

  /* ---------- footer ---------- */
  function renderFooter() {
    var el = $("#footer");
    if (!el) return;
    el.innerHTML =
      '<div class="wrap-xl footer-inner">' +
        "<div>" + esc(site.name) + " · " + esc(site.affiliation || "") +
          (site.lastUpdated ? " · Last updated " + esc(site.lastUpdated) : "") + "</div>" +
        '<div>Layout inspired by <a href="https://shikun.io/projects/clarity" target="_blank" rel="noopener noreferrer">Clarity</a></div>' +
      "</div>";
  }

  /* ---------- optional link buttons (hidden when URL empty) ---------- */
  function wireLinkButtons() {
    $all("[data-site-link]").forEach(function (a) {
      var url = (site.links || {})[a.getAttribute("data-site-link")];
      if (url) { a.href = url; if (isExternal(url)) { a.target = "_blank"; a.rel = "noopener noreferrer"; } a.hidden = false; }
      else a.hidden = true;
    });
  }

  /* ---------- counts (e.g. "4 problems") ---------- */
  function fillCounts() {
    var counts = {
      openai: ((TA.openai || {}).problems || []).length,
      demos: ((TA.demos || {}).items || []).length + (TA.traces || []).length,
      workshops: ((TA.workshops || {}).sessions || []).length
    };
    $all("[data-count]").forEach(function (el) {
      var k = el.getAttribute("data-count");
      if (k in counts) el.textContent = counts[k];
    });
  }

  /* ---------- home: news ---------- */
  function renderNews() {
    var el = $("#news");
    if (!el) return;
    var items = site.news || [];
    if (!items.length) { el.innerHTML = '<li><span></span><span class="muted">No news yet.</span></li>'; return; }
    el.innerHTML = items.map(function (n) {
      return "<li><time>" + esc(n.date) + "</time><span>" + n.html + "</span></li>";
    }).join("");
  }

  /* ---------- harness: results table ---------- */
  function renderResults() {
    var mount = $("#results-table");
    var pillsEl = $("#results-models");
    var R = TA.results;
    if (!mount || !R) return;
    var active = R.models.length - 1;

    function draw() {
      var m = R.models[active];
      var best = {};
      R.columns.forEach(function (c) {
        best[c.key] = Math.max.apply(null, R.methods.map(function (me) { return (m.rows[me.key] || {})[c.key] || 0; }));
      });
      var groups = [];
      R.columns.forEach(function (c, i) {
        var last = groups[groups.length - 1];
        if (last && last.name === c.group) last.span++; else groups.push({ name: c.group, span: 1, start: i });
      });
      var starts = {};
      groups.forEach(function (g) { starts[g.start] = 1; });
      function gcls(i, base) { return base + (starts[i] && i > 0 ? " gstart" : ""); }
      // group label "Formal TCS Bench · theorem formalization" → bold benchmark name + small task line
      function glabel(name) {
        var parts = String(name).split(" · ");
        return esc(parts[0]) + (parts[1] ? '<span class="gsub">' + esc(parts.slice(1).join(" · ")) + "</span>" : "");
      }
      // fixed layout: method column + equal-width number columns, so each benchmark's
      // columns sit side by side directly under their (centred) group title
      var numW = (68 / R.columns.length).toFixed(3) + "%";
      var html = '<table class="ac-table results"><colgroup><col style="width:32%">' +
        R.columns.map(function () { return '<col style="width:' + numW + '">'; }).join("") + "</colgroup><thead>" +
        '<tr><th rowspan="2" class="mcol">Method · ' + esc(m.name) + "</th>" +
        groups.map(function (g) { return '<th colspan="' + g.span + '" class="' + gcls(g.start, "grp") + '">' + glabel(g.name) + "</th>"; }).join("") +
        "</tr><tr>" +
        R.columns.map(function (c, i) { return '<th class="' + gcls(i, "num") + '">' + esc(c.label) + "</th>"; }).join("") +
        "</tr></thead><tbody>" +
        R.methods.map(function (me) {
          var row = m.rows[me.key] || {};
          return "<tr" + (me.ours ? ' class="ours"' : "") + "><td>" + esc(me.label) + "</td>" +
            R.columns.map(function (c, i) {
              var v = row[c.key];
              var cls = gcls(i, "num") + (v === best[c.key] ? " best" : "");
              return '<td class="' + cls + '">' + (v == null ? "—" : v.toFixed(2)) + "</td>";
            }).join("") + "</tr>";
        }).join("") +
        "</tbody></table>";
      mount.innerHTML = html;
      if (pillsEl) $all(".pill", pillsEl).forEach(function (b, i) { b.setAttribute("aria-pressed", i === active ? "true" : "false"); });
    }

    if (pillsEl) {
      pillsEl.innerHTML = R.models.map(function (m, i) {
        return '<button type="button" class="pill" data-i="' + i + '">' + esc(m.name) + "</button>";
      }).join("");
      pillsEl.addEventListener("click", function (e) {
        var b = e.target.closest(".pill"); if (!b) return;
        active = +b.getAttribute("data-i"); draw();
      });
    }
    draw();
  }

  /* ---------- OpenAI: funnel ---------- */
  function renderFunnel() {
    var D = TA.openai;
    if (!D) return;
    $all("#funnel, #home-funnel").forEach(function (el) {
      el.innerHTML = (D.funnel || []).map(function (f) {
        return '<div class="card stat' + (f.highlight ? " hl" : "") + '">' +
          '<div class="num">' + esc(f.num) + "</div>" +
          '<div class="label">' + esc(f.label) + "</div>" +
          (f.sub ? '<div class="sub">' + esc(f.sub) + "</div>" : "") +
          "</div>";
      }).join("");
    });
  }

  /* ---------- traces → demo-card shape (shared by home panel and demos page) ---------- */
  function fmtDur(sec) {
    sec = Math.max(0, Math.round(sec || 0));
    var d = Math.floor(sec / 86400), h = Math.floor(sec % 86400 / 3600), m = Math.floor(sec % 3600 / 60);
    return d ? d + "d " + h + "h" : h ? h + "h " + String(m).padStart(2, "0") + "m" : m + "m";
  }
  function traceDemos() {
    return (TA.traces || []).map(function (r) {
      var s = r.stats;
      return {
        title: r.short || r.title,
        category: "Proof trace",
        tags: [r.kind.split(" · ")[0]].concat(r.model ? [r.model] : []),
        summary: esc(r.summary || ""),
        metrics: [["DAG nodes", s.nodes], ["Lean probes", s.probes.toLocaleString("en-US")], ["Active", fmtDur(r.active)]]
          .concat(s.dropped ? [["Dropped plans", s.dropped]] : []),
        links: [{ label: "Replay the trace →", href: "demos.html#" + r.id }]
      };
    });
  }
  function demoCard(d) {
    return '<article class="card demo">' +
      '<div class="tags">' + (d.category ? '<span class="tag warm">' + esc(d.category) + "</span>" : "") +
        (d.tags || []).map(function (t) { return '<span class="tag plain">' + esc(t) + "</span>"; }).join("") + "</div>" +
      "<h3>" + esc(d.title) + "</h3>" +
      (d.summary ? "<p>" + d.summary + "</p>" : "") +
      (d.metrics && d.metrics.length ? '<div class="metrics">' + d.metrics.map(function (m) { return "<span>" + esc(m[0]) + " <b>" + esc(m[1]) + "</b></span>"; }).join("") + "</div>" : "") +
      (d.links && d.links.length ? '<div class="links">' + d.links.map(function (l) { return "<a " + linkAttrs(l.href) + ">" + esc(l.label) + "</a>"; }).join(" ") + "</div>" : "") +
      "</article>";
  }

  /* ---------- home: panel contents ---------- */
  function renderHomePanels() {
    var pe = $("#home-problems");
    if (pe && TA.openai) {
      pe.innerHTML = (TA.openai.problems || []).map(function (p) {
        return '<a class="card tile" href="openai.html#' + esc(p.slug) + '">' +
          '<span class="tags" style="display:flex;gap:6px;flex-wrap:wrap">' +
            (p.num ? '<span class="tag warm">#' + esc(p.num) + "</span>" : "") +
            (p.area ? '<span class="tag">' + esc(p.area) + "</span>" : "") + "</span>" +
          "<h3>" + esc(p.title) + "</h3>" +
          (p.summary ? "<p>" + p.summary + "</p>" : "") +
          '<span class="go">Read the write-up →</span></a>';
      }).join("");
    }
    var te = $("#home-traces");
    if (te) te.innerHTML = traceDemos().map(demoCard).join("") || '<div class="empty">No traces yet.</div>';
  }

  /* ---------- tabs with sliding panels ([data-slider]) ---------- */
  function wireSliders() {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    $all("[data-slider]").forEach(function (root) {
      var tabs = $all('[role="tab"]', root), panels = $all('[role="tabpanel"]', root);
      var track = $(".slider-track", root), vp = $(".slider-viewport", root);
      if (!tabs.length || !track || !vp) return;
      var cur = 0;
      function fit() { vp.style.height = panels[cur].offsetHeight + "px"; }
      function go(i, opts) {
        cur = (i + tabs.length) % tabs.length;
        track.style.transform = "translateX(" + (-100 * cur) + "%)";
        tabs.forEach(function (t, j) { t.setAttribute("aria-selected", j === cur ? "true" : "false"); t.tabIndex = j === cur ? 0 : -1; });
        panels.forEach(function (p, j) {
          if (j === cur) { p.removeAttribute("inert"); p.removeAttribute("aria-hidden"); }
          else { p.setAttribute("inert", ""); p.setAttribute("aria-hidden", "true"); }
          $all("video", p).forEach(function (v) {
            if (j !== cur) v.pause();
            else if (v.hasAttribute("autoplay") && !reduce) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
          });
        });
        fit();
        if (opts && opts.focus) tabs[cur].focus();
        if (opts && opts.hash && history.replaceState) history.replaceState(null, "", cur ? "#" + panels[cur].id : location.pathname);
      }
      tabs.forEach(function (t, j) { t.addEventListener("click", function () { go(j, { hash: true }); }); });
      root.querySelector('[role="tablist"]').addEventListener("keydown", function (e) {
        var k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (k) { e.preventDefault(); go(cur + k, { focus: true, hash: true }); }
        else if (e.key === "Home") { e.preventDefault(); go(0, { focus: true, hash: true }); }
        else if (e.key === "End") { e.preventDefault(); go(tabs.length - 1, { focus: true, hash: true }); }
      });
      // swipe on touch screens
      var sx = null, sy = null;
      vp.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
      vp.addEventListener("touchend", function (e) {
        if (sx == null) return;
        var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
        if (Math.abs(dx) > 60 && Math.abs(dx) > 1.5 * Math.abs(dy)) go(cur + (dx < 0 ? 1 : -1), { hash: true });
        sx = sy = null;
      });
      // keep the viewport height in sync as images / fonts load or the window resizes
      if (window.ResizeObserver) {
        var ro = new ResizeObserver(function () { fit(); });
        panels.forEach(function (p) { ro.observe(p); });
      } else {
        window.addEventListener("resize", fit);
        window.addEventListener("load", fit);
      }
      var start = 0, h = location.hash.replace(/^#/, "");
      panels.forEach(function (p, j) { if (p.id === h) start = j; });
      root.classList.add("no-anim");
      go(start);
      requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.remove("no-anim"); }); });
    });
  }

  /* ---------- OpenAI: problem explorer ---------- */
  var STATUS = {
    "verified":    { label: "Verified", cls: "green" },
    "in-progress": { label: "In progress", cls: "amber" },
    "open":        { label: "Open", cls: "plain" }
  };
  function statusTag(s) {
    var st = STATUS[s] || { label: s || "", cls: "plain" };
    return st.label ? '<span class="tag ' + st.cls + '">' + esc(st.label) + "</span>" : "";
  }

  function traceFor(p) {
    if (!p || !p.trace) return null;
    return (TA.traces || []).filter(function (r) { return r.id === p.trace; })[0] || null;
  }

  function renderExplorer() {
    var root = $("#explorer");
    var D = TA.openai;
    if (!root || !D) return;
    var problems = D.problems || [];
    var state = { q: "", area: "all", status: "all", slug: null };

    var areas = [];
    problems.forEach(function (p) { if (p.area && areas.indexOf(p.area) < 0) areas.push(p.area); });
    var statuses = [];
    problems.forEach(function (p) { if (p.status && statuses.indexOf(p.status) < 0) statuses.push(p.status); });

    root.innerHTML =
      '<aside class="explorer-side">' +
        '<input id="p-search" class="search" type="search" placeholder="Search title, number, area…" aria-label="Search problems">' +
        '<div class="pills" id="p-areas" aria-label="Filter by area">' +
          '<button type="button" class="pill" data-area="all" aria-pressed="true">All areas</button>' +
          areas.map(function (a) { return '<button type="button" class="pill" data-area="' + esc(a) + '" aria-pressed="false">' + esc(a) + "</button>"; }).join("") +
        "</div>" +
        (statuses.length > 1 ?
          '<div class="pills" id="p-status" aria-label="Filter by status">' +
            '<button type="button" class="pill" data-status="all" aria-pressed="true">Any status</button>' +
            statuses.map(function (s) { return '<button type="button" class="pill" data-status="' + esc(s) + '" aria-pressed="false">' + esc((STATUS[s] || { label: s }).label) + "</button>"; }).join("") +
          "</div>" : "") +
        '<div class="count" id="p-count"></div>' +
        '<div class="plist" id="p-list" role="listbox" aria-label="Problems"></div>' +
      "</aside>" +
      '<div id="p-detail"></div>';

    var listEl = $("#p-list", root), detailEl = $("#p-detail", root), countEl = $("#p-count", root);

    function matches(p) {
      if (state.area !== "all" && p.area !== state.area) return false;
      if (state.status !== "all" && p.status !== state.status) return false;
      if (!state.q) return true;
      var hay = [p.title, p.num, p.area, p.summary, p.slug].join(" ").toLowerCase();
      return state.q.split(/\s+/).every(function (w) { return hay.indexOf(w) >= 0; });
    }

    function drawList() {
      var shown = problems.filter(matches);
      countEl.textContent = shown.length + " of " + problems.length + " problems";
      if (!shown.length) { listEl.innerHTML = '<div class="empty">No problem matches this filter.</div>'; return; }
      listEl.innerHTML = shown.map(function (p) {
        return '<button type="button" class="pitem" role="option" data-slug="' + esc(p.slug) + '" aria-selected="' + (p.slug === state.slug) + '">' +
          '<span class="meta">' + (p.num ? '<span class="id">#' + esc(p.num) + "</span>" : "") + "<span>" + esc(p.area || "") + "</span>" +
            (traceFor(p) ? '<span class="demo-badge">▶ Demo</span>' : "") + "</span>" +
          '<span class="t">' + esc(p.title) + "</span>" +
          "</button>";
      }).join("");
    }

    function block(cls, kind, html) {
      return html ? '<div class="' + cls + '"><span class="kind">' + kind + "</span>" + html + "</div>" : "";
    }

    function drawDetail() {
      var p = problems.filter(function (x) { return x.slug === state.slug; })[0];
      if (!p) { detailEl.innerHTML = ""; return; }
      var html = '<article class="card detail" aria-live="polite">' +
        '<header class="detail-head">' +
          '<div class="tags">' +
            (p.num ? '<span class="tag warm">#' + esc(p.num) + "</span>" : "") +
            (p.area ? '<span class="tag">' + esc(p.area) + "</span>" : "") +
            statusTag(p.status) +
            (p.model ? '<span class="tag plain">' + esc(p.model) + "</span>" : "") +
          "</div>" +
          "<h2>" + esc(p.title) + "</h2>" +
          (p.summary ? '<p class="ui muted" style="font-size:.92rem;margin:0">' + p.summary + "</p>" : "") +
          (function () {
            var t = traceFor(p);
            if (!t) return "";
            return '<div class="replay-cta"><a class="btn primary" href="demos.html#' + esc(t.id) + '">▶ Replay this proof in Demos</a>' +
              '<span class="mono">' + t.stats.nodes + " DAG nodes · " + t.stats.probes.toLocaleString("en-US") + " Lean probes" +
              (t.stats.dropped ? " · " + t.stats.dropped + " dropped plans" : "") + " · " + fmtDur(t.active) + " active</span></div>";
          })() +
        "</header>";
      if (p.stats && p.stats.length) {
        html += '<dl class="kv">' + p.stats.map(function (s) { return "<div><dt>" + esc(s.k) + "</dt><dd>" + esc(s.v) + "</dd></div>"; }).join("") + "</dl>";
      }
      html += '<div class="prose">';
      if (p.intro) html += "<p>" + p.intro + "</p>";
      html += block("def-box", "Problem definition.", p.definition);
      if (p.note) html += "<p>" + p.note + "</p>";
      html += block("thm-box", "Target theorem.", p.theorem);
      if (p.existing) html += "<h3>Existing formalization by OpenAI</h3><p>" + p.existing + "</p>";
      if (p.process && p.process.length) {
        html += "<h3>How Turing Agent verified it</h3>" + p.process.map(function (t) { return "<p>" + t + "</p>"; }).join("");
      }
      (p.code || []).forEach(function (c) {
        html += (c.title ? "<h3>" + esc(c.title) + "</h3>" : "") + '<pre class="code"><code>' + esc(c.lean || c.text || "") + "</code></pre>";
      });
      if (p.video && p.video.src) {
        html += '<figure class="figure" style="margin-top:1.4rem"><div class="mat video-mat"><video class="showcase" src="' + esc(ver(p.video.src)) + '"' +
          (p.video.poster ? ' poster="' + esc(ver(p.video.poster)) + '"' : "") +
          ' muted loop playsinline controls preload="metadata"></video></div>' +
          (p.video.caption ? "<figcaption>" + p.video.caption + "</figcaption>" : "") + "</figure>";
      }
      if (p.figure && p.figure.src) {
        html += '<figure class="figure" style="margin-top:1.4rem"><div class="mat"><img class="zoomable" loading="lazy" src="' + esc(ver(p.figure.src)) + '" alt="' + esc(p.title) + ' proof DAG"></div>' +
          (p.figure.caption ? "<figcaption>" + p.figure.caption + "</figcaption>" : "") + "</figure>";
      }
      if (p.links && p.links.length) {
        html += '<div class="links" style="margin-top:1.2rem">' + p.links.map(function (l) {
          return '<a class="btn" ' + linkAttrs(l.href) + ">" + esc(l.label) + "</a>";
        }).join("") + "</div>";
      }
      html += "</div></article>";
      detailEl.innerHTML = html;
      renderMath(detailEl);
    }

    function select(slug, opts) {
      state.slug = slug;
      $all(".pitem", listEl).forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-slug") === slug ? "true" : "false"); });
      drawDetail();
      if (opts && opts.push && history.replaceState) history.replaceState(null, "", "#" + slug);
      if (opts && opts.scroll && window.matchMedia("(max-width: 960px)").matches) detailEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    listEl.addEventListener("click", function (e) {
      var b = e.target.closest(".pitem"); if (!b) return;
      select(b.getAttribute("data-slug"), { push: true, scroll: true });
    });
    $("#p-search", root).addEventListener("input", function (e) { state.q = e.target.value.trim().toLowerCase(); drawList(); });
    $("#p-areas", root).addEventListener("click", function (e) {
      var b = e.target.closest(".pill"); if (!b) return;
      state.area = b.getAttribute("data-area");
      $all(".pill", e.currentTarget).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      drawList();
    });
    var stEl = $("#p-status", root);
    if (stEl) stEl.addEventListener("click", function (e) {
      var b = e.target.closest(".pill"); if (!b) return;
      state.status = b.getAttribute("data-status");
      $all(".pill", e.currentTarget).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      drawList();
    });

    function fromHash() {
      var h = decodeURIComponent(location.hash.replace(/^#/, ""));
      var hit = problems.filter(function (p) { return p.slug === h || p.num === h; })[0];
      return hit ? hit.slug : null;
    }
    window.addEventListener("hashchange", function () { var s = fromHash(); if (s) { select(s); drawList(); } });

    state.slug = fromHash() || (problems[0] && problems[0].slug);
    drawList();
    drawDetail();
    if (fromHash()) setTimeout(function () { root.scrollIntoView({ block: "start" }); }, 0);
  }

  /* ---------- demos gallery ---------- */
  function renderDemos() {
    var grid = $("#demo-grid");
    var D = TA.demos;
    if (!grid || !D) return;
    // non-trace demos only: proof traces live in the viewer at the top of demos.html
    var items = D.items || [];
    var sec = $("#more-demos");
    if (sec) sec.hidden = !items.length;
    if (!items.length) return;
    var cats = [];
    items.forEach(function (d) { if (d.category && cats.indexOf(d.category) < 0) cats.push(d.category); });
    var filterEl = $("#demo-filters");
    var active = "all";

    function draw() {
      var shown = items.filter(function (d) { return active === "all" || d.category === active; });
      if (!shown.length) { grid.innerHTML = '<div class="empty" style="grid-column:1/-1">Nothing here yet.</div>'; return; }
      grid.innerHTML = shown.map(demoCard).join("");
    }

    if (filterEl) {
      filterEl.innerHTML = '<button type="button" class="pill" data-cat="all" aria-pressed="true">All (' + items.length + ")</button>" +
        cats.map(function (c) {
          var n = items.filter(function (d) { return d.category === c; }).length;
          return '<button type="button" class="pill" data-cat="' + esc(c) + '" aria-pressed="false">' + esc(c) + " (" + n + ")</button>";
        }).join("");
      filterEl.addEventListener("click", function (e) {
        var b = e.target.closest(".pill"); if (!b) return;
        active = b.getAttribute("data-cat");
        $all(".pill", filterEl).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        draw();
      });
    }
    draw();
  }

  /* ---------- workshops ---------- */
  function renderWorkshops() {
    var up = $("#ws-upcoming"), past = $("#ws-past");
    var W = TA.workshops;
    if (!W || (!up && !past)) return;
    var introEl = $("#ws-intro");
    if (introEl && W.intro) introEl.textContent = W.intro;
    var d = new Date();
    var today = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    var all = (W.sessions || []).slice();
    var upcoming = all.filter(function (s) { return (s.date || "") >= today; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    var done = all.filter(function (s) { return (s.date || "") < today; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });

    // the most recent session that has a full program opens by default
    var withProgram = all.filter(function (s) { return s.program || s.intro || s.photo; })
      .sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    var openId = withProgram.length ? withProgram[0] : null;

    function speakerLine(list) {
      return (list || []).map(function (p) {
        return '<span class="spk"><b>' + esc(p.name) + "</b>" + (p.affil ? " · " + esc(p.affil) : "") + "</span>";
      }).join("");
    }
    function item(it) {
      var hasMore = it.abstract || (it.bios && it.bios.length);
      return '<div class="prog-item' + (it.kind === "break" ? " brk" : "") + '">' +
        '<div class="prog-time">' + esc(it.time || "") + "</div>" +
        "<div>" +
          '<div class="prog-title">' + esc(it.title) + "</div>" +
          (it.title_zh ? '<div class="prog-zh">' + esc(it.title_zh) + "</div>" : "") +
          (it.speakers ? '<div class="prog-spk">' + speakerLine(it.speakers) + "</div>" : "") +
          (hasMore ? '<details class="prog-more"><summary>Abstract &amp; speaker' + ((it.bios || []).length > 1 ? "s" : "") + "</summary>" +
            (it.abstract ? '<p class="prog-abs">' + esc(it.abstract) + "</p>" : "") +
            (it.bios || []).map(function (b) { return '<p class="prog-bio">' + b + "</p>"; }).join("") +
          "</details>" : "") +
        "</div></div>";
    }
    function detail(s) {
      if (!(s.program || s.intro || s.photo)) return "";
      var html = '<details class="ws-detail"' + (s === openId ? " open" : "") + "><summary>Program, abstracts &amp; photos</summary>" +
        '<div class="ws-body">' +
          '<div class="ws-top">' +
            "<div>" +
              (s.subtitle ? '<p class="ws-sub">' + esc(s.subtitle) + "</p>" : "") +
              (s.intro ? '<p class="ws-intro">' + s.intro + "</p>" : "") +
            "</div>" +
            (s.poster ? '<figure class="ws-poster"><img class="zoomable" loading="lazy" src="' + esc(ver(s.poster)) + '" alt="Workshop poster: ' + esc(s.title) + '"><figcaption>Poster · click to enlarge</figcaption></figure>' : "") +
          "</div>" +
          (s.program || []).map(function (sec) {
            return '<section class="prog-sec"><div class="prog-head"><span>' + esc(sec.name) + "</span>" + (sec.time ? "<span>" + esc(sec.time) + "</span>" : "") + "</div>" +
              (sec.items || []).map(item).join("") + "</section>";
          }).join("") +
          (s.photo && s.photo.src ? '<figure class="ws-photo"><img class="zoomable" loading="lazy" src="' + esc(ver(s.photo.src)) + '" alt="' + esc(s.photo.caption || "Workshop photo") + '">' +
            (s.photo.caption ? "<figcaption>" + esc(s.photo.caption) + "</figcaption>" : "") + "</figure>" : "") +
        "</div></details>";
      return html;
    }
    function row(s) {
      return '<div class="row">' +
        '<div class="when">' + (s.no != null ? "<b>Workshop #" + esc(s.no) + "</b>" : "") + esc(s.date || "") +
          (s.time ? "<br>" + esc(s.time) : "") + (s.place ? "<br>" + esc(s.place) : "") + "</div>" +
        "<div>" +
          (s.series ? '<div class="ws-series">' + esc(s.series) + "</div>" : "") +
          "<h3>" + esc(s.title) + "</h3>" +
          (s.title_zh ? '<div class="prog-zh" style="margin-top:2px">' + esc(s.title_zh) + "</div>" : "") +
          (s.summary ? "<p>" + s.summary + "</p>" : "") +
          (s.speakers ? '<div class="who">' + esc(s.speakers) + "</div>" : "") +
          (s.links && s.links.length ? '<div class="links">' + s.links.map(function (l) { return "<a " + linkAttrs(l.href) + ">" + esc(l.label) + "</a>"; }).join("") + "</div>" : "") +
        "</div>" +
        detail(s) +
        "</div>";
    }
    if (up) up.innerHTML = upcoming.length ? upcoming.map(row).join("") : '<div class="empty" style="border:0">No session scheduled yet. New sessions will be announced here.</div>';
    if (past) past.innerHTML = done.length ? done.map(row).join("") : '<div class="empty" style="border:0">The archive fills up as sessions take place: slides, recordings and code.</div>';
  }

  /* ---------- lightbox for figures ---------- */
  function wireLightbox() {
    document.addEventListener("click", function (e) {
      var img = e.target.closest("img.zoomable");
      if (img) {
        var lb = document.createElement("div");
        lb.className = "lightbox";
        lb.setAttribute("role", "dialog");
        lb.setAttribute("aria-label", "Enlarged figure");
        lb.innerHTML = '<img src="' + esc(img.currentSrc || img.src) + '" alt="' + esc(img.alt) + '">';
        document.body.appendChild(lb);
        var close = function () { lb.remove(); document.removeEventListener("keydown", onKey); };
        var onKey = function (ev) { if (ev.key === "Escape") close(); };
        lb.addEventListener("click", close);
        document.addEventListener("keydown", onKey);
      }
    });
  }

  /* ---------- copy buttons ---------- */
  function wireCopy() {
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-copy]"); if (!b) return;
      var src = document.getElementById(b.getAttribute("data-copy"));
      if (!src) return;
      copyText(src.textContent.trim()).then(function (ok) { toast(ok ? "Copied to clipboard" : "Copy failed — select the text manually"); });
    });
  }

  /* ---------- videos: no autoplay for visitors who ask for reduced motion ---------- */
  function wireVideos() {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) return;
    $all("video[autoplay]").forEach(function (v) { v.removeAttribute("autoplay"); v.pause(); });
  }

  renderBanner();
  renderFooter();
  wireVideos();
  wireLinkButtons();
  fillCounts();
  renderNews();
  renderResults();
  renderFunnel();
  renderHomePanels();
  wireSliders();
  renderExplorer();
  renderDemos();
  renderWorkshops();
  wireLightbox();
  wireCopy();
})();
