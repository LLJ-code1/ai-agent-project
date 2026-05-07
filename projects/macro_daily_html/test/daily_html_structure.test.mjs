import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const testDir = dirname(fileURLToPath(import.meta.url));
const demoFile = resolve(testDir, '../demo/index.html');

test('daily HTML demo mirrors the China PPT layout and keeps trend charts', async () => {
  const html = await readFile(demoFile, 'utf8');

  assert.match(html, /id="exportPdf"/);
  assert.match(html, /window\.print\(\)/);
  assert.match(html, /data-region="china"/);
  assert.match(html, /国内宏观至资产的传导框架/);
  assert.doesNotMatch(html, /data-region="us"/);
  assert.doesNotMatch(html, /美国宏观至资产的传导框架/);
  assert.match(html, /class="ppt-page"/);
  assert.match(html, /assets\/china\/image15\.png/);
  assert.match(html, /type="module"/);
  assert.match(html, /\.\.\/src\/china_daily_dynamic\.mjs/);
  assert.match(html, /\.\.\/\.\.\/indicator_explorer\/data\/china_display_data\.json/);
  assert.match(html, /data-slot="demand\.retail_sales"/);
  assert.match(html, /data-slot-spark="demand\.retail_sales"/);
  assert.match(html, /data-slot-current="price\.ppi"/);
  assert.match(html, /data-slot="liquidity\.central_bank\.reverse_repo_7d"/);
  assert.match(html, /data-slot-spark="liquidity\.interbank\.dr007"/);
  assert.match(html, /data-slot-current="assets\.a_share\.shanghai_composite"/);
  assert.match(html, /data-slot-current="assets\.china_bond\.ten_year_treasury"/);
  assert.match(html, /data-slot-current="assets\.hong_kong\.hang_seng"/);
  await access(resolve(testDir, '../demo/assets/china/image15.png'));

  const trendChartCount = (html.match(/class="sparkline"/g) || []).length;
  assert.ok(trendChartCount >= 16, `expected at least 16 trend charts, got ${trendChartCount}`);

  const requiredSections = [
    '货币政策',
    '财政政策',
    '流动性：',
    '央行流动性',
    '银行间',
    '实体流动性',
    '需求',
    '供给',
    '价格',
    '产业面',
    'A股策略',
    '中债策略',
    '港股策略',
    '数据截至'
  ];

  requiredSections.forEach((section) => {
    assert.match(html, new RegExp(section), `missing section: ${section}`);
  });
});
