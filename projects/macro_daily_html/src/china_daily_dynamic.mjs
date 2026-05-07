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
  { slot: 'price.raw_material_purchase_price', label: '原材料购价', candidates: ['原材料购价', 'PMI主要原材料购进价格'] },
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
  { slot: 'assets.a_share.turnover', label: '成交额', candidates: ['A股日度成交额'] },
  { slot: 'assets.a_share.margin_balance', label: '两融余额', candidates: ['两融余额', '融资融券余额'] },
  { slot: 'assets.china_bond.one_year_treasury', label: '1Y国债', candidates: ['1Y国债', '1年国债收益率'] },
  { slot: 'assets.china_bond.ten_year_treasury', label: '10Y国债', candidates: ['10Y国债', '10年国债收益率'] },
  { slot: 'assets.china_bond.term_spread', label: '期限利差', candidates: ['10Y-1Y', '期限利差：（国债）10Y-1Y'] },
  { slot: 'assets.china_bond.credit_spread', label: '信用利差', candidates: ['信用利差', '信用利差：10Y（企业债-国开债）'] },
  { slot: 'assets.hong_kong.hang_seng', label: '恒生指数', candidates: ['恒生指数'] },
  { slot: 'assets.hong_kong.hang_seng_tech', label: '恒生科技', candidates: ['恒生科技', '恒生科技指数'] },
  { slot: 'assets.hong_kong.southbound_flow', label: '南向资金', candidates: ['南向资金', '南向资金净流入'] }
];

function collectItems(data) {
  const sections = data?.sections ?? {};
  const sectionGroups = Object.values(sections).flatMap((section) => section.groups ?? []);
  const assetGroups = (sections.assets?.assets ?? []).flatMap((asset) => asset.groups ?? []);
  return [...sectionGroups, ...assetGroups].flatMap((group) => group.items ?? []);
}

function indexItems(items) {
  const indexed = new Map();
  items.forEach((item) => {
    [item.label, item.name].filter(Boolean).forEach((key) => indexed.set(key, item));
  });
  return indexed;
}

function findItem(indexed, candidates) {
  return candidates.map((candidate) => indexed.get(candidate)).find(Boolean);
}

function fallbackSlot(slotConfig) {
  return {
    slot: slotConfig.slot,
    label: slotConfig.label,
    current: '',
    delta: '',
    sign: 'flat',
    series: [],
    found: false
  };
}

export function buildChinaDailyModel(data, slots = CHINA_DAILY_SLOTS) {
  const indexed = indexItems(collectItems(data));
  return new Map(slots.map((slotConfig) => {
    const item = findItem(indexed, slotConfig.candidates);
    if (!item) return [slotConfig.slot, fallbackSlot(slotConfig)];
    return [slotConfig.slot, {
      slot: slotConfig.slot,
      label: slotConfig.label,
      current: item.current ?? '',
      delta: item.delta ?? '',
      sign: item.sign ?? 'flat',
      series: Array.isArray(item.series) ? item.series : [],
      found: true
    }];
  }));
}

function numericSeries(series) {
  return series
    .map((point) => ({ date: point.date, value: Number(point.value) }))
    .filter((point) => point.date && Number.isFinite(point.value));
}

function pointsToPolyline(points, width, height, padding) {
  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;
  return points.map((point, index) => {
    const x = padding + step * index;
    const y = height - padding - ((point.value - min) / span) * (height - padding * 2);
    return `${Number(x.toFixed(2))},${Number(y.toFixed(2))}`;
  });
}

function strokeForSign(sign) {
  if (sign === 'pos') return '#c0504d';
  if (sign === 'neg') return '#00a070';
  return '#c0504d';
}

export function buildSparklineSvg(series, options = {}) {
  const width = options.width ?? 72;
  const height = options.height ?? 24;
  const padding = options.padding ?? 3;
  const points = numericSeries(series).slice(-16);
  if (points.length < 2) return '';

  const polyline = pointsToPolyline(points, width, height, padding);
  const latest = polyline.at(-1).split(',').map(Number);
  const stroke = strokeForSign(options.sign ?? 'flat');

  return `<svg class="sparkline" viewBox="0 0 ${width} ${height}" role="img" aria-label="趋势图" preserveAspectRatio="none"><polyline points="${polyline.join(' ')}" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${latest[0]}" cy="${latest[1]}" r="2.2" fill="${stroke}"/></svg>`;
}

function signClass(sign) {
  if (sign === 'pos') return 'positive';
  if (sign === 'neg') return 'negative';
  return 'neutral';
}

function updateDeltaElement(element, item) {
  element.textContent = item.delta;
  element.classList.remove('positive', 'negative', 'neutral');
  element.classList.add(signClass(item.sign));
}

export function applyChinaDailyModel(root, model) {
  model.forEach((item, slot) => {
    if (!item.found) return;

    root.querySelectorAll(`[data-slot="${slot}"]`).forEach((row) => {
      row.dataset.dynamic = 'true';
    });
    root.querySelectorAll(`[data-slot-current="${slot}"]`).forEach((element) => {
      element.textContent = item.current;
    });
    root.querySelectorAll(`[data-slot-delta="${slot}"]`).forEach((element) => {
      updateDeltaElement(element, item);
    });
    root.querySelectorAll(`[data-slot-spark="${slot}"]`).forEach((element) => {
      const svg = buildSparklineSvg(item.series, { sign: item.sign });
      if (svg) element.innerHTML = svg;
    });
  });
}
