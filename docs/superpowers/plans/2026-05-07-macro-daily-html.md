# Macro Daily HTML Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish a `macro_daily_html` subproject that can gradually replace the current PPT daily report with an HTML/PDF report layer.

**Architecture:** Keep `indicator_explorer` as the data observation layer. Add `macro_daily_html` as the report output layer: it consumes selected indicators and written conclusions, then renders a two-page China/US HTML report that can be printed to PDF. The first version is a static framework replica of the supplied PPT, with later hooks for data binding and an editor.

**Tech Stack:** Static HTML/CSS/vanilla JS, Node built-in test runner, existing local static server.

---

### Task 1: Structure Test

**Files:**
- Create: `projects/macro_daily_html/test/daily_html_structure.test.mjs`

- [x] **Step 1: Write the failing test**

The test reads `projects/macro_daily_html/demo/index.html` and checks that the report has a PDF export button, China/US pages, and the main sections from the PPT framework.

- [x] **Step 2: Run test to verify it fails**

Run:

```bash
/Users/a123/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test projects/macro_daily_html/test/daily_html_structure.test.mjs
```

Expected: FAIL because `demo/index.html` does not exist yet.

### Task 2: Static Report Framework

**Files:**
- Create: `projects/macro_daily_html/demo/index.html`
- Create: `projects/macro_daily_html/README.md`
- Create: `projects/macro_daily_html/workflow.md`
- Create: `projects/macro_daily_html/CHANGELOG.md`

- [ ] **Step 1: Add the HTML demo**

Create a two-page static report demo with:

- China page: policy, economy, liquidity, China assets, update cadence.
- US page: policy, economy, liquidity, US assets, gold, update cadence.
- `导出 PDF` button calling `window.print()`.
- Print CSS with page breaks.

- [ ] **Step 2: Add docs**

Document the relationship:

```text
indicator_explorer = 数据观察台
macro_daily_html = 日报成品层
future editor = 从观察台选指标进入日报
```

### Task 3: Repository Integration

**Files:**
- Modify: `.gitignore`
- Modify: `README.md`
- Create: `changelog/2026-05-07_macro_daily_html.md`

- [ ] **Step 1: Allow demo HTML in git**

Add:

```gitignore
!projects/macro_daily_html/demo/*.html
```

- [ ] **Step 2: Update root README**

Add `projects/macro_daily_html/` under independent subprojects.

- [ ] **Step 3: Add changelog**

Create one project changelog file for this new subproject.

### Task 4: Verification

**Files:**
- All files above

- [ ] **Step 1: Run unit test**

Run:

```bash
/Users/a123/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test projects/macro_daily_html/test/daily_html_structure.test.mjs
```

Expected: PASS.

- [ ] **Step 2: Check inline JS**

Run:

```bash
/Users/a123/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --input-type=module -e 'import { readFileSync } from "node:fs"; import vm from "node:vm"; const html=readFileSync("projects/macro_daily_html/demo/index.html","utf8"); const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m)=>m[1]); scripts.forEach((script,index)=>new vm.Script(script,{filename:`macro-daily-inline-${index}.js`})); console.log(`checked ${scripts.length} inline scripts`);'
```

Expected: `checked 1 inline scripts`.

- [ ] **Step 3: Browser smoke test**

Open:

```text
http://localhost:5175/projects/macro_daily_html/demo/index.html
```

Expected: two report pages render and the export button is visible.
