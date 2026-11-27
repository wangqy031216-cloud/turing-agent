<div align="center">
  <img src="assets/img/logo.png" alt="Turing Agent Logo" width="160">

  <h1>Turing Agent</h1>

  <p>
    <strong>Agentic Formal Verification for Mathematical Research</strong><br>
    <strong>面向数学研究的智能体形式化验证系统</strong>
  </p>

  <p>
    <em>Shanghai Artificial Intelligence Laboratory · 上海人工智能实验室</em>
  </p>

  <p>
    <a href="https://wangqy031216-cloud.github.io/turing-agent/"><img src="https://img.shields.io/badge/🌐_Project_Page-Website-1e3a8a?style=for-the-badge" alt="Project Page"></a>
    <a href="https://arxiv.org/pdf/2608.03283"><img src="https://img.shields.io/badge/📄_Paper-arXiv_2608.03283-b4513f?style=for-the-badge" alt="Paper"></a>
  </p>

  <p>
    <a href="#-news--最新动态">News / 最新动态</a> ·
    <a href="#-introduction">English</a> ·
    <a href="#-项目简介">中文</a> ·
    <a href="#-citation">Citation</a>
  </p>
</div>

---

## 🔥 News / 最新动态

- **`[2026-11]`** 🎉 **Turing Agent Released / 正式发布** — Technical report, official project portal, benchmark evaluations, and interactive proof replays are live. 发布技术报告、项目主页、评测结果与交互式证明回放。 [[Paper](https://arxiv.org/pdf/2608.03283)] [[Website](https://wangqy031216-cloud.github.io/turing-agent/)] [[Interactive Demos](https://wangqy031216-cloud.github.io/turing-agent/demos.html)]
- **`[2026-10]`** 🏆 **OpenAI Frontier Math Proofs Completed / 完成 OpenAI 前沿数学手稿证明** — Completed Lean-kernel-checked proofs for unfinished theoretical computer science problems from OpenAI's 722 frontier manuscripts (`#116-01`, `#186-01`, `#235-02`). [[Explore Proofs](https://wangqy031216-cloud.github.io/turing-agent/results.html#openai-problems)]
- **`[2026-10-30]`** 🎤 **AI4TCS Workshop Held / 举办 AI4TCS 研讨会** — *After AI Can Solve Problems: Toward TCS 2.0*（*当 AI 会解题之后：走向 TCS 2.0*）. [[Program & Photos](https://wangqy031216-cloud.github.io/turing-agent/news.html#ai4tcs-workshop-2026)]

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

## ✨ 项目简介

**Turing Agent** 是由上海人工智能实验室研发、面向前沿数学研究与理论计算机科学（TCS）的 **Lean 4** 智能体形式化验证系统。不同于仅针对已形式化题目进行证明搜索，Turing Agent 能够从自然语言研究命题与非形式化论文论证出发，端到端产出忠实于原意、无 `sorry` 缺口且通过独立 Lean 内核检验的完整形式化证明。

- ⚡ **快速（Fast）** — 以 AI 速度推进科研级数学形式化验证。
- 🎯 **忠实（Faithful）** — 严格保持原始数学命题的定义域、假设与结论语义。
- 🧮 **面向 TCS（For TCS）** — 构建经机器检验的理论计算机科学形式化基石。

### 代表成果

- **前沿研究问题验证**：完成 OpenAI 发布的 722 篇前沿数学手稿中未完成 TCS 题目的完整 Lean 内核验证证明，包括 [统一矩阵命中点 (#116-01)](https://wangqy031216-cloud.github.io/turing-agent/results.html#116-01)、[超图性质一致影响力界 (#186-01)](https://wangqy031216-cloud.github.io/turing-agent/results.html#hypergraph-influence) 与 [随机 3-SAT 命中时间线性方差 (#235-02)](https://wangqy031216-cloud.github.io/turing-agent/results.html#random-3sat)。
- **评测基准表现**：在 **Formal TCS Bench** 上取得最高 **61.54%** 语义忠实形式化成功率（编译率 **99.30%**），在 **RLMEval** 上取得 **82.66%** pass@1 证明通过率（[查看完整榜单 →](https://wangqy031216-cloud.github.io/turing-agent/results.html#benchmarks)）。
- **交互式证明回放**：前往 [Demos 页面](https://wangqy031216-cloud.github.io/turing-agent/demos.html) 在线回放真实证明构建全过程并查看节点级 Lean 源码。

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
