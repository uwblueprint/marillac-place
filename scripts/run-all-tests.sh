#!/usr/bin/env bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "========================================"
echo "[all-tests] 1/3 Unit tests"
echo "========================================"
echo "[unit] Running frontend user/unit tests..."
cd "$REPO_ROOT/frontend"
yarn test --watchAll=false

echo "[unit] Running backend unit tests..."
cd "$REPO_ROOT/backend"
yarn test:unit

echo "[unit] Unit test suite complete."

echo "========================================"
echo "[all-tests] 2/3 Integration tests"
echo "========================================"
cd "$REPO_ROOT/backend"

mapfile -t TEST_FILES < <(
  python3 - <<'PY'
import pathlib

root = pathlib.Path("tests/integration")
for p in sorted(root.glob("*.test.ts")):
    print(p.as_posix())
PY
)

if [ "${#TEST_FILES[@]}" -eq 0 ]; then
  echo "[integration] No integration tests found under backend/tests/integration"
  exit 1
fi

echo "[integration] Running ${#TEST_FILES[@]} integration tests"
./node_modules/.bin/tsx --test "${TEST_FILES[@]}"

echo "========================================"
echo "[all-tests] 3/3 End-to-end tests"
echo "========================================"
echo "[e2e] Running Playwright end-to-end suite..."
cd "$REPO_ROOT/e2e"
yarn test:docker
echo "[e2e] E2E suite complete."

echo "========================================"
echo "[all-tests] 4/4 Coverage generation"
echo "========================================"
echo "[coverage] Generating frontend unit coverage..."
cd "$REPO_ROOT/frontend"
yarn test:coverage

echo "[coverage] Generating backend unit coverage..."
cd "$REPO_ROOT/backend"
yarn test:coverage:unit

echo "[coverage] Generating backend integration coverage..."
yarn test:coverage:integration

echo "[coverage] Building E2E browser coverage report (if raw data exists)..."
cd "$REPO_ROOT/e2e"
node ./scripts/build-e2e-coverage.mjs || true

echo "[coverage] Combining LCOV files and exporting CSV summary..."
OUT_DIR="$REPO_ROOT/coverage/all"
OUT_FILE="$OUT_DIR/lcov.info"
CSV_FILE="$OUT_DIR/summary.csv"
HTML_DIR="$OUT_DIR/lcov-report"
HTML_FILE="$HTML_DIR/index.html"

INPUTS=(
  "$REPO_ROOT/frontend/coverage/lcov.info"
  "$REPO_ROOT/backend/coverage/unit/lcov.info"
  "$REPO_ROOT/backend/coverage/integration/lcov.info"
  "$REPO_ROOT/e2e/coverage/e2e/lcov.info"
)

mkdir -p "$OUT_DIR"
: > "$OUT_FILE"

included=0
for input in "${INPUTS[@]}"; do
  if [[ -f "$input" ]]; then
    cat "$input" >> "$OUT_FILE"
    printf "\n" >> "$OUT_FILE"
    included=$((included + 1))
  fi
done

if [[ "$included" -eq 0 ]]; then
  echo "[coverage] No LCOV files found to combine."
  exit 1
fi

echo "[coverage] Wrote combined LCOV: $OUT_FILE"

python3 - "$OUT_FILE" "$CSV_FILE" "$HTML_FILE" "$REPO_ROOT" <<'PY'
import csv
import json
import sys
from pathlib import Path
from html import escape

lcov_path = Path(sys.argv[1])
csv_path = Path(sys.argv[2])
html_path = Path(sys.argv[3])
repo_root = Path(sys.argv[4])

rows = []
current = None

def new_record(sf: str):
    return {
        "file": sf,
        "LF": 0,
        "LH": 0,
        "FNF": 0,
        "FNH": 0,
        "BRF": 0,
        "BRH": 0,
    }

for raw in lcov_path.read_text(encoding="utf8", errors="ignore").splitlines():
    line = raw.strip()
    if line.startswith("SF:"):
        current = new_record(line[3:])
    elif current is not None and line.startswith("LF:"):
        current["LF"] = int(line[3:] or 0)
    elif current is not None and line.startswith("LH:"):
        current["LH"] = int(line[3:] or 0)
    elif current is not None and line.startswith("FNF:"):
        current["FNF"] = int(line[4:] or 0)
    elif current is not None and line.startswith("FNH:"):
        current["FNH"] = int(line[4:] or 0)
    elif current is not None and line.startswith("BRF:"):
        current["BRF"] = int(line[4:] or 0)
    elif current is not None and line.startswith("BRH:"):
        current["BRH"] = int(line[4:] or 0)
    elif line == "end_of_record" and current is not None:
        rows.append(current)
        current = None

totals = {"LF": 0, "LH": 0, "FNF": 0, "FNH": 0, "BRF": 0, "BRH": 0}
for r in rows:
    for key in totals:
        totals[key] += r[key]

def pct(hit: int, found: int) -> str:
    if found == 0:
        return ""
    return f"{(100.0 * hit / found):.2f}"

def file_href(sf: str) -> str:
    p = Path(sf)
    if not p.is_absolute():
        p = repo_root / p
    try:
        if p.exists():
            return p.resolve().as_uri()
    except Exception:
        return ""
    return ""

csv_path.parent.mkdir(parents=True, exist_ok=True)
with csv_path.open("w", newline="", encoding="utf8") as f:
    writer = csv.writer(f)
    writer.writerow(
        [
            "File",
            "Lines Covered",
            "Lines Total",
            "Lines %",
            "Functions Covered",
            "Functions Total",
            "Functions %",
            "Branches Covered",
            "Branches Total",
            "Branches %",
        ]
    )
    for r in rows:
        writer.writerow(
            [
                r["file"],
                r["LH"],
                r["LF"],
                pct(r["LH"], r["LF"]),
                r["FNH"],
                r["FNF"],
                pct(r["FNH"], r["FNF"]),
                r["BRH"],
                r["BRF"],
                pct(r["BRH"], r["BRF"]),
            ]
        )

    writer.writerow(
        [
            "TOTAL",
            totals["LH"],
            totals["LF"],
            pct(totals["LH"], totals["LF"]),
            totals["FNH"],
            totals["FNF"],
            pct(totals["FNH"], totals["FNF"]),
            totals["BRH"],
            totals["BRF"],
            pct(totals["BRH"], totals["BRF"]),
        ]
    )

print(f"[coverage] Wrote coverage CSV summary: {csv_path}")

line_uncovered = max(totals["LF"] - totals["LH"], 0)
func_uncovered = max(totals["FNF"] - totals["FNH"], 0)
branch_uncovered = max(totals["BRF"] - totals["BRH"], 0)

html_path.parent.mkdir(parents=True, exist_ok=True)
with html_path.open("w", encoding="utf8") as f:
    js_rows = []
    for r in rows:
        file_path = r["file"]
        p = Path(file_path)
        if p.is_absolute():
            try:
                rel = p.resolve().relative_to(repo_root.resolve()).as_posix()
            except Exception:
                rel = p.as_posix()
        else:
            rel = p.as_posix()
        js_rows.append({
            "file": rel,
            "href": file_href(file_path),
            "LH": r["LH"],
            "LF": r["LF"],
            "FNH": r["FNH"],
            "FNF": r["FNF"],
            "BRH": r["BRH"],
            "BRF": r["BRF"],
        })

    f.write("<!doctype html><html><head><meta charset='utf-8'>")
    f.write("<title>Combined Coverage Report</title>")
    f.write("<style>")
    f.write("body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:24px;color:#222;}")
    f.write(".summary{margin:10px 0 18px;max-width:920px;}")
    f.write(".summary th,.summary td{text-align:center;}")
    f.write(".summary th:first-child,.summary td:first-child{text-align:left;}")
    f.write("table{border-collapse:collapse;width:100%;font-size:13px;}")
    f.write("th,td{border:1px solid #ddd;padding:6px 8px;text-align:left;}")
    f.write("th{background:#f5f5f5;position:sticky;top:0;}")
    f.write(".detail tbody tr.row-low{background:#fff1f1;}")
    f.write(".detail tbody tr.row-med{background:#fff9e8;}")
    f.write(".detail tbody tr.row-high{background:#ecfff1;}")
    f.write(".bar-cell{min-width:130px;}")
    f.write(".bar-wrap{height:12px;background:#ffffff;border:1px solid #d8b1b1;border-radius:2px;overflow:hidden;}")
    f.write(".bar-fill{height:100%;}")
    f.write(".cov-low{background:#b70f1f;}")
    f.write(".cov-med{background:#d9a200;}")
    f.write(".cov-high{background:#1f9d55;}")
    f.write(".num{text-align:right;white-space:nowrap;}")
    f.write(".muted{color:#666;}")
    f.write(".sortable{cursor:pointer;user-select:none;}")
    f.write(".folder-btn{background:none;border:none;color:#0b57d0;cursor:pointer;padding:0;font:inherit;text-decoration:underline;}")
    f.write(".crumb{margin:0 0 10px 0;font-size:13px;}")
    f.write(".crumb button{background:none;border:none;color:#0b57d0;cursor:pointer;padding:0 4px 0 0;font:inherit;text-decoration:underline;}")
    f.write(".crumb span{padding-right:4px;}")
    f.write("a{color:#0b57d0;text-decoration:none;}a:hover{text-decoration:underline;}")
    f.write("</style></head><body>")
    f.write("<h1>Combined Coverage Report</h1>")
    f.write("<p>Generated from merged LCOV data.</p>")
    f.write("<table class='summary'><thead><tr>")
    f.write("<th>Name</th><th>Coverage %</th><th>Covered</th><th>Uncovered</th><th>Total</th>")
    f.write("</tr></thead><tbody>")
    f.write(f"<tr><td>Statements (Lines)</td><td>{pct(totals['LH'], totals['LF'])}%</td><td>{totals['LH']}</td><td>{line_uncovered}</td><td>{totals['LF']}</td></tr>")
    f.write(f"<tr><td>Branches</td><td>{pct(totals['BRH'], totals['BRF'])}%</td><td>{totals['BRH']}</td><td>{branch_uncovered}</td><td>{totals['BRF']}</td></tr>")
    f.write(f"<tr><td>Functions</td><td>{pct(totals['FNH'], totals['FNF'])}%</td><td>{totals['FNH']}</td><td>{func_uncovered}</td><td>{totals['FNF']}</td></tr>")
    f.write(f"<tr><td>Files</td><td></td><td>{len(rows)}</td><td>0</td><td>{len(rows)}</td></tr>")
    f.write("</tbody></table>")
    f.write("<div id='crumb' class='crumb'></div>")
    f.write("<table class='detail' id='coverage-detail'><thead><tr>")
    f.write("<th class='sortable' data-col='0' data-type='text'>File</th>")
    f.write("<th></th>")
    f.write("<th class='sortable' data-col='2' data-type='num'>Lines Covered</th>")
    f.write("<th class='sortable' data-col='3' data-type='num'>Lines Total</th>")
    f.write("<th class='sortable' data-col='4' data-type='num'>Lines %</th>")
    f.write("<th class='sortable' data-col='5' data-type='num'>Functions Covered</th>")
    f.write("<th class='sortable' data-col='6' data-type='num'>Functions Total</th>")
    f.write("<th class='sortable' data-col='7' data-type='num'>Functions %</th>")
    f.write("<th class='sortable' data-col='8' data-type='num'>Branches Covered</th>")
    f.write("<th class='sortable' data-col='9' data-type='num'>Branches Total</th>")
    f.write("<th class='sortable' data-col='10' data-type='num'>Branches %</th>")
    f.write("</tr></thead><tbody></tbody></table>")
    f.write("""<script>
const COVERAGE_DATA = """)
    f.write(json.dumps(js_rows))
    f.write(""";
const table = document.getElementById('coverage-detail');
const headers = table.querySelectorAll('th.sortable');
const tbody = table.querySelector('tbody');
const crumb = document.getElementById('crumb');
let currentPrefix = '';

function pct(hit, found) {
  if (!found) return '';
  return ((100 * hit) / found).toFixed(2);
}

function coverageClass(percent) {
  if (percent >= 80) return 'high';
  if (percent >= 50) return 'med';
  return 'low';
}

function aggregate(items) {
  return items.reduce((acc, r) => {
    acc.LH += r.LH; acc.LF += r.LF;
    acc.FNH += r.FNH; acc.FNF += r.FNF;
    acc.BRH += r.BRH; acc.BRF += r.BRF;
    return acc;
  }, { LH: 0, LF: 0, FNH: 0, FNF: 0, BRH: 0, BRF: 0 });
}

function collectRows(prefix) {
  const folders = new Map();
  const files = [];
  const pref = prefix ? prefix + '/' : '';
  for (const r of COVERAGE_DATA) {
    if (!r.file.startsWith(pref)) continue;
    const tail = r.file.slice(pref.length);
    if (!tail) continue;
    const slash = tail.indexOf('/');
    if (slash === -1) {
      files.push({ ...r, label: tail, kind: 'file' });
    } else {
      const folder = tail.slice(0, slash);
      const key = pref + folder;
      if (!folders.has(key)) folders.set(key, []);
      folders.get(key).push(r);
    }
  }
  const folderRows = Array.from(folders.entries()).map(([full, items]) => {
    const a = aggregate(items);
    return {
      kind: 'folder',
      file: full,
      label: full.slice(pref.length),
      href: '',
      ...a
    };
  });
  return [...folderRows.sort((a,b)=>a.label.localeCompare(b.label)), ...files.sort((a,b)=>a.label.localeCompare(b.label))];
}

function renderBreadcrumb(prefix) {
  const parts = prefix ? prefix.split('/') : [];
  let html = `<button data-prefix=''>all files</button>`;
  let path = '';
  for (const p of parts) {
    path = path ? `${path}/${p}` : p;
    html += `<span>/</span><button data-prefix='${path}'>${p}</button>`;
  }
  crumb.innerHTML = html;
  crumb.querySelectorAll('button').forEach((b) => {
    b.addEventListener('click', () => {
      currentPrefix = b.dataset.prefix || '';
      render();
    });
  });
}

function render() {
  const rows = collectRows(currentPrefix);
  renderBreadcrumb(currentPrefix);
  tbody.innerHTML = '';
  for (const r of rows) {
    const tr = document.createElement('tr');
    const lp = pct(r.LH, r.LF);
    const fp = pct(r.FNH, r.FNF);
    const bp = pct(r.BRH, r.BRF);
    const lpNum = Number(lp || 0);
    const lpClass = coverageClass(lpNum);
    const first = document.createElement('td');
    if (r.kind === 'folder') {
      first.innerHTML = `<button class='folder-btn' data-folder='${r.file}'>${r.label}/</button>`;
    } else if (r.href) {
      first.innerHTML = `<a href='${r.href}'>${r.label}</a>`;
    } else {
      first.textContent = r.label;
    }
    tr.appendChild(first);
    tr.classList.add(`row-${lpClass}`);
    tr.innerHTML += `<td class='bar-cell'><div class='bar-wrap'><div class='bar-fill cov-${lpClass}' style='width:${lp || 0}%'></div></div></td>`;
    tr.innerHTML += `<td class='num' data-sort='${r.LH}'>${r.LH}</td><td class='num' data-sort='${r.LF}'>${r.LF}</td><td class='num' data-sort='${lp || 0}'>${lp}%</td>`;
    tr.innerHTML += `<td class='num' data-sort='${r.FNH}'>${r.FNH}</td><td class='num' data-sort='${r.FNF}'>${r.FNF}</td><td class='num' data-sort='${fp || 0}'>${fp}%</td>`;
    tr.innerHTML += `<td class='num' data-sort='${r.BRH}'>${r.BRH}</td><td class='num' data-sort='${r.BRF}'>${r.BRF}</td><td class='num' data-sort='${bp || 0}'>${bp}%</td>`;
    tbody.appendChild(tr);
  }
  tbody.querySelectorAll('.folder-btn').forEach((b) => {
    b.addEventListener('click', () => {
      currentPrefix = b.dataset.folder || '';
      render();
    });
  });
}

headers.forEach((th) => {
  th.addEventListener('click', () => {
    const col = Number(th.dataset.col);
    const type = th.dataset.type || 'text';
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const asc = th.dataset.asc !== 'true';
    headers.forEach(h => delete h.dataset.asc);
    th.dataset.asc = String(asc);
    rows.sort((a, b) => {
      const aCell = a.children[col];
      const bCell = b.children[col];
      const aVal = aCell?.dataset.sort ?? aCell?.textContent ?? '';
      const bVal = bCell?.dataset.sort ?? bCell?.textContent ?? '';
      if (type === 'num') {
        const an = parseFloat(String(aVal).replace('%', '')) || 0;
        const bn = parseFloat(String(bVal).replace('%', '')) || 0;
        return asc ? an - bn : bn - an;
      }
      return asc
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    rows.forEach(r => tbody.appendChild(r));
  });
});
render();
</script>""")
    f.write("</body></html>")

print(f"[coverage] Wrote combined HTML report: {html_path}")
PY

echo "========================================"
echo "[all-tests] All test layers passed + coverage generated"
echo "========================================"
echo "[all-tests] Combined LCOV: $REPO_ROOT/coverage/all/lcov.info"
echo "[all-tests] Coverage CSV:  $REPO_ROOT/coverage/all/summary.csv"
echo "[all-tests] Coverage HTML: $REPO_ROOT/coverage/all/lcov-report/index.html"
