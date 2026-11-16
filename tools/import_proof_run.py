#!/usr/bin/env python3
"""Import the local OpenAI 235 proof run into the existing DAG replay format.

    python3 tools/import_proof_run.py /path/to/local-proof-run

Only public mathematical fields are copied from state/tools records. Runtime
errors, service responses, private paths and operator instructions are excluded.
The source directory is read-only; all five existing trace entries are retained.
"""

import argparse
import gzip
import json
import os
import re
import tempfile
from collections import Counter
from pathlib import Path

from extract_traces import OUT, RUNS, extract, ts, write_js


RUN_ID = "openai-math-235"
PROBE_KINDS = {"probed", "proof_action_error", "prefix_error", "policy_rejected"}
FAILURE_KINDS = PROBE_KINDS - {"probed"} | {"compile_error", "mathematical_rejection"}
PRIVATE_TEXT = re.compile(
    r"/home/|/Users/|/root/|/tmp/|api[_ -]?key|bearer\s+|https?://|"
    r"429\s+Too|rate.?limit|PJLab|operator guidance|Responses.?Chat",
    re.IGNORECASE,
)
NODE_FIELDS = (
    "id", "claim", "depends_on", "statement", "body", "status",
    "semantic_risk", "route", "route_reason",
)


def read_json(path):
    with path.open(encoding="utf-8") as stream:
        return json.load(stream)


def public_text(value, optional=False):
    value = value or ""
    if PRIVATE_TEXT.search(value):
        if optional:
            return ""
        raise ValueError("A public mathematical field contains private or external text")
    return value


def public_node(node):
    result = {key: node[key] for key in NODE_FIELDS if key in node}
    for key in ("claim", "statement", "body"):
        if key in result:
            result[key] = public_text(result[key])
    if "route_reason" in result:
        result["route_reason"] = public_text(result["route_reason"], optional=True)
    return result


def validate_graph(nodes):
    by_id = {node["id"]: node for node in nodes}
    if len(by_id) != len(nodes) or "root" not in by_id:
        raise ValueError("The proof graph must have unique IDs and one root")
    visiting, visited = set(), set()

    def visit(node_id):
        if node_id not in by_id:
            raise ValueError("Unknown dependency: " + node_id)
        if node_id in visiting:
            raise ValueError("Cyclic dependency at " + node_id)
        if node_id in visited:
            return
        visiting.add(node_id)
        for dependency in by_id[node_id].get("depends_on", by_id[node_id].get("deps", [])):
            visit(dependency)
        visiting.remove(node_id)
        visited.add(node_id)

    for node_id in by_id:
        visit(node_id)


def observer_export(source, cfg):
    state = read_json(source / "proof/state.json")
    report = read_json(source / "proof/report.json")
    kernel = read_json(source / "proof/kernel-proof.json")
    target = read_json(source / "lean/proof-target.json")
    validation = read_json(source / "lean/proof-target-validation.json")
    if not (
        state.get("status") == "completed"
        and state.get("formal_status") == "export_verified"
        and state.get("fidelity_status") == "accepted"
        and state.get("root_candidate", {}).get("status") == "accepted"
        and validation.get("ok")
        and kernel.get("verification_method") == "independent_kernel"
        and kernel.get("review", {}).get("decision") == "accept"
        and state.get("exact_export_compiled")
        and report.get("exact_export_compiled")
    ):
        raise ValueError("The source does not contain the expected completed proof checks")

    helpers = [public_node(node) for node in state["nodes"]]
    helper_ids = {node["id"] for node in helpers}
    root_body = public_text(state["root_body"])
    if any(
        root_body.strip() != record["inputs"]["body"].strip()
        for record in (kernel, state["root_candidate"])
    ):
        raise ValueError("The final root body differs from the accepted candidate")
    root_dependencies = sorted(set(re.findall(r"\bProofSteps\.([A-Za-z_][A-Za-z_0-9]*)", root_body)))
    if not set(root_dependencies) <= helper_ids:
        raise ValueError("The root refers to a missing helper")
    statement = target["original_declaration"]
    statement = re.sub(r"\s*:=\s*by\s+sorry\s*$", "", statement).strip()
    root = {
        "id": "root",
        "claim": public_text(cfg["root_claim"]),
        "statement": public_text(statement),
        "body": root_body,
        "depends_on": root_dependencies,
        "status": "proved",
        "semantic_risk": False,
    }
    nodes = [root] + helpers
    if len(helpers) != report.get("proved_nodes") or any(node.get("status") != "proved" for node in helpers):
        raise ValueError("Final helper statuses disagree with the report")
    validate_graph(nodes)

    records = []
    with (source / "proof/tools.jsonl").open(encoding="utf-8") as stream:
        for line in stream:
            records.append(json.loads(line))
    starts = {record["call_id"]: record for record in records if record["event"] == "started"}
    completions = [record for record in records if record["event"] == "completed"]
    if len(starts) != len(completions) or len({record["call_id"] for record in completions}) != len(completions):
        raise ValueError("Tool calls are missing their unique start/completion pair")

    events, proven, counters = [], set(), Counter()

    def event(at, kind, node_id=None, tool=None, arguments=None):
        item = {"at": at, "kind": kind, "scope": "main"}
        if node_id:
            item["node_id"] = node_id
        if tool:
            item["details"] = {"tool": tool, "arguments": arguments or {}}
        events.append(item)

    # Start/completion timestamps preserve the existing extractor's active-time
    # convention. Their raw arguments/results are never passed to the extractor.
    for record in records:
        if record["event"] == "started":
            event(record["timestamp"], "tool.started", tool=record["tool"])
            continue
        if record["event"] != "completed":
            raise ValueError("Unknown tool record event")
        start = starts[record["call_id"]]
        if start["tool"] != record["tool"] or ts(start["timestamp"]) > ts(record["timestamp"]):
            raise ValueError("Invalid tool call pairing")
        arguments, result = start["arguments"], record["result"]
        tool, at = record["tool"], record["timestamp"]
        node_id = arguments.get("target_id") or arguments.get("node_id")
        kind = result.get("kind")
        event_kind, public_arguments, public_tool = "tool.completed", {}, tool
        if tool in {"probe_proof", "check_route"}:
            public_tool = "proof_action_not_run"

        if tool == "set_plan" and result.get("ok"):
            event(at, "graph.plan", tool=tool, arguments={"nodes": [public_node(node) for node in arguments["nodes"]]})
        elif tool == "add_node" and result.get("ok"):
            public_arguments = {"node": public_node(arguments["node"])}
        elif tool in {"probe_proof", "check_route"} and kind in PROBE_KINDS:
            # check_route runs the same Lean probe mechanism as probe_proof.
            # Administrative invalid-input refusals are outside these counters.
            public_tool = "probe_proof"
            counters["probes"] += 1
            if not result.get("ok"):
                event_kind = "tool.failure"
                counters["failures"] += 1
        elif tool in {"attempt_proof", "check_node"} and result.get("ok") and kind == "proved":
            if node_id not in helper_ids or node_id in proven:
                raise ValueError("Unexpected or duplicate helper proof event")
            helper = next(node for node in state["nodes"] if node["id"] == node_id)
            if result.get("source_path") != helper.get("source_path"):
                raise ValueError("A proof timestamp belongs to a different helper version")
            source_parts = Path(result["source_path"]).parts[-3:]
            if source_parts[0] != "attempts":
                raise ValueError("Unexpected helper proof artifact layout")
            artifact = source / "proof" / Path(*source_parts)
            checked_source = " ".join(artifact.read_text(encoding="utf-8").split())
            if any(" ".join(helper[field].split()) not in checked_source for field in ("statement", "body")):
                raise ValueError("Final helper text differs from its checked proof artifact")
            proven.add(node_id)
            event(at, "node.proved", node_id=node_id)
        elif kind in FAILURE_KINDS and not result.get("ok"):
            event_kind = "tool.failure"
            counters["failures"] += 1
        elif tool == "save_experience" and result.get("ok"):
            lesson = public_text(arguments.get("lesson"), optional=True)
            if lesson:
                public_arguments = {"lesson": lesson}

        # Only accepted helper reviews and actually saved experiences should
        # appear in the replay, while other tool timestamps remain neutral.
        if tool == "review_node" and not result.get("ok") and event_kind != "tool.failure":
            public_tool = "review_not_completed"
        if tool == "save_experience" and not public_arguments:
            public_tool = "experience_not_saved"
        event(at, event_kind, node_id=node_id, tool=public_tool, arguments=public_arguments)

    if proven != helper_ids:
        raise ValueError("Some final helper proofs have no recorded success timestamp")
    if counters["probes"] != report.get("probe_attempts") or counters["failures"] != report.get("failures"):
        raise ValueError("Reconstructed mathematical counters disagree with the report")

    compactions = [entry for entry in state["compaction_history"] if entry.get("status") == "completed"]
    if len(compactions) != report.get("compressions"):
        raise ValueError("Completed compactions disagree with the report")
    for entry in compactions:
        event(entry["dispatched_at"], "compression.started")
    event(state["root_candidate"]["completed_at"], "node.proved", node_id="root")

    pipeline = [
        {"id": "statement", "status": "provided"},
        {"id": "helpers", "status": "passed"},
        {"id": "kernel", "status": "passed"},
        {"id": "fidelity", "status": "passed"},
        {"id": "export", "status": "passed"},
    ]
    return {
        "run": {"theorem_name": "variance_upper_bound"},
        "events": events,
        "current": {
            "nodes": nodes,
            "pipeline": pipeline,
            "probe_attempts": counters["probes"],
            "failures": counters["failures"],
            "compressions": len(compactions),
        },
        "stats": {"tool_records": len(completions)},
    }


def validate_trace(meta, trace):
    nodes, timeline = trace["nodes"], trace["timeline"]
    validate_graph(nodes)
    stats = meta["stats"]
    if stats["nodes"] != 109 or stats["proved"] != 109 or stats["used"] != 106 or stats["dropped"] != 1:
        raise ValueError("Unexpected final/dropped proof graph sizes")
    counts = Counter(event[1] for event in timeline)
    if counts["p"] != stats["probes"] or counts["c"] != stats["compactions"]:
        raise ValueError("Timeline probe/compaction counts disagree with metadata")
    if sum(node.get("fails", 0) for node in nodes) != stats["failures"]:
        raise ValueError("Per-node mathematical failures disagree with metadata")
    if counts["v"] != stats["proved"] or counts["a"] != len(nodes) or counts["d"] != stats["dropped"]:
        raise ValueError("Timeline graph transitions disagree with metadata")
    previous = -1
    for elapsed, kind, index in timeline:
        if not (previous <= elapsed <= meta["duration"]) or index < -1 or index >= len(nodes):
            raise ValueError("Invalid timeline ordering, duration or node index")
        if index == -1 and kind != "c":
            raise ValueError("A node event does not refer to an existing node")
        previous = elapsed
    for node in nodes:
        if node.get("t_ok") is not None and node["t_ok"] < node["t_in"]:
            raise ValueError("A node was proved before it appeared")
    public_text(json.dumps(trace, ensure_ascii=False))


def merge_index(path, meta):
    content = path.read_text(encoding="utf-8")
    match = re.search(r"TA\.traces\s*=\s*(\[.*\]);\s*$", content, re.DOTALL)
    if not match:
        raise ValueError("Cannot read the existing trace index")
    existing = json.loads(match.group(1))
    if len({entry["id"] for entry in existing}) != len(existing):
        raise ValueError("Existing trace index has duplicate IDs")
    updated, inserted = [], False
    for entry in existing:
        if entry["id"] == RUN_ID:
            continue
        updated.append(entry)
        if entry["id"] == "openai-math-186-ds":
            updated.append(meta)
            inserted = True
    if not inserted:
        raise ValueError("The expected preceding trace is absent")
    return updated


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="Local run directory containing proof/ and lean/")
    args = parser.parse_args()
    cfg = next(entry for entry in RUNS if entry["id"] == RUN_ID)
    raw = observer_export(args.source.resolve(), cfg)
    out = Path(OUT)
    out.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix=".proof-import-", dir=out) as temporary:
        temporary = Path(temporary)
        export_path = temporary / "observer.json.gz"
        with gzip.open(export_path, "wt", encoding="utf-8") as stream:
            json.dump(raw, stream, ensure_ascii=False)
        meta, trace = extract(export_path, cfg)
        validate_trace(meta, trace)
        index = merge_index(out / "index.js", meta)
        trace_path = temporary / (RUN_ID + ".js")
        index_path = temporary / "index.js"
        variable = "TA.traceData = TA.traceData || {}; TA.traceData[" + json.dumps(RUN_ID) + "]"
        write_js(trace_path, variable, trace)
        write_js(index_path, "TA.traces", index)
        os.replace(trace_path, out / trace_path.name)
        os.replace(index_path, out / "index.js")
    print(
        f"{RUN_ID}: {meta['stats']['nodes']} proved nodes, {meta['stats']['used']} used, "
        f"{meta['stats']['dropped']} dropped, {meta['stats']['probes']} probes, "
        f"{meta['stats']['failures']} mathematical failures, {len(trace['timeline'])} replay events"
    )


if __name__ == "__main__":
    main()
