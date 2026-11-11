/* =====================================================================
   Demos — everything that is not an OpenAI-collection problem:
   benchmark runs, proof traces, tools, other formalizations...

   HOW TO ADD A DEMO: copy one object in `items` (newest at the top).
   - category: used for the filter pills (a new value creates a new pill)
   - tags:     small labels on the card
   - metrics:  [label, value] pairs shown at the bottom of the card
   - links:    buttons on the card (leave [] if none)
   ===================================================================== */
window.TA = window.TA || {};

TA.demos = {
  items: [
    {
      title: "Proof Pipeline Observer",
      category: "Interactive",
      tags: ["Trace replay", "DAG"],
      summary: "Read-only, time-travel replay of Turing Agent runs: helper DAG growth, local Lean probes, failed repairs, context compaction and acceptance status. Drag the timeline or share a link to any moment.",
      metrics: [["Traces", "5"], ["Backend", "none — frozen static export"]],
      links: [{ label: "Open the observer →", href: "https://wangqy031216-cloud.github.io/proof-pipeline-observer/" }]
    },
    {
      title: "FCS76 · Non-generability of a union of language families (diagonal construction)",
      category: "Proof trace",
      tags: ["Formal TCS Bench", "Full pipeline"],
      summary: "End-to-end run: main-statement formalization (retrieval, draft, compile, semantic review, lock) → DAG proof → independent kernel check, exact export and independent replay. All six pipeline stages green.",
      metrics: [["DAG nodes", "22"], ["Events", "1,972"], ["Status", "proved"]],
      links: [{ label: "Replay trace →", href: "https://wangqy031216-cloud.github.io/proof-pipeline-observer/" }]
    },
    {
      title: "RLMEval 201 · integral_statInfoFun_curvatureMeasure",
      category: "Proof trace",
      tags: ["RLMEval · TLB", "Given statement"],
      summary: "Proof formalization only (the benchmark supplies the formal statement), from the TestingLowerBounds project: information-theoretic lower bounds for statistical hypothesis testing.",
      metrics: [["DAG nodes", "6"], ["Events", "868"], ["Lean probes", "161"], ["Compactions", "32"]],
      links: [{ label: "Replay trace →", href: "https://wangqy031216-cloud.github.io/proof-pipeline-observer/" }]
    },
    {
      title: "RLMEval 77 · weak_PFR_asymm",
      category: "Proof trace",
      tags: ["RLMEval · PFR", "Given statement"],
      summary: "Proof formalization only, from the Polynomial Freiman–Ruzsa project (additive combinatorics and entropy methods, with applications to linearity testing).",
      metrics: [["DAG nodes", "5"], ["Events", "713"], ["Compactions", "37"]],
      links: [{ label: "Replay trace →", href: "https://wangqy031216-cloud.github.io/proof-pipeline-observer/" }]
    },
    {
      title: "Formal TCS Bench — faithful theorem formalization",
      category: "Benchmark",
      tags: ["Theorem formalization", "143 problems"],
      summary: "Translate theorem statements from recent theoretical computer science papers into Lean. A submission counts only if it compiles and passes independent semantic review of the statement and its definitions.",
      metrics: [["Success", "61.53% (DS-V4-Pro)"], ["Compile", "99.30%"], ["vs. Claude Code", "+32.16 pp"]],
      links: [{ label: "Full results →", href: "harness.html#results" }]
    },
    {
      title: "RLMEval TCS subset — proof construction",
      category: "Benchmark",
      tags: ["Proof formalization", "248 theorems"],
      summary: "Complete Lean proofs (no sorry) for theorems from the PFR and TestingLowerBounds projects, given the formal statement, its informal proof and project context (easy mode).",
      metrics: [["Pass@1", "82.87% (GLM-5.3)"], ["Pass@1", "82.66% (DS-V4-Pro)"]],
      links: [{ label: "Full results →", href: "harness.html#results" }]
    }
  ]
};
