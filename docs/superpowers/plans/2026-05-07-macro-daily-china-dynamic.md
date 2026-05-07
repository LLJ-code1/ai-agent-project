# Macro Daily China Dynamic Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the China PPT replica page read real China-side JSON data for the demand, supply, and price indicator blocks while preserving the fixed PPT layout and static-image fallback.

**Architecture:** Keep `projects/indicator_explorer/data/china_display_data.json` as the first dynamic data source. Add a small `macro_daily_html` browser module that maps fixed PPT slots to JSON indicators, updates current values/deltas, and replaces the PPT-extracted trend image with an SVG sparkline generated from `series`. Keep the original PNG trend images in the HTML as fallback if JSON loading fails.

**Tech Stack:** Static HTML, ES modules, Node.js built-in test runner, existing `indicator_explorer` JSON data.

---

### Task 1: Branch and Handoff Notes

**Files:**
- Create: `projects/macro_daily_html/BRANCH_HANDOFF.md`
- Modify: `projects/macro_daily_html/CHANGELOG.md`
- Create: `changelog/2026-05-07_macro_daily_china_dynamic.md`

- [ ] **Step 1: Create branch**

Run:

```bash
git switch -c codex/macro-daily-china-dynamic
```

Expected: branch is `codex/macro-daily-china-dynamic`.

- [ ] **Step 2: Add handoff note**

Create `projects/macro_daily_html/BRANCH_HANDOFF.md` explaining:

```markdown
# 中国日报动态化分支交接

分支:`codex/macro-daily-china-dynamic`
目标:只把中国 PPT 复刻页的需求/供给/价格三块接到 `indicator_explorer` 中国 JSON。
边界:不改 PPT 版式,不做完整日报编辑器,不处理美国页。
当前数据源:`projects/indicator_explorer/data/china_display_data.json`
兜底策略:JSON 加载失败或指标缺失时保留 PPT 抽取的静态趋势图和原数值。
```

### Task 2: Dynamic Data Module

**Files:**
- Create: `projects/macro_daily_html/src/china_daily_dynamic.mjs`
- Create: `projects/macro_daily_html/test/china_daily_dynamic.test.mjs`

- [ ] **Step 1: Write failing tests**

Create tests that import `buildChinaDailyModel`, `buildSparklineSvg`, and `CHINA_DAILY_SLOTS`, then assert:

```js
assert.equal(model.get('demand.retail_sales').current, '1.7%');
assert.ok(model.get('demand.retail_sales').series.length >= 10);
assert.match(buildSparklineSvg([{ date: '2026-01-01', value: 1 }, { date: '2026-02-01', value: 2 }]), /<svg/);
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
node --test projects/macro_daily_html/test/china_daily_dynamic.test.mjs
```

Expected: FAIL because module does not exist.

- [ ] **Step 3: Implement the module**

Create a focused module with:

```js
export const CHINA_DAILY_SLOTS = [
  { slot: 'demand.retail_sales', label: '社零', candidates: ['社零', '社会消费品零售总额'] },
  { slot: 'demand.fixed_asset_investment', label: '固定投资', candidates: ['固定投资', '固定资产投资'] },
  { slot: 'demand.property_sales', label: '房屋销售', candidates: ['房屋销售', '商品房销售面积:累计同比'] },
  { slot: 'demand.export', label: '出口', candidates: ['出口', '出口：美元计价'] },
  { slot: 'supply.manufacturing_pmi', label: '制造业PMI', candidates: ['制造业PMI'] },
  { slot: 'supply.non_manufacturing_pmi', label: '非制造业PMI', candidates: ['非制造业PMI'] },
  { slot: 'supply.industrial_production', label: '工业增加值', candidates: ['工业增加值'] },
  { slot: 'price.ppi', label: 'PPI', candidates: ['PPI'] },
  { slot: 'price.cpi', label: 'CPI', candidates: ['CPI'] },
  { slot: 'price.raw_material_purchase_price', label: '原材料购价', candidates: ['原材料购价', 'PMI主要原材料购进价格'] }
];
```

### Task 3: HTML Binding

**Files:**
- Modify: `projects/macro_daily_html/demo/index.html`
- Modify: `projects/macro_daily_html/test/daily_html_structure.test.mjs`

- [ ] **Step 1: Write failing structure assertions**

Assert the HTML has:

```js
data-slot="demand.retail_sales"
data-slot-spark="demand.retail_sales"
type="module"
../src/china_daily_dynamic.mjs
../../indicator_explorer/data/china_display_data.json
```

- [ ] **Step 2: Add data attributes and module script**

For each demand/supply/price row, add `data-slot`, `data-slot-current`, `data-slot-delta`, and `data-slot-spark`. Add a module script that fetches the JSON, calls `buildChinaDailyModel`, and applies the model.

### Task 4: Docs and Verification

**Files:**
- Modify: `projects/macro_daily_html/workflow.md`
- Modify: `projects/macro_daily_html/README.md`
- Modify: `projects/macro_daily_html/CHANGELOG.md`
- Modify: `projects/macro_daily_html/BRANCH_HANDOFF.md`

- [ ] **Step 1: Document the dynamic data path**

Record:

```text
indicator_explorer/data/china_display_data.json -> fixed PPT slot map -> SVG sparkline + value/delta update
```

- [ ] **Step 2: Verify**

Run:

```bash
node --test projects/macro_daily_html/test/china_daily_dynamic.test.mjs
node --test projects/macro_daily_html/test/daily_html_structure.test.mjs
node -e "const fs=require('fs'); const html=fs.readFileSync('projects/macro_daily_html/demo/index.html','utf8'); new Function([...html.matchAll(/<script type=\"module\">([\\s\\S]*?)<\\/script>/g)][0][1].replace(/import[\\s\\S]*?;\\n/,''));"
curl -I http://localhost:5175/projects/macro_daily_html/demo/index.html
git diff --check
```

Expected: tests pass, HTTP 200, no whitespace errors.
