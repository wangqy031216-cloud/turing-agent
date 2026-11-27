<div align="center">
  <img src="assets/img/logo.png" alt="Turing Agent Logo" width="160">

  <h1>Turing Agent</h1>

  <p>
    <strong>Agentic Formal Verification for Mathematical Research</strong><br>
    <em>Shanghai Artificial Intelligence Laboratory</em>
  </p>

  <p>
    <a href="https://wangqy031216-cloud.github.io/turing-agent/"><img src="https://img.shields.io/badge/🌐_Project_Page-Website-1e3a8a?style=for-the-badge" alt="Project Page"></a>
    <a href="https://arxiv.org/pdf/2608.03283"><img src="https://img.shields.io/badge/📄_Paper-arXiv_2608.03283-b4513f?style=for-the-badge" alt="Paper"></a>
  </p>

  <p>
    <b>English</b> · <a href="README_zh.md">简体中文</a>
  </p>
</div>

---

## 🔥 News

- **`[2026-11]`** 🎉 **Turing Agent Released** — Technical report, official project portal, benchmark evaluations, and interactive proof replays are live. [[Paper](https://arxiv.org/pdf/2608.03283)] [[Website](https://wangqy031216-cloud.github.io/turing-agent/)] [[Interactive Demos](https://wangqy031216-cloud.github.io/turing-agent/demos.html)]
- **`[2026-10]`** 🏆 **OpenAI Frontier Math Proofs Completed** — Completed Lean-kernel-checked proofs for unfinished theoretical computer science problems from OpenAI's 722 frontier manuscripts (`#116-01`, `#186-01`, `#235-02`). [[Explore Proofs](https://wangqy031216-cloud.github.io/turing-agent/results.html#openai-problems)]
- **`[2026-10-30]`** 🎤 **AI4TCS Workshop Held** — *After AI Can Solve Problems: Toward TCS 2.0*. [[Program & Photos](https://wangqy031216-cloud.github.io/turing-agent/news.html#ai4tcs-workshop-2026)]

---

## ✨ Introduction

**Turing Agent** is a unified agent system for faithful, research-level mathematical formalization and verification in **Lean 4**, developed at Shanghai Artificial Intelligence Laboratory. Moving beyond proving pre-formalized exercises, Turing Agent takes natural-language research claims and informal mathematical arguments all the way to complete, `sorry`-free, Lean-kernel-checked developments.

- ⚡ **Fast** — Verify research-level mathematics at AI speed.
- 🎯 **Faithful** — Preserve the original mathematical claim, assumptions, and semantics as stated.
- 🧮 **For TCS** — Build machine-checked formal foundations for theoretical computer science.

### Highlights

- **Frontier Research Verification**: Completed Lean-kernel-checked proofs for unfinished TCS formalizations from OpenAI's 722 mathematical manuscripts — including [Uniform Matrix Hitting Points (#116-01)](https://wangqy031216-cloud.github.io/turing-agent/results.html#116-01), [Uniform Hypergraph Influence Bound (#186-01)](https://wangqy031216-cloud.github.io/turing-agent/results.html#hypergraph-influence), and [Random 3-SAT Hitting Time Variance (#235-02)](https://wangqy031216-cloud.github.io/turing-agent/results.html#random-3sat).
- **Benchmark Performance**: Achieves up to **61.54%** faithful formalization success on **Formal TCS Bench** (**99.30%** compilation rate) and **82.66%** pass@1 proof completion on **RLMEval** ([Benchmarks →](https://wangqy031216-cloud.github.io/turing-agent/results.html#benchmarks)).
- **Interactive Proof Replays**: Step through real formalization runs and inspect verified Lean proofs on our [Demos Page](https://wangqy031216-cloud.github.io/turing-agent/demos.html).

---

## 📖 Citation

```bibtex
@article{turingagent2026,
  title         = {Turing Agent: Agentic Formal Verification for Mathematical Research},
  author        = {{Turing Agent Team}},
  year          = {2026},
  eprint        = {2608.03283},
  archivePrefix = {arXiv},
  url           = {https://arxiv.org/pdf/2608.03283}
}
```
