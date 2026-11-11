/* =====================================================================
   OpenAI 722 math-manuscript collection — problems handled by Turing Agent.

   HOW TO ADD A PROBLEM: copy one object in `problems` and edit it.
   Only `slug`, `title`, `status` and `summary` are required; every other
   field is optional and its block is simply hidden when missing.

   - Text fields accept HTML. Math: $inline$ and \[display\] (KaTeX).
   - Use String.raw`...` for text with backslashes, and never write the
     two characters  $ {  next to each other inside it.
   - status: "verified" | "in-progress" | "open"
   - The page URL openai.html#<slug> opens that problem directly.
   - Optional `video: { src, poster, caption }` shows an animation above the figure.
   ===================================================================== */
window.TA = window.TA || {};

TA.openai = {
  // Funnel numbers shown at the top of the page.
  funnel: [
    { num: 722, label: "Manuscripts in OpenAI's collection", sub: "released Oct 2026" },
    { num: 121, label: "TCS-related problems" },
    { num: 99,  label: "Already formally verified", sub: "by the original system" },
    { num: 22,  label: "Not yet fully formally verified" },
    { num: 4,   label: "Verified by Turing Agent", sub: "DeepSeek-V4-Pro", highlight: true }
  ],

  problems: [
    /* ------------------------------------------------------------------ */
    {
      slug: "matrix-hitting",
      num: "116-01",
      title: "Uniform Matrix Hitting Points in Every Positive Characteristic",
      area: "Algebraic complexity",
      status: "verified",
      model: "DeepSeek-V4-Pro",
      summary: "Construct a uniform deterministic matrix hitting set for noncommutative polynomial identity testing over fields of every positive characteristic.",
      stats: [
        { k: "Formal status", v: "export_verified" },
        { k: "Fidelity review", v: "accepted" },
        { k: "Lean target", v: "ProofTarget_116" },
        { k: "Kernel check", v: "passed" }
      ],
      intro: String.raw`Polynomial identity testing asks whether an arithmetic formula computes the zero polynomial. For noncommutative formulas the order of multiplication matters, which makes identity testing harder. The central question is whether explicitly constructed matrices can detect <em>all</em> nonzero formulas within a size bound through one fixed matrix substitution.`,
      definition: String.raw`Given a prime $p$, a number of variables $n$ and a formula size bound $s$, construct matrices $(T_1,\ldots,T_n)\in\operatorname{Mat}_d(\mathbb F_p)^n$ such that, for every field $F$ of characteristic $p$ and every nonzero polynomial $f$ computed by a division-free noncommutative arithmetic formula of size at most $s$ over $F$,
\[ f(T_1,\ldots,T_n)\neq 0. \]`,
      note: String.raw`The full positive-characteristic result requires a deterministic construction over $\mathbb F_p$ with $d=O(n^3s^6)$ in polynomial bit time, and extends to acyclic algebraic branching programs. The formalization examined here targets the corresponding <strong>characteristic-zero</strong> result, which uses an explicit rational matrix construction valid for every characteristic-zero coefficient field.`,
      theorem: String.raw`For any positive integers $n,s$ there is an explicitly constructed tuple of rational matrices $(T_1,\ldots,T_n)\in\operatorname{Mat}_d(\mathbb Q)^n$, where $d=1$ if $n=s=1$ and $d=2ns^2$ otherwise, such that for every field $F$ of characteristic zero and every nonzero polynomial $f$ computed by a division-free noncommutative arithmetic formula of size at most $s$ over $F$,
\[ f(T_1,\ldots,T_n)\neq 0. \]`,
      existing: String.raw`OpenAI's characteristic-zero formalization provides an explicit rational matrix generator and a uniform hitting theorem (<code>universal_hitting</code>), together with reusable results for formula representation and matrix evaluation. The argument through power-series independence, differential systems and vanishing-order bounds is encapsulated in that theorem; composing it under the target's quantifiers and dependent types was left open.`,
      process: [
        String.raw`<strong>Finding the right interface.</strong> Direct calls to <code>complete_result</code> and <code>universal_hitting</code> failed because the identifiers were not visible. After inspecting the library, Turing Agent found <code>completeClaim_of_hitting</code>, which reduces the full target to the uniform hitting property of the explicit rational matrices — including the generator's output, encoding and cost guarantees.`,
        String.raw`<strong>An abandoned plan.</strong> It first tried structural induction over scalars, variables, addition and multiplication. Scalars and variables closed (using the entry $(T_i)_{1,0}=1/i\neq 0$), but addition and multiplication did not. An eight-subgoal plan followed — power-series independence, acyclic linear representations, differential systems, vanishing-order bounds, truncation, dimension estimates, special cases, complexity.`,
        String.raw`<strong>Reusing the encapsulated argument.</strong> Inspection showed that <code>universal_hitting</code> already combines those dependencies: a formula with an acyclic representation of $m\le 2s$ states gives
\[ \operatorname{ord}_0(h_f) < (n-1)\binom{m}{2}+m \le 2ns^2, \]
and with $f(T_1,\ldots,T_n)e_0=\pi_d(h_f)$ this yields nonzero evaluation. Turing Agent reused it instead of re-proving the eight goals; none entered the final proof.`,
        String.raw`<strong>Bridging representations.</strong> The recursive translation <code>toImplementation</code> maps a target formula $f$ to $\widehat f$ with $\operatorname{size}(\widehat f)=\operatorname{gates}(f)$ and $\operatorname{coeff}(\widehat f,w)=\operatorname{coefficient}(f,w)$, so the size bound and the nonzero-coefficient witness transfer and <code>universal_hitting</code> applies.`,
        String.raw`<strong>Dependent types.</strong> Transferring back failed under <code>simp</code>/<code>rw</code> because matrix index types <code>Fin d</code> depend on the dimension. Turing Agent used <code>convert</code> to expose the equalities, <code>congrArg Fin</code> to align index types, and equality elimination; evaluation preservation and entry consistency finished the proof, which passed independent Lean kernel verification and the final fidelity review.`
      ],
      figure: { src: "assets/img/dag-116.webp", caption: "Simplified proof DAG for this problem." },
      links: [
        { label: "Replay the proof trace →", href: "traces.html#openai-math-116" }
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "hypergraph-influence",
      num: "186-01",
      title: "A Uniform Influence Bound for Hypergraph Properties",
      area: "Probabilistic combinatorics",
      status: "verified",
      model: "DeepSeek-V4-Pro",
      summary: "Resolve the Friedgut–Kalai hypergraph threshold-width conjecture, extending the theory to general uniform hypergraphs and linking symmetry to Boolean influence.",
      stats: [
        { k: "Auxiliary nodes", v: "27 proved" },
        { k: "Lean probes", v: "1,143" },
        { k: "Tool events", v: "9,827" },
        { k: "Formal status", v: "export_verified" }
      ],
      intro: String.raw`When does a random graph develop a property, and how fast does the probability of that property change as edges become more likely? This problem extends the study of threshold phenomena from graphs to hypergraphs through the relationship between variance and total influence.`,
      definition: String.raw`An $r$-uniform hypergraph has exactly $r$ vertices in each hyperedge. Consider a random $r$-uniform hypergraph on $n$ vertices in which each possible hyperedge is present independently with probability $p$. The objects of interest are Boolean hypergraph properties $f$ invariant under vertex permutations. Write $\operatorname{Var}_p(f)$ for the variance of $f$ and $I_p(f)$ for its total influence — the sum over hyperedges of the probability that flipping that hyperedge changes $f$.`,
      theorem: String.raw`For every integer $r\geq 3$ there is a constant $C_r>0$, depending only on $r$, such that for all $n\geq r$, $p\in(0,1)$ and vertex-permutation-invariant Boolean hypergraph properties $f$,
\[ \operatorname{Var}_p(f) \leq \frac{C_r}{(\log n)^{r/(r-1)}}\, I_p(f). \]
No monotonicity assumption is needed; $I_p(f)$ carries no factor $p(1-p)$.`,
      existing: String.raw`OpenAI's formalization establishes $\operatorname{Var}_p(f)\leq C\, I_p(f)$ and a threshold-width result for monotone <em>graph</em> properties, with reusable tools for Fourier analysis, influence, coordinate restriction and averaging. For $r$-uniform hypergraphs with $r\geq 3$ it provides the model, auxiliary lemmas and a framework for the target theorem, but leaves a parameter-selection lemma unfinished.`,
      process: [
        String.raw`<strong>Variance decomposition.</strong> Expanding the variance directly inside nested sums caused matching failures and type-checking timeouts, so Turing Agent split out lemmas for the mean correspondence and summation-index conversion, then proved
\[ \operatorname{Var}_p(f)=\sum_{S\neq\varnothing}\widehat f_p(S)^2, \qquad \sum_S |S|\,\widehat f_p(S)^2 = p(1-p)\,I_p(f). \]`,
        String.raw`<strong>Low-degree estimate.</strong> Fix a vertex block $B$ of size $m$, keep hyperedges meeting $B$ free and fix the rest to get $f_{B,y}$. Permutations inside $B$ preserve the restriction, so edges in one orbit have equal influence; with orbits of size at least $m$ (for $m\geq r+1$), $I_{p,e}(f_{B,y})\leq I_p(f_{B,y})/m$. A type mismatch — the orbit lemma counts all hyperedges, the influence bound only the free subtype — was resolved with a new bridging lemma.`,
        String.raw`<strong>Averaging and support capture.</strong> Exchanging sums over blocks and hyperedges, and choosing $\alpha=r/(r-1)$, $k=\sqrt{p(1-p)}\log m/64$, $L=(k/r)^\alpha$ subject to $rL(m-1)/(n-1)\leq 1/2$, gives
\[ \sum_{1\leq |S|\leq L}\widehat f_p(S)^2 \leq 2r\,m^{-1/4}\,I_p(f). \]`,
        String.raw`<strong>High-degree estimate.</strong> The direct Fourier sum timed out again. Turing Agent instead proved a general inequality over any finite index type — for $L>0$ and nonnegative $a_i,b_i$, $\sum_{a_i>L} b_i \leq \frac1L\sum_i a_i b_i$ — and applied it with $a_S=|S|$, $b_S=\widehat f_p(S)^2$:
\[ \sum_{|S|>L}\widehat f_p(S)^2 \leq \frac{p(1-p)}{L}\, I_p(f). \]`,
        String.raw`<strong>Closing.</strong> $m=\lfloor\sqrt n\rfloor$ satisfies all parameter conditions for large $n$; small cases follow from $\operatorname{Var}_p(f)\leq I_p(f)$. 27 auxiliary nodes were completed and the result passed export compilation and independent Lean kernel checking. Two extra verified lemmas produced during exploration were not needed by the final proof — reusable by-products.`
      ],
      video: { src: "assets/video/186dag.mp4", poster: "assets/img/186dag-poster.webp", caption: "<b>A proof in motion.</b> The proof DAG for this problem being connected and verified." },
      figure: { src: "assets/img/dag-186.webp", caption: "Simplified proof DAG. Green leaves are used in the final proof, gray leaves are verified but unused; bold borders mark lemmas introduced by Turing Agent (not in the original paper); purple <b>S</b> marks nodes selected for semantic review." },
      links: [
        { label: "Replay the proof trace →", href: "traces.html#openai-math-186-ds" }
      ]
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "random-3sat",
      num: "235-02",
      title: "Linear Variance of the Random 3-SAT Hitting Time",
      area: "Random constraint satisfaction",
      status: "verified",
      model: "DeepSeek-V4-Pro",
      summary: "Establish the linear variance of random 3-SAT hitting times, sharpening the characterization of satisfiability threshold fluctuations.",
      stats: [
        { k: "Auxiliary nodes", v: "108 verified" },
        { k: "Result", v: "Var(Hₙ) = O(n)" },
        { k: "Formal status", v: "export_verified" },
        { k: "Kernel check", v: "passed" }
      ],
      intro: String.raw`In random satisfiability, adding clauses can turn a satisfiable formula into an unsatisfiable one. How much does the timing of this transition vary across random instances? Bounding these fluctuations tells us how tightly the transition is concentrated.`,
      definition: String.raw`A 3-SAT clause is a disjunction of three literals on distinct variables; over $n\geq 3$ variables there are $8\binom{n}{3}$ clauses. Sample clauses $C_1,C_2,\ldots$ independently and uniformly (repetition allowed), let $F_m=C_1\land\cdots\land C_m$ with $F_0$ the satisfiable empty formula, and define the first unsatisfiability time
\[ H_n=\min\{m\geq 1 : F_m \text{ is unsatisfiable}\}. \]
Previous work gave $\operatorname{Var}(H_n)=O(n\log n)$; the goal is $O(n)$.`,
      theorem: String.raw`There is a constant $C>0$, independent of $n$, such that $\operatorname{Var}(H_n)\leq Cn$ for all $n\geq 3$. Together with Wilson's separation theorem this gives $\operatorname{Var}(H_n)=\Theta(n)$.`,
      existing: String.raw`OpenAI's formalization defines the random $k$-SAT model and $H_{n,k}$, proving $\operatorname{Var}(H_{n,3})=O(n\log n)$ and $\operatorname{Var}(H_{n,k})=\Theta(n)$ for fixed $k\geq 4$, with coordinate-deletion inequalities, collision-case estimates, exponential tails and truncation-removal lemmas. Substantial components of the linear bound for $k=3$ remained unformalized.`,
      process: [
        String.raw`<strong>Reduction.</strong> After foundational results (clause counting, survival probabilities, moment identities, small cases, an explicit truncation error $120[2(7/8)^{10}]^n$), Turing Agent used the existing coordinate-deletion inequality: for $T=\min(H_n,10n)$ and deletion delays $D_i$, a uniform bound $\mathbb E[D_i^2]\leq C$ implies $\operatorname{Var}(T)\leq 10Cn$.`,
        String.raw`<strong>Removing the logarithm.</strong> It switched from survival-time estimates for assignment sets to potential-function drift, introducing $P_d(S)=\sum_{j&lt;d} q_j(S)$, where $q_j(S)$ is the probability that $j$ random 2-clauses eliminate every assignment in $S$. Nested averages broke rewriting, so filtering-exchange and averaging identities were proved separately, giving an $O(d^{3/2})$ cumulative bound by telescoping.`,
        String.raw`<strong>Collision-free case.</strong> Monotonicity of the potential extended the estimate to processes with deterministic filtering steps, controlled by the root-incidence count $Z$. With three independent root-variable tests:
\[ 2\bigl(C_0 d^{3/2}+Z\bigr)\bigl(23 d^{3/2}+Z\bigr)=O(d^3), \qquad d=\max(1,Z). \]`,
        String.raw`<strong>Collisions and moments.</strong> Single collisions (two root tests) and multiple collisions (truncation bound) were combined with lemmas for clause decomposition, resampling and averaging over the deleted coordinate, plus exponential, factorial and mixed moment bounds, giving $\mathbb E[D_i^2]=O(1)$ and $\operatorname{Var}(T)=O(n)$.`,
        String.raw`<strong>Back to $H_n$.</strong> Truncation removal $\operatorname{Var}(H_n)\leq 2\operatorname{Var}(T)+O(1)$, satisfiability-preserving bijections between clauses and clause tuples, and tail-sum/integral identities connect to the finite-counting statement. The proof contains <strong>108 verified auxiliary nodes</strong> and passes export compilation and Lean kernel verification.`
      ],
      figure: { src: "assets/img/dag-235.webp", caption: "Simplified proof DAG for the random 3-SAT hitting-time problem." },
      links: []
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "sdp-lift",
      title: "An Exact Semidefinite Lift of a Nonspectrahedral Hyperbolicity Cone",
      area: "Convex algebraic geometry",
      status: "verified",
      model: "DeepSeek-V4-Pro",
      summary: "Construct an exact semidefinite lift of a non-spectrahedral hyperbolicity cone, demonstrating the power of auxiliary variables in exact cone representation.",
      intro: String.raw`One of the four highlighted problems verified by Turing Agent. A detailed write-up of the formal development will be added here.`
    }
  ]
};
