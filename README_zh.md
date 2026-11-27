<div align="center">
  <img src="assets/img/logo.png" alt="Turing Agent Logo" width="160">

  <h1>Turing Agent</h1>

  <p>
    <strong>面向数学研究的智能体形式化验证系统</strong><br>
    <em>上海人工智能实验室</em>
  </p>

  <p>
    <a href="https://wangqy031216-cloud.github.io/turing-agent/"><img src="https://img.shields.io/badge/🌐_Project_Page-项目主页-1e3a8a?style=for-the-badge" alt="项目主页"></a>
    <a href="https://arxiv.org/pdf/2608.03283"><img src="https://img.shields.io/badge/📄_Paper-arXiv_2608.03283-b4513f?style=for-the-badge" alt="论文"></a>
  </p>

  <p>
    <a href="README.md">English</a> · <b>简体中文</b>
  </p>
</div>

---

## 🔥 最新动态

- **`[2026-11]`** 🎉 **Turing Agent 正式发布** — 技术报告、官方项目主页、评测结果与交互式证明回放正式上线。 [[论文 PDF](https://arxiv.org/pdf/2608.03283)] [[项目主页](https://wangqy031216-cloud.github.io/turing-agent/)] [[交互式回放](https://wangqy031216-cloud.github.io/turing-agent/demos.html)]
- **`[2026-10]`** 🏆 **完成 OpenAI 前沿数学手稿未完成证明** — 完成 OpenAI 722 篇前沿数学手稿中未完成理论计算机科学问题的完整 Lean 内核验证证明（`#116-01`、`#186-01`、`#235-02`）。 [[查看证明解析](https://wangqy031216-cloud.github.io/turing-agent/results.html#openai-problems)]
- **`[2026-10-30]`** 🎤 **举办 AI4TCS 专题研讨会** — *当 AI 会解题之后：走向 TCS 2.0*。 [[日程与回顾](https://wangqy031216-cloud.github.io/turing-agent/news.html#ai4tcs-workshop-2026)]

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

## 📖 引用（Citation）

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
