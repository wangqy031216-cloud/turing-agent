#!/usr/bin/env python3
"""
Stamp a fresh version onto every local CSS/JS reference so browsers fetch the
new files right after a deploy instead of showing a cached copy.

    python3 tools/bump_version.py

Run it before committing any change to assets/ or data/. It rewrites
  href="assets/css/site.css"        -> href="assets/css/site.css?v=<stamp>"
  src="data/openai.js?v=<old>"      -> src="data/openai.js?v=<stamp>"
in every top-level .html file, and stores the stamp in data/site.js
(`version`) so scripts loaded on demand (proof traces) use it too.
"""
import glob
import os
import re
from datetime import datetime, timezone

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
stamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M")
ref = re.compile(r'((?:href|src)=")((?:assets|data)/[^"?]+\.(?:css|js))(?:\?v=[^"]*)?(")')

changed = 0
for path in sorted(glob.glob(os.path.join(ROOT, "*.html"))):
    with open(path, encoding="utf-8") as f:
        s = f.read()
    t = ref.sub(lambda m: m.group(1) + m.group(2) + "?v=" + stamp + m.group(3), s)
    if t != s:
        with open(path, "w", encoding="utf-8") as f:
            f.write(t)
        changed += 1

site = os.path.join(ROOT, "data", "site.js")
with open(site, encoding="utf-8") as f:
    s = f.read()
if re.search(r'^\s*version:\s*"[^"]*",', s, re.M):
    s = re.sub(r'^(\s*version:\s*)"[^"]*",', r'\g<1>"' + stamp + '",', s, count=1, flags=re.M)
else:
    s = s.replace("TA.site = {\n", 'TA.site = {\n  version: "' + stamp + '",   // set by tools/bump_version.py\n', 1)
with open(site, "w", encoding="utf-8") as f:
    f.write(s)

print(f"version {stamp}: updated {changed} html files + data/site.js")
