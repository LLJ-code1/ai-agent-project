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

function collectItems(data) {
  const groups = data?.sections?.economy?.groups ?? [];
  return groups.flatMap((group) => group.items ?? []);
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
