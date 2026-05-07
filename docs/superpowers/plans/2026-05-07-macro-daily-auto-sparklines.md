# Macro Daily Auto Sparklines Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the China daily HTML page so every currently available indicator series renders as an automated compact SVG sparkline while keeping the PPT replica layout unchanged.

**Architecture:** Keep `projects/indicator_explorer/data/china_display_data.json` as the only dynamic data source. Extend the fixed slot map in `projects/macro_daily_html/src/china_daily_dynamic.mjs`, then add `data-slot`, `data-slot-current`, `data-slot-delta`, and `data-slot-spark` attributes to matching rows in `projects/macro_daily_html/demo/index.html`. Missing indicators keep the original PPT-extracted image and static values.

**Tech Stack:** Static HTML, browser ES modules, SVG sparklines, Node.js built-in test runner.

---

### Task 1: Add Tests for Expanded A-Version Sparkline Coverage

**Files:**
- Modify: `projects/macro_daily_html/test/china_daily_dynamic.test.mjs`
- Modify: `projects/macro_daily_html/test/daily_html_structure.test.mjs`

- [ ] **Step 1: Add assertions for new JSON-backed slots**

Add test assertions that `buildChinaDailyModel` can find at least these new slots:

```js
assert.equal(model.get('liquidity.central_bank.reverse_repo_7d').current, '1.4%');
assert.ok(model.get('liquidity.interbank.dr007').series.length >= 10);
assert.equal(model.get('liquidity.real_economy.m1').current, '5.1%');
assert.equal(model.get('assets.a_share.shanghai_composite').current, '4112.2');
assert.equal(model.get('assets.china_bond.ten_year_treasury').current, '1.75%');
assert.equal(model.get('assets.hong_kong.hang_seng').current, '25776.5');
```

- [ ] **Step 2: Add HTML structure assertions**

Add checks for representative dynamic rows:

```js
assert.match(html, /data-slot="liquidity\.central_bank\.reverse_repo_7d"/);
assert.match(html, /data-slot-spark="liquidity\.interbank\.dr007"/);
assert.match(html, /data-slot-current="assets\.a_share\.shanghai_composite"/);
assert.match(html, /data-slot-current="assets\.china_bond\.ten_year_treasury"/);
assert.match(html, /data-slot-current="assets\.hong_kong\.hang_seng"/);
```

- [ ] **Step 3: Run tests to verify they fail before implementation**

Run:

```bash
node --test projects/macro_daily_html/test/china_daily_dynamic.test.mjs
node --test projects/macro_daily_html/test/daily_html_structure.test.mjs
```

Expected: FAIL because the new slots are not mapped in the module and not present in the HTML.

### Task 2: Extend Fixed Slot Mapping

**Files:**
- Modify: `projects/macro_daily_html/src/china_daily_dynamic.mjs`

- [ ] **Step 1: Add JSON-backed slots only**

Add slots for indicators already available in `china_display_data.json`, including:

```js
{ slot: 'liquidity.central_bank.reverse_repo_7d', label: '7天逆回购', candidates: ['7天逆回购', '7天逆回购利率'] },
{ slot: 'liquidity.central_bank.reserve_ratio', label: '法定存准率', candidates: ['存准率', '法定存款准备金率-大型国有银行'] },
{ slot: 'liquidity.interbank.dr001', label: 'DR001', candidates: ['DR001'] },
{ slot: 'liquidity.interbank.dr007', label: 'DR007', candidates: ['DR007'] },
{ slot: 'liquidity.interbank.r001', label: 'R001', candidates: ['R001'] },
{ slot: 'liquidity.interbank.r007', label: 'R007', candidates: ['R007'] },
{ slot: 'liquidity.real_economy.social_financing_stock', label: '社融存量', candidates: ['社融存量', '社会融资规模存量'] },
{ slot: 'liquidity.real_economy.m1', label: 'M1', candidates: ['M1'] },
{ slot: 'liquidity.real_economy.m2', label: 'M2', candidates: ['M2'] },
{ slot: 'assets.a_share.shanghai_composite', label: '上证指数', candidates: ['上证指数'] },
{ slot: 'assets.a_share.csi300', label: '沪深300', candidates: ['沪深300'] },
{ slot: 'assets.a_share.northbound_turnover', label: '北向成交', candidates: ['北向成交', '北向资金成交额'] },
{ slot: 'assets.a_share.turnover', label: '成交额', candidates: ['成交额', 'A股日度成交额'] },
{ slot: 'assets.a_share.margin_balance', label: '两融余额', candidates: ['两融余额', '融资融券余额'] },
{ slot: 'assets.china_bond.one_year_treasury', label: '1Y国债', candidates: ['1Y国债', '1年国债收益率'] },
{ slot: 'assets.china_bond.ten_year_treasury', label: '10Y国债', candidates: ['10Y国债', '10年国债收益率'] },
{ slot: 'assets.china_bond.term_spread', label: '期限利差', candidates: ['10Y-1Y', '期限利差：（国债）10Y-1Y'] },
{ slot: 'assets.china_bond.credit_spread', label: '信用利差', candidates: ['信用利差', '信用利差：10Y（企业债-国开债）'] },
{ slot: 'assets.hong_kong.hang_seng', label: '恒生指数', candidates: ['恒生指数'] },
{ slot: 'assets.hong_kong.hang_seng_tech', label: '恒生科技', candidates: ['恒生科技', '恒生科技指数'] },
{ slot: 'assets.hong_kong.southbound_flow', label: '南向资金', candidates: ['南向资金', '南向资金净流入'] }
```

Do not add rows whose source is missing or not the same口径 in the JSON, such as `公开市场操作净投放`, `中央银行贷款-总投放`, `新增人民币贷款`, `深成指数`, `创业板指`, `交易总金额`, `换手率`.

- [ ] **Step 2: Run model test**

Run:

```bash
node --test projects/macro_daily_html/test/china_daily_dynamic.test.mjs
```

Expected: PASS for the model test after mapping is complete.

### Task 3: Add HTML Data Slots Without Layout Changes

**Files:**
- Modify: `projects/macro_daily_html/demo/index.html`

- [ ] **Step 1: Add attributes to matching rows**

For each JSON-backed row, add:

```html
data-slot="..."
data-slot-spark="..."
data-slot-current="..."
data-slot-delta="..."
```

Keep all table structure, text, image `src`, and static values as fallback.

- [ ] **Step 2: Run structure test**

Run:

```bash
node --test projects/macro_daily_html/test/daily_html_structure.test.mjs
```

Expected: PASS after representative slots are present.

### Task 4: Update Project Docs and Changelog

**Files:**
- Modify: `projects/macro_daily_html/README.md`
- Modify: `projects/macro_daily_html/workflow.md`
- Modify: `projects/macro_daily_html/CHANGELOG.md`
- Create: `changelog/2026-05-07_macro_daily_auto_sparklines.md`

- [ ] **Step 1: Document the A-version chart rule**

Record that the accepted direction is compact SVG sparklines only, not full axis charts, and that static PPT images remain fallback.

- [ ] **Step 2: Add changelog**

Create a root changelog file using the project template and list all touched files and residual gaps.

### Task 5: Verify in Commands and Browser

**Files:**
- No file changes.

- [ ] **Step 1: Run command verification**

Run:

```bash
node --test projects/macro_daily_html/test/china_daily_dynamic.test.mjs
node --test projects/macro_daily_html/test/daily_html_structure.test.mjs
node -e "const fs=require('fs'); const html=fs.readFileSync('projects/macro_daily_html/demo/index.html','utf8'); const match=[...html.matchAll(/<script type=\"module\">([\\s\\S]*?)<\\/script>/g)][0]; new Function(match[1].replace(/import[\\s\\S]*?;\\n/,'')); console.log('module syntax ok');"
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 2: Run browser verification**

Open:

```text
http://localhost:5175/projects/macro_daily_html/demo/index.html
```

Confirm:

- More than 20 rows have `data-dynamic="true"`.
- SVG sparkline count increases beyond the first 9 rows.
- No browser console warnings or errors.
- The page still visually resembles the fixed PPT layout.
