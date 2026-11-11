#!/usr/bin/env python3
"""
Distil proof-pipeline-observer run exports into small files for the portal.

    python3 tools/extract_traces.py /path/to/proof-pipeline-observer/data/runs

Reads   <runs>/<id>.json.gz   (raw observer exports, up to ~125 MB each)
Writes  data/traces/<id>.js   (one compact run, loaded on demand by traces.html)
        data/traces/index.js  (list of runs + headline stats, loaded by every page that lists traces)

To add a run: export it with the observer, add an entry to RUNS below, re-run this script.
Only fields listed here are copied; raw tool arguments/results are never published.
"""
import gzip
import json
import os
import re
import sys
from datetime import datetime

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "data", "traces")

# ---------------------------------------------------------------------------
# Runs to publish (order = display order). Text here is what visitors read.
# ---------------------------------------------------------------------------
RUNS = [
    {
        "id": "openai-math-186-ds",
        "title": "Uniform influence bound for hypergraph properties",
        "short": "OpenAI 186-01 · Hypergraph influence",
        "kind": "Proof formalization · continues OpenAI's Lean library",
        "model": "DeepSeek-V4-Pro",
        "problem": "openai.html#186-01",
        "summary": "Starting from OpenAI's graph-version Lean library, Turing Agent completes the hypergraph extension: Fourier variance identities, the low-degree restriction argument, a general high-degree tail inequality, and the parameter choice that ties them together.",
        "root_label": "Uniform influence bound",
    },
    {
        "id": "openai-math-116",
        "title": "Algorithmic uniform matrix hitting",
        "short": "OpenAI 116-01 · Matrix hitting",
        "kind": "Proof formalization · continues OpenAI's Lean library",
        "model": "DeepSeek-V4-Pro",
        "problem": "openai.html#116-01",
        "summary": "An eight-subgoal plan is proposed and then abandoned once the agent finds that OpenAI's existing universal_hitting theorem already encapsulates the argument; the final proof is a single root node bridging formula representations and dependent matrix types.",
        "root_label": "Matrix hitting (root)",
        "root_claim": "Uniform matrix hitting for noncommutative formulas: the explicit rational matrix tuple is nonzero on every nonzero division-free noncommutative formula of bounded size, completing the algorithmic construction on top of OpenAI's existing formalization.",
    },
    {
        "id": "fcs76-unified",
        "title": "Non-generability of a union of language families",
        "short": "FCS76 · Diagonal construction",
        "kind": "Full pipeline · theorem + proof formalization",
        "problem": "",
        "summary": "End-to-end run on a Formal TCS Bench problem: the main statement is formalized, semantically reviewed and locked, then proved through a diagonal construction split into 21 auxiliary lemmas, followed by kernel check, exact export and independent replay.",
        "root_label": "Main theorem",
    },
    {
        "id": "rlm201",
        "title": "integral_statInfoFun_curvatureMeasure",
        "short": "RLMEval 201 · TestingLowerBounds",
        "kind": "Proof formalization · given statement",
        "problem": "",
        "summary": "A theorem from the TestingLowerBounds project (information-theoretic lower bounds for hypothesis testing). The benchmark supplies the formal statement; Turing Agent decomposes it into six lemmas and proves them.",
        "root_label": "Target theorem",
    },
    {
        "id": "rlm77",
        "title": "weak_PFR_asymm",
        "short": "RLMEval 77 · Polynomial Freiman–Ruzsa",
        "kind": "Proof formalization · given statement",
        "problem": "",
        "summary": "The asymmetric weak PFR theorem from the Polynomial Freiman–Ruzsa project, proved by strong induction through a not-in-coset step, a shift lemma and a subgroup transfer.",
        "root_label": "weak_PFR_asymm",
    },
]

PIPELINE_LABELS = {
    "statement": "Statement",
    "helpers": "DAG proof",
    "kernel": "Root kernel check",
    "fidelity": "Fidelity review",
    "export": "Exact export",
    "replay": "Independent replay",
}
STATEMENT_LABEL = {"provided": "Given statement", "passed": "Statement formalized & locked"}

PROBE_TOOLS = {"probe_proof"}
FAIL_TOOLS = {"probe_proof", "attempt_proof", "check_node", "check_route", "review_node", "check_main", "check_definition"}

LIM_CLAIM, LIM_STMT, LIM_BODY, LIM_LESSON = 700, 1600, 3000, 520


def ts(s):
    return datetime.fromisoformat(s.replace("Z", "+00:00")).timestamp()


def clip(s, n):
    s = (s or "").strip()
    return s if len(s) <= n else s[: n - 1].rstrip() + "…"


def tidy_claim(s):
    # strip LaTeX sectioning noise that appears when a claim is a paper excerpt
    s = re.sub(r"\\(section|subsection|label)\{[^}]*\}", "", s or "")
    return re.sub(r"\s+\n", "\n", s).strip()


def active_seconds(events, cap=900):
    """wall-clock time with idle gaps longer than `cap` seconds removed"""
    t = sorted(ts(e["at"]) for e in events)
    return round(sum(min(b - a, cap) for a, b in zip(t, t[1:])))


def plan_nodes(e):
    d = e.get("details") or {}
    a = d.get("arguments") or {}
    if e.get("kind") == "graph.plan":
        return a.get("nodes") or []
    if e.get("graph"):
        return (e["graph"] or {}).get("nodes") or []
    return []


def extract(path, cfg):
    raw = json.load(gzip.open(path))
    ev = sorted(raw["events"], key=lambda e: (e.get("at") or "", e.get("seq") or 0))
    cur = raw["current"]
    real = [e for e in ev if e.get("kind") != "graph.snapshot" or e.get("scope") == "main"]
    t0 = ts(ev[0]["at"])
    t_end = max(ts(e["at"]) for e in real)

    final = {n["id"]: n for n in cur["nodes"]}
    order = [n["id"] for n in cur["nodes"]]

    # ---- appearance / last plan membership for every node ever planned ----
    first_seen, plan_deps, plan_claim = {}, {}, {}
    plan_events = []
    for e in ev:
        if ts(e["at"]) > t_end + 1:      # post-run export snapshot
            continue
        nodes = plan_nodes(e)
        if e.get("kind") == "graph.plan":
            plan_events.append((ts(e["at"]), {n.get("id") for n in nodes if n.get("id")}))
        d = e.get("details") or {}
        if e.get("kind") == "tool.completed" and d.get("tool") == "add_node":
            nd = (d.get("arguments") or {}).get("node") or {}
            if nd.get("id"):
                nodes = [nd]
        if not nodes:
            continue
        t = ts(e["at"])
        ids = []
        for n in nodes:
            nid = n.get("id")
            if not nid:
                continue
            ids.append(nid)
            first_seen.setdefault(nid, t)
            plan_deps[nid] = n.get("depends_on") or []
            plan_claim[nid] = n.get("claim") or ""

    dropped_ids = [i for i in first_seen if i not in final]
    dropped_at = {}
    for nid in dropped_ids:
        last_in = max((t for t, s in plan_events if nid in s), default=first_seen[nid])
        after = [t for t, s in plan_events if t > last_in and nid not in s]
        dropped_at[nid] = min(after) if after else t_end

    # ---- used in final proof = reachable from root through depends_on ----
    used, stack = set(), ["root"] if "root" in final else []
    while stack:
        x = stack.pop()
        if x in used or x not in final:
            continue
        used.add(x)
        stack.extend(final[x].get("depends_on") or [])

    all_ids = order + [i for i in dropped_ids]
    index = {nid: k for k, nid in enumerate(all_ids)}

    # ---- timeline ----
    tl, proved_at, probes, fails, lessons, reviewed = [], {}, {}, {}, {}, set()
    appeared = {"root"}          # the main theorem exists from the first step

    def push(t, code, nid):
        tl.append([round(t - t0), code, index.get(nid, -1)])

    for e in ev:
        t, k = ts(e["at"]), e.get("kind")
        if t > t_end + 1:
            continue
        d = e.get("details") or {}
        tool = d.get("tool")
        a = d.get("arguments") or {}
        nid = e.get("node_id") or a.get("target_id") or a.get("node_id")
        for n in plan_nodes(e) + ([a.get("node")] if (k == "tool.completed" and tool == "add_node" and a.get("node")) else []):
            i = (n or {}).get("id")
            if i and i not in appeared and i in index:
                appeared.add(i)
                push(t, "a", i)
        if k == "node.proved" and nid in index:
            if nid not in proved_at:
                proved_at[nid] = t
                push(t, "v", nid)
        elif k == "compression.started":
            push(t, "c", None)
        elif tool in PROBE_TOOLS and k in ("tool.completed", "tool.failure", "goal.progress", "goal.probe"):
            probes[nid] = probes.get(nid, 0) + 1
            push(t, "p", nid)
            if k == "tool.failure":
                fails[nid] = fails.get(nid, 0) + 1
        elif k == "tool.failure" and tool in FAIL_TOOLS:
            fails[nid] = fails.get(nid, 0) + 1
            push(t, "f", nid)
        elif k == "tool.completed" and tool == "save_experience":
            text = clip(a.get("lesson"), LIM_LESSON)
            if text:
                lessons.setdefault(nid or "root", []).append(text)
                push(t, "l", nid)
        elif k == "tool.completed" and tool == "review_node":
            reviewed.add(nid)
            push(t, "r", nid)

    for nid in dropped_ids:
        push(dropped_at[nid], "d", nid)
    tl.sort(key=lambda x: x[0])
    # root and nodes that never appeared in a plan exist from the start
    for nid in order:
        if nid not in appeared or nid == "root":
            tl.insert(0, [0, "a", index[nid]])

    def lesson_list(nid):
        seen, out = set(), []
        for s in reversed(lessons.get(nid, [])):
            key = s[:80]
            if key not in seen:
                seen.add(key)
                out.append(s)
            if len(out) >= 3:
                break
        return out

    nodes = []
    for nid in order:
        n = final[nid]
        claim = cfg.get("root_claim") if (nid == "root" and cfg.get("root_claim")) else tidy_claim(n.get("claim"))
        nodes.append({
            "id": nid,
            "label": cfg.get("root_label") if nid == "root" else None,
            "claim": clip(claim, LIM_CLAIM),
            "statement": clip(n.get("statement"), LIM_STMT),
            "body": clip(n.get("body"), LIM_BODY),
            "deps": [x for x in (n.get("depends_on") or []) if x in index],
            "status": n.get("status"),
            "risk": bool(n.get("semantic_risk")),
            "reviewed": nid in reviewed,
            "route": n.get("route"),
            "reason": clip(n.get("route_reason"), 300),
            "used": nid in used,
            "t_in": 0 if (nid == "root" or nid not in first_seen) else round(first_seen[nid] - t0),
            "t_ok": round(proved_at[nid] - t0) if nid in proved_at else None,
            "probes": probes.get(nid, 0),
            "fails": fails.get(nid, 0),
            "lessons": lesson_list(nid),
        })
    for nid in dropped_ids:
        nodes.append({
            "id": nid,
            "claim": clip(tidy_claim(plan_claim.get(nid)), LIM_CLAIM),
            "deps": [x for x in plan_deps.get(nid, []) if x in index],
            "status": "dropped",
            "dropped": True,
            "t_in": round(first_seen[nid] - t0),
            "t_out": round(dropped_at[nid] - t0),
            "probes": probes.get(nid, 0),
            "fails": fails.get(nid, 0),
            "lessons": lesson_list(nid),
        })

    pipeline = []
    for p in cur.get("pipeline") or []:
        label = PIPELINE_LABELS.get(p["id"], p["id"])
        if p["id"] == "statement":
            label = STATEMENT_LABEL.get(p["status"], label)
        pipeline.append({"id": p["id"], "label": label, "status": p["status"]})

    n_lessons = sum(1 for x in tl if x[1] == "l")
    meta = {k: cfg.get(k) for k in ("id", "title", "short", "kind", "model", "problem", "summary") if cfg.get(k)}
    meta.update({
        "theorem": raw["run"].get("theorem_name"),
        "start": ev[0]["at"],
        "duration": round(t_end - t0),
        "active": active_seconds(real),
        "stats": {
            "nodes": len(order),
            "proved": sum(1 for n in order if final[n].get("status") == "proved"),
            "used": len(used),
            "dropped": len(dropped_ids),
            "probes": cur.get("probe_attempts") or 0,
            "failures": cur.get("failures") or 0,
            "compactions": cur.get("compressions") or 0,
            "tool_calls": raw["stats"].get("tool_records") or 0,
            "lessons": n_lessons,
            "reviews": len(reviewed),
        },
        "pipeline": pipeline,
    })
    return meta, {"meta": meta, "nodes": nodes, "timeline": tl}


def write_js(path, var, obj):
    with open(path, "w", encoding="utf-8") as f:
        f.write("/* generated by tools/extract_traces.py — do not edit by hand */\n")
        f.write("window.TA = window.TA || {};\n")
        f.write(var + " = " + json.dumps(obj, ensure_ascii=False, separators=(",", ":")) + ";\n")


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    src = sys.argv[1]
    os.makedirs(OUT, exist_ok=True)
    index = []
    for cfg in RUNS:
        p = os.path.join(src, cfg["id"] + ".json.gz")
        if not os.path.exists(p):
            print("skip (missing):", p)
            continue
        meta, full = extract(p, cfg)
        write_js(os.path.join(OUT, cfg["id"] + ".js"), "TA.traceData = TA.traceData || {}; TA.traceData[" + json.dumps(cfg["id"]) + "]", full)
        index.append(meta)
        size = os.path.getsize(os.path.join(OUT, cfg["id"] + ".js"))
        print(f"{cfg['id']:22s} nodes={meta['stats']['nodes']:3d} dropped={meta['stats']['dropped']:2d} "
              f"timeline={len(full['timeline']):5d} lessons={meta['stats']['lessons']:4d} -> {size/1024:.0f} KB")
    write_js(os.path.join(OUT, "index.js"), "TA.traces", index)


if __name__ == "__main__":
    main()
