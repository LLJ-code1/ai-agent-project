import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  buildChinaDailyModel,
  buildSparklineSvg,
  CHINA_DAILY_SLOTS
} from '../src/china_daily_dynamic.mjs';

const testDir = dirname(fileURLToPath(import.meta.url));
const dataFile = resolve(testDir, '../../indicator_explorer/data/china_display_data.json');

test('builds demand, supply, and price model from China display JSON', async () => {
  const data = JSON.parse(await readFile(dataFile, 'utf8'));
  const model = buildChinaDailyModel(data);

  assert.equal(CHINA_DAILY_SLOTS.length, 31);
  assert.equal(model.get('demand.retail_sales').label, '社零');
  assert.equal(model.get('demand.retail_sales').current, '1.7%');
  assert.equal(model.get('demand.retail_sales').delta, '-1.1pct');
  assert.ok(model.get('demand.retail_sales').series.length >= 10);

  assert.equal(model.get('supply.manufacturing_pmi').current, '50.3');
  assert.ok(model.get('supply.industrial_production').series.length >= 10);
  assert.equal(model.get('price.ppi').current, '0.5%');
  assert.equal(model.get('price.raw_material_purchase_price').current, '63.7');
});

test('builds available liquidity and asset slots from China display JSON', async () => {
  const data = JSON.parse(await readFile(dataFile, 'utf8'));
  const model = buildChinaDailyModel(data);

  assert.equal(model.get('liquidity.central_bank.reverse_repo_7d').current, '1.4%');
  assert.ok(model.get('liquidity.interbank.dr007').series.length >= 10);
  assert.equal(model.get('liquidity.real_economy.m1').current, '5.1%');

  assert.equal(model.get('assets.a_share.shanghai_composite').current, '4112.2');
  assert.equal(model.get('assets.china_bond.ten_year_treasury').current, '1.75%');
  assert.equal(model.get('assets.hong_kong.hang_seng').current, '25776.5');
});

test('marks missing JSON indicators so the PPT fallback can remain visible', async () => {
  const data = JSON.parse(await readFile(dataFile, 'utf8'));
  const model = buildChinaDailyModel(data);

  assert.equal(model.get('supply.non_manufacturing_pmi').found, false);
  assert.equal(model.get('supply.non_manufacturing_pmi').label, '非制造业PMI');
});

test('renders a compact SVG sparkline from historical points', () => {
  const svg = buildSparklineSvg([
    { date: '2026-01-31', value: 1 },
    { date: '2026-02-28', value: 2 },
    { date: '2026-03-31', value: 1.5 }
  ]);

  assert.match(svg, /^<svg /);
  assert.match(svg, /polyline/);
  assert.match(svg, /circle/);
  assert.match(svg, /viewBox="0 0 72 24"/);
});
