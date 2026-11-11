/* =====================================================================
   Benchmark results (pass@1, %). Source: technical report, Figure
   "Pass@1 results on Formal TCS Bench and RLMEval".
   Add a new model: append an object to `models`.
   Add a new method: add it to `methods` and give every model a value.
   ===================================================================== */
window.TA = window.TA || {};

TA.results = {
  methods: [
    { key: "llm",    label: "LLM only (direct generation)" },
    { key: "codex",  label: "Codex CLI" },
    { key: "claude", label: "Claude Code" },
    { key: "ours",   label: "Turing Agent (ours)", ours: true }
  ],
  columns: [
    { key: "ftcsCompile", label: "Compile", group: "Formal TCS Bench · theorem formalization" },
    { key: "ftcsSuccess", label: "Success", group: "Formal TCS Bench · theorem formalization" },
    { key: "rlmPFR",      label: "PFR",   group: "RLMEval · proof formalization" },
    { key: "rlmTLB",      label: "TLB",   group: "RLMEval · proof formalization" },
    { key: "rlmTotal",    label: "Total", group: "RLMEval · proof formalization" }
  ],
  models: [
    {
      name: "GLM-5.3",
      rows: {
        llm:    { ftcsCompile: 10.49, ftcsSuccess: 8.39,  rlmPFR: 12.50, rlmTLB: 23.08, rlmTotal: 16.94 },
        codex:  { ftcsCompile: 69.23, ftcsSuccess: 29.37, rlmPFR: 38.19, rlmTLB: 47.12, rlmTotal: 41.93 },
        claude: { ftcsCompile: 83.22, ftcsSuccess: 40.56, rlmPFR: 75.00, rlmTLB: 87.50, rlmTotal: 81.45 },
        ours:   { ftcsCompile: 97.20, ftcsSuccess: 58.99, rlmPFR: 78.84, rlmTLB: 88.46, rlmTotal: 82.87 }
      }
    },
    {
      name: "DeepSeek-V4-Pro",
      rows: {
        llm:    { ftcsCompile: 13.29, ftcsSuccess: 7.69,  rlmPFR: 13.89, rlmTLB: 25.96, rlmTotal: 18.95 },
        codex:  { ftcsCompile: 40.56, ftcsSuccess: 27.97, rlmPFR: 63.88, rlmTLB: 89.42, rlmTotal: 74.60 },
        claude: { ftcsCompile: 76.22, ftcsSuccess: 29.37, rlmPFR: 82.63, rlmTLB: 92.30, rlmTotal: 86.69 },
        ours:   { ftcsCompile: 99.30, ftcsSuccess: 61.53, rlmPFR: 79.86, rlmTLB: 86.54, rlmTotal: 82.66 }
      }
    }
  ]
};
