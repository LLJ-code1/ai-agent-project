# Indicator Explorer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an isolated indicator explorer subproject that tests selectable China-side indicators without changing the main Excel formulas or export script.

**Architecture:** Keep the copied Excel as a test snapshot in the subproject. Generate a China display JSON from the existing tree framework output, then render it through a static HTML demo with region, section, group, and indicator controls.

**Tech Stack:** Node.js built-in test runner, plain JavaScript data builder, static HTML/CSS/JS.

---

### Task 1: Subproject Data Boundary

**Files:**
- Create: `projects/indicator_explorer/test/normalize_china_data.test.mjs`
- Create: `projects/indicator_explorer/src/build_china_display_data.mjs`
- Generate: `projects/indicator_explorer/data/china_display_data.json`
- Copy: `projects/indicator_explorer/data/macro_final_v11.2_2_safe_formula_fix_2026-05-07.xlsx`

- [ ] **Step 1: Write the failing test**

Create a Node test that imports `normalizeChinaDisplayData` and verifies the China display payload has `economy`, `liquidity`, and `assets` sections, with `产业面` kept as optional rather than default.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test projects/indicator_explorer/test/normalize_china_data.test.mjs`

Expected: FAIL because `projects/indicator_explorer/src/build_china_display_data.mjs` does not exist yet.

- [ ] **Step 3: Implement the data builder**

Create `normalizeChinaDisplayData(source, meta)` and a CLI path that reads `outputs/tree_macro_strategy_final_v2/tree_final_data.json` and writes `projects/indicator_explorer/data/china_display_data.json`.

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test projects/indicator_explorer/test/normalize_china_data.test.mjs`

Expected: PASS.

### Task 2: Demo HTML

**Files:**
- Create: `projects/indicator_explorer/demo/index.html`

- [ ] **Step 1: Build the static interface**

Create a plain HTML page that fetches `../data/china_display_data.json`, defaults to 中国 / 经济基本面 / 供给, and lets the user switch to 需求、价格、产业面、流动性、资产.

- [ ] **Step 2: Verify the page can load local JSON**

Run a static server from `projects/indicator_explorer` and request the demo page.

Expected: HTTP 200 for `demo/index.html` and `data/china_display_data.json`.

### Task 3: Documentation

**Files:**
- Create: `projects/indicator_explorer/README.md`
- Create: `projects/indicator_explorer/workflow.md`
- Create: `projects/indicator_explorer/CHANGELOG.md`
- Modify: `README.md`
- Create: `changelog/2026-05-07_indicator_explorer.md`

- [ ] **Step 1: Explain the JSON boundary**

Document that the JSON is a display data package, not the full raw workbook dump. First version includes all China-side display sections from the tree framework: economy, liquidity, and assets.

- [ ] **Step 2: Link the subproject from the root README**

Add `projects/indicator_explorer/` to the repository structure and note that it is a display-layer prototype.

- [ ] **Step 3: Record the change**

Add the root changelog entry and the subproject changelog.
