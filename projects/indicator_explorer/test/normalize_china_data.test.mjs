import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeChinaDisplayData } from '../src/build_china_display_data.mjs';

const fakeTreeData = {
  slides: [
    {
      title: '国内宏观至资产的传导框架',
      subtitle: 'china slide',
      economyTitle: '经济面:',
      liquidityTitle: '流动性:',
      economy: [
        {
          title: '供给',
          subtitle: '生产端是否先修复',
          items: [{ label: '制造业PMI', name: '制造业PMI', current: '50.4', delta: '+1.4点', sign: 'pos', points: 3 }]
        },
        {
          title: '产业面',
          subtitle: '利润与库存确认',
          items: [{ label: '工业增加值', name: '工业增加值', current: '5.7%', delta: '-0.6pct', sign: 'neg', points: 3 }]
        }
      ],
      liquidity: [
        {
          title: '央行流动性',
          subtitle: '',
          items: [{ label: '7天逆回购', name: '7天逆回购利率', current: '1.40%', delta: '0.00bp', sign: 'flat', points: 3 }]
        }
      ],
      assets: [
        {
          asset: 'A股',
          observe: [
            {
              title: '资金面',
              subtitle: '',
              items: [{ label: '成交额', name: 'A股日度成交额', current: '2.66万亿', delta: '-1657亿', sign: 'neg', points: 60 }]
            }
          ],
          strategyTitle: 'A股策略',
          conclusion: '维持标配',
          action: '低配客户可逢跌定投'
        }
      ]
    },
    {
      title: '美国宏观至资产的传导框架',
      economy: [],
      liquidity: [],
      assets: []
    }
  ],
  source: { source_file: 'tree_final_data.json' }
};

test('normalizes the China display payload and keeps industry optional', () => {
  const result = normalizeChinaDisplayData(fakeTreeData, {
    generatedAt: '2026-05-07',
    sourceFile: 'outputs/tree_macro_strategy_final_v2/tree_final_data.json',
    workbookFile: 'data/macro_final_v11.2_2_safe_formula_fix_2026-05-07.xlsx'
  });

  assert.equal(result.meta.generatedAt, '2026-05-07');
  assert.equal(result.region.id, 'china');
  assert.equal(result.region.label, '中国');
  assert.deepEqual(result.navigation.sections.map((section) => section.id), ['economy', 'liquidity', 'assets']);

  assert.equal(result.sections.economy.groups.length, 2);
  assert.equal(result.sections.economy.groups[0].id, 'supply');
  assert.equal(result.sections.economy.groups[0].display.defaultVisible, true);
  assert.equal(result.sections.economy.groups[1].id, 'industry');
  assert.equal(result.sections.economy.groups[1].display.defaultVisible, false);

  assert.equal(result.sections.liquidity.groups[0].id, 'central_bank_liquidity');
  assert.equal(result.sections.assets.assets[0].id, 'a_share');
  assert.equal(result.sections.assets.assets[0].groups[0].items[0].label, '成交额');
});
