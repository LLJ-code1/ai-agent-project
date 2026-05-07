import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const testDir = dirname(fileURLToPath(import.meta.url));
const demoFile = resolve(testDir, '../demo/index.html');

test('daily HTML demo mirrors the two-page PPT report framework', async () => {
  const html = await readFile(demoFile, 'utf8');

  assert.match(html, /id="exportPdf"/);
  assert.match(html, /window\.print\(\)/);
  assert.match(html, /data-region="china"/);
  assert.match(html, /data-region="us"/);
  assert.match(html, /国内宏观至资产的传导框架/);
  assert.match(html, /美国宏观至资产的传导框架/);

  const requiredSections = [
    '货币政策',
    '财政政策',
    '经济面',
    '流动性',
    '资产配置',
    'A股策略',
    '中债策略',
    '港股策略',
    '美股策略',
    '美债策略',
    '黄金策略',
    '数据更新'
  ];

  requiredSections.forEach((section) => {
    assert.match(html, new RegExp(section), `missing section: ${section}`);
  });
});
