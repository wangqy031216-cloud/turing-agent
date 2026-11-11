/* =====================================================================
   News — every update from the team: workshops, results, releases,
   talks, papers... One list feeds both the News page (news.html) and the
   "News" box on the home page (latest 3 items).

   HOW TO ADD AN ITEM: add an object to `items` (any order; pages sort by
   date). Items dated in the future are listed under "Upcoming".
   Required: `date` (YYYY-MM-DD) and `title`. Everything else is optional.

   Short item (copy, edit):

   {
     id: "turing-agent-report",               // anchor: news.html#turing-agent-report
     type: "Release",                         // label: Workshop, Release, Result, Talk, Paper, ...
     date: "2026-12-01",
     title: "Turing Agent technical report released",
     summary: "One or two sentences. HTML allowed, e.g. <a href=\"harness.html\">links</a>.",
     links: [{ label: "PDF", href: "files/turing-agent.pdf" }]
   },

   Event with a full program: also give `time`, `series`, `title_zh`,
   `subtitle`, `speakers`, `intro`, `poster`, `photo` and `program`
   (see the AI4TCS workshop below). Such items get an expandable
   "Program, abstracts & photos" panel; the latest one opens by default.
   Images go in assets/img/workshops/ (or assets/img/news/), files in files/.
   ===================================================================== */
window.TA = window.TA || {};

TA.news = {
  intro: "Updates from the Turing Agent team: workshops, results, releases and talks. Programs, abstracts, slides and photos are kept with each item.",
  items: [
    {
      id: "ai4tcs-workshop-2026",
      type: "Workshop",
      date: "2026-10-30",
      time: "Fri 10:00–17:00",
      series: "Pujiang Science Community · Xinghe Workshop",
      title: "AI4TCS Workshop — After AI Can Solve Problems: Toward TCS 2.0",
      title_zh: "当 AI 会解题之后：走向 TCS 2.0",
      subtitle: "AI for Theoretical Computer Science: From Problem Solving to New Frontiers · Algorithms, Complexity, Verification and Beyond",
      speakers: "Chao Xu · Yi Zhou · Yiping Liu · Toru Takisaka · Shen Jiachen · Hao Yan",
      summary: "A one-day workshop on what changes for theoretical computer science once AI can solve research problems: mathematical agents, AI-assisted algorithm design, certificates between AI and formal verification, formal-math tooling and AI-assisted cryptanalysis. Four invited talks, two short talks and an internal discussion.",
      intro: "AI systems now solve research-level problems, and proof assistants such as Lean can certify the results. This workshop asked what that means for theoretical computer science in practice. Speakers from UESTC, CUHK-Shenzhen, Imperial College London and Shanghai AI Laboratory compared experiences from three directions: how the harness around a language model shapes a mathematical agent, what AI-assisted development of combinatorial algorithms can and cannot do today, and how certificates let untrusted AI proposers work with small trusted checkers. The morning had four invited talks; the afternoon had two short talks and an open internal discussion.",
      poster: "assets/img/workshops/2026-10-30-poster.webp",
      photo: { src: "assets/img/workshops/2026-10-30-group.webp", caption: "Participants after the morning session, 30 October 2026." },
      program: [
        {
          name: "Morning session · Invited talks",
          time: "10:00–12:30",
          items: [
            {
              time: "10:00–10:45",
              title: "An AI Agent for Empowering Theoretical Computer Science Research",
              title_zh: "赋能理论计算机科学研究的 AI 智能体",
              speakers: [{ name: "Agent Framework Innovation Team", affil: "Agent System Center, Shanghai AI Laboratory" }]
            },
            {
              time: "10:45–11:30",
              title: "Exploring the Design Space of Mathematical Agents",
              title_zh: "探索数学智能体的设计空间",
              speakers: [{ name: "Chao Xu", affil: "University of Electronic Science and Technology of China" }],
              abstract: "A mathematical agent combines a language model with a harness that supports sustained work on mathematical problems. Our objective is to improve mathematical problem-solving capability at a given token cost. This talk explores how that objective shapes the design space of mathematical agents. I will briefly survey existing approaches, then draw on our experience developing a mathematical agent to discuss the principles and tradeoffs behind harness design. I will present experiments examining the relationship between design choices, mathematical capability, and token cost, discuss what we have learned, and outline the questions and directions that remain open.",
              bios: [
                "<strong>Chao Xu</strong> is a professor in the School of Computer Science and Engineering at UESTC and holds an NSFC Excellent Young Scientists Fund (overseas) grant. He works in theoretical computer science, especially combinatorial optimization, and has published in SODA, Mathematical Programming and SIAM Journal on Computing."
              ]
            },
            {
              time: "11:30–12:00",
              title: "AI-Assisted Combinatorial Optimization Research: Practical Experiences",
              title_zh: "AI 辅助组合优化研究：实践经验",
              speakers: [
                { name: "Yi Zhou", affil: "University of Electronic Science and Technology of China" },
                { name: "Yiping Liu", affil: "The Chinese University of Hong Kong, Shenzhen" }
              ],
              abstract: "Large language models and coding agents are becoming part of the daily work of developing combinatorial optimization algorithms. Drawing on concrete examples and unresolved challenges from our research, this talk examines the practical capabilities, limitations, and collaboration methods of AI-assisted algorithm development. We focus on three cases: improving reductions for the maximum independent set problem, tuning algorithms for complex scheduling problems, and exploring modeling improvements for optimization solvers. Our experience shows that AI can independently carry out algorithm improvement and tuning tasks, but it also introduces challenges, including overfitting to limited datasets, rapid growth in code complexity, and the high cost of verifying large numbers of heuristic rules. In practice, human input helps guide the exploration and clarify the reasoning behind the resulting algorithms.",
              bios: [
                "<strong>Yi Zhou</strong> is a professor in the School of Computer Science and Engineering at UESTC. He received his PhD from LERIA, University of Angers, France, in 2017. He works on practical algorithms for hard graph problems, with more than 40 papers in venues including AAAI, IJCAI, WWW, IJOC and EJOR, and recently on using AI agents to help design algorithms for hard combinatorial search.",
                "<strong>Yiping Liu</strong> is a postdoctoral researcher at The Chinese University of Hong Kong, Shenzhen. He works on graph algorithms, algorithm engineering, combinatorial optimization and graph machine learning, designing efficient exact and heuristic algorithms for hard graph problems with a focus on practical data reduction, dense subgraph discovery and data pricing for graph neural networks. His work appears in INFORMS Journal on Computing, Expert Systems with Applications, IJCAI and AAMAS."
              ]
            },
            {
              time: "12:00–12:30",
              title: "Untrusted Proposers, Trusted Checkers: Certificates as the Interface between AI and Formal Verification",
              title_zh: "不可信提议者，可信检查器：证书作为 AI 与形式化验证的接口",
              speakers: [{ name: "Toru Takisaka", affil: "University of Electronic Science and Technology of China" }],
              abstract: "AI systems now solve open mathematical problems, and we trust them because Lean checks the proofs. Formal verification has long worked this way: an untrusted proposer guesses a certificate, a small trusted checker decides. Drawing on my own work on certificates for probabilistic programs, I survey how LLMs are being cast as the proposer in program-verification tasks such as generating loop invariants, producing verified code, and writing formal specifications. I also ask what failures turned out to be specific to LLM proposers. The talk aims to surface questions worth pursuing together across formal verification and AI research.",
              bios: [
                "<strong>Toru Takisaka</strong> is an associate professor at UESTC. His research is on probabilistic formal verification, including martingale-based methods and termination analysis of stochastic games, published in top venues of theoretical computer science such as CAV, LICS and ACM TOPLAS. He has received support from the NSFC Excellent Young Scientists Fund."
              ]
            }
          ]
        },
        {
          name: "Afternoon session · Short talks & discussion",
          time: "14:00–17:00",
          items: [
            {
              time: "14:00–14:15",
              title: "Litex: The Python of Formal Mathematics",
              title_zh: "Litex：形式化数学的 Python",
              speakers: [{ name: "Shen Jiachen", affil: "Joint PhD student, Life Sciences AI Center, Shanghai AI Laboratory" }]
            },
            {
              time: "14:15–14:30",
              title: "AI-Assisted Cryptanalysis: From Understanding Schemes to Validating Attacks",
              title_zh: "AI 辅助密码分析：从理解方案到验证攻击",
              speakers: [{ name: "Hao Yan", affil: "PhD student, Imperial College London · Research intern, Safety Foundation Model Center, Shanghai AI Laboratory" }]
            },
            {
              time: "14:30–17:00",
              title: "Internal discussion",
              title_zh: "内部研讨",
              kind: "break"
            }
          ]
        }
      ],
      links: []
    }
  ]
};
