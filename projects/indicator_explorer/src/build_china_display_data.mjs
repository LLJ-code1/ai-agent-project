import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const GROUP_IDS = new Map([
  ['供给', 'supply'],
  ['需求', 'demand'],
  ['价格', 'price'],
  ['产业面', 'industry'],
  ['央行流动性', 'central_bank_liquidity'],
  ['银行间流动性', 'interbank_liquidity'],
  ['实体流动性', 'real_economy_liquidity'],
  ['资金面', 'fund_flow'],
  ['情绪面', 'sentiment'],
  ['估值面', 'valuation'],
  ['利率面', 'rate'],
  ['汇率面', 'fx']
]);

const ASSET_IDS = new Map([
  ['A股', 'a_share'],
  ['中债', 'china_bond'],
  ['港股', 'hong_kong']
]);

const MACRO_DATA_ROWS = new Map([
  ['制造业PMI', 3],
  ['生产PMI', 5],
  ['新订单PMI', 6],
  ['新出口订单', 7],
  ['社会消费品零售总额', 9],
  ['固定资产投资', 15],
  ['工业增加值', 20],
  ['出口：美元计价', 21],
  ['PPI', 23],
  ['CPI', 25],
  ['法定存款准备金率-大型国有银行', 27],
  ['中央银行贷款-中期借贷便利（MLF）净投放', 29],
  ['中央银行贷款-其他政策工具净投放', 31],
  ['社会融资规模存量', 33],
  ['企业债券融资', 37],
  ['M1', 39],
  ['M2', 41],
  ['1年国债收益率', 43],
  ['10年国债收益率', 52],
  ['中债国开债到期收益率:10年', 54],
  ['中债企业债到期收益率(AAA):10年', 55],
  ['DR001', 81],
  ['DR007', 82],
  ['R001', 83],
  ['R007', 84],
  ['7天逆回购利率', 85],
  ['新开户数（个人）', 86],
  ['商品房销售面积:累计同比', 105],
  ['1Y同业存单到期收益率(AAA)', 106],
  ['PMI主要原材料购进价格', 107],
  ['CFETS人民币汇率指数', 109]
]);

const INDEX_SHEET_SERIES = [
  { name: '恒生科技指数', row: 3, headerRow: 1 },
  { name: '沪深300', row: 6, headerRow: 1 },
  { name: '上证指数', row: 7, headerRow: 1 },
  { name: '恒生指数', row: 8, headerRow: 1 },
  { name: '创业板指一致预测净利润同比', row: 13, headerRow: 10 },
  { name: '沪深300一致预测净利润同比', row: 15, headerRow: 10 },
  { name: '沪深300预测PE', row: 24, headerRow: 19 }
];

function toId(label, fallbackPrefix = 'group') {
  if (GROUP_IDS.has(label)) return GROUP_IDS.get(label);
  if (ASSET_IDS.has(label)) return ASSET_IDS.get(label);
  return `${fallbackPrefix}_${String(label).replace(/\s+/g, '_')}`;
}

function toWebPath(filePath) {
  if (!filePath) return '';
  if (filePath.includes('/outputs/tree_macro_strategy_final_v2/sparklines/')) {
    return `../data/sparklines/${basename(filePath)}`;
  }
  const outputIndex = filePath.indexOf('/outputs/');
  if (outputIndex >= 0) return filePath.slice(outputIndex);
  if (filePath.startsWith('outputs/')) return `/${filePath}`;
  return filePath;
}

function columnLetters(cellRef) {
  return String(cellRef).match(/[A-Z]+/)?.[0] ?? '';
}

function excelSerialToDate(serial) {
  const timestamp = Date.UTC(1899, 11, 30) + Number(serial) * 86400 * 1000;
  return new Date(timestamp).toISOString().slice(0, 10);
}

function parseDateValue(value) {
  if (value === undefined || value === '') return '';
  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const numericValue = Number(text);
  if (Number.isFinite(numericValue) && numericValue >= 30000) {
    return excelSerialToDate(numericValue);
  }
  return '';
}

function getRowXml(sheetXml, rowNumber) {
  const match = sheetXml.match(new RegExp(`<row[^>]* r="${rowNumber}"[\\s\\S]*?<\\/row>`));
  return match?.[0] ?? '';
}

function extractNumericCells(rowXml) {
  const cells = new Map();
  const cellPattern = /<c\b[^>]*\br="([A-Z]+[0-9]+)"[^>]*>([\s\S]*?)<\/c>/g;
  for (const match of rowXml.matchAll(cellPattern)) {
    const value = match[2].match(/<v>([^<]+)<\/v>/)?.[1];
    if (value === undefined || value === '') continue;
    const numericValue = Number(value);
    if (Number.isFinite(numericValue)) {
      cells.set(columnLetters(match[1]), numericValue);
    }
  }
  return cells;
}

function extractCellTexts(rowXml) {
  const cells = new Map();
  const cellPattern = /<c\b[^>]*\br="([A-Z]+[0-9]+)"[^>]*>([\s\S]*?)<\/c>/g;
  for (const match of rowXml.matchAll(cellPattern)) {
    const inlineText = match[2].match(/<t[^>]*>([\s\S]*?)<\/t>/)?.[1];
    const value = inlineText ?? match[2].match(/<v>([^<]*)<\/v>/)?.[1] ?? '';
    cells.set(columnLetters(match[1]), value);
  }
  return cells;
}

function readSheetXml(workbookPath, sheetNumber, maxBuffer = 30 * 1024 * 1024) {
  return execFileSync('unzip', ['-p', workbookPath, `xl/worksheets/sheet${sheetNumber}.xml`], {
    encoding: 'utf8',
    maxBuffer
  });
}

function normalizeSeries(series) {
  return series
    .filter((point) => point.date && Number.isFinite(point.value))
    .sort((left, right) => left.date.localeCompare(right.date));
}

function extractHorizontalSeries(sheetXml, rowNumber, headerRow = 1, transform = (value) => value) {
  const dateCells = extractNumericCells(getRowXml(sheetXml, headerRow));
  const columnDates = new Map(
    [...dateCells.entries()]
      .filter(([, serial]) => serial >= 30000)
      .map(([column, serial]) => [column, excelSerialToDate(serial)])
  );
  const valueCells = extractNumericCells(getRowXml(sheetXml, rowNumber));
  return normalizeSeries(
    [...valueCells.entries()]
      .filter(([column]) => columnDates.has(column))
      .map(([column, value]) => ({ date: columnDates.get(column), value: Number(transform(value).toFixed(4)) }))
  );
}

function extractRows(sheetXml) {
  return [...sheetXml.matchAll(/<row\b[^>]*\br="(\d+)"[\s\S]*?<\/row>/g)].map((match) => ({
    number: Number(match[1]),
    cells: extractCellTexts(match[0])
  }));
}

function cellNumber(cells, column) {
  const value = Number(cells.get(column));
  return Number.isFinite(value) ? value : undefined;
}

function cellDate(cells, column) {
  return parseDateValue(cells.get(column));
}

function extractVerticalSeries(sheetXml, { dateColumn, valueColumn, startRow = 9, transform = (value) => value }) {
  return normalizeSeries(
    extractRows(sheetXml)
      .filter((row) => row.number >= startRow)
      .map((row) => {
        const date = cellDate(row.cells, dateColumn);
        const value = cellNumber(row.cells, valueColumn);
        if (!date || value === undefined) return null;
        return { date, value: Number(transform(value).toFixed(4)) };
      })
      .filter(Boolean)
  );
}

function sumSeriesByDate(...seriesList) {
  const byDate = new Map();
  seriesList.flat().forEach((point) => {
    byDate.set(point.date, (byDate.get(point.date) ?? 0) + point.value);
  });
  return normalizeSeries([...byDate.entries()].map(([date, value]) => ({ date, value: Number(value.toFixed(4)) })));
}

function spreadSeries(longSeries, shortSeries) {
  const shortByDate = new Map(shortSeries.map((point) => [point.date, point.value]));
  return normalizeSeries(
    longSeries
      .filter((point) => shortByDate.has(point.date))
      .map((point) => ({ date: point.date, value: Number(((point.value - shortByDate.get(point.date)) * 100).toFixed(2)) }))
  );
}

export function extractMacroSeriesFromWorkbook(workbookPath) {
  const macroSheetXml = readSheetXml(workbookPath, 3);
  const indexSheetXml = readSheetXml(workbookPath, 4, 10 * 1024 * 1024);
  const dailyFlowSheetXml = readSheetXml(workbookPath, 5, 10 * 1024 * 1024);
  const seriesByName = new Map();

  MACRO_DATA_ROWS.forEach((rowNumber, name) => {
    seriesByName.set(name, extractHorizontalSeries(macroSheetXml, rowNumber));
  });

  INDEX_SHEET_SERIES.forEach(({ name, row, headerRow }) => {
    seriesByName.set(name, extractHorizontalSeries(indexSheetXml, row, headerRow));
  });

  seriesByName.set('A股日度成交额', extractVerticalSeries(dailyFlowSheetXml, {
    dateColumn: 'A',
    valueColumn: 'B',
    transform: (value) => value / 10000
  }));
  seriesByName.set('融资融券余额', extractVerticalSeries(dailyFlowSheetXml, {
    dateColumn: 'E',
    valueColumn: 'F',
    transform: (value) => value / 1_000_000_000_000
  }));

  const northboundShanghai = extractVerticalSeries(dailyFlowSheetXml, { dateColumn: 'H', valueColumn: 'I' });
  const northboundShenzhen = extractVerticalSeries(dailyFlowSheetXml, { dateColumn: 'K', valueColumn: 'L' });
  seriesByName.set('北向资金成交额', sumSeriesByDate(northboundShanghai, northboundShenzhen));

  const southboundShanghai = extractVerticalSeries(dailyFlowSheetXml, { dateColumn: 'O', valueColumn: 'P' });
  const southboundShenzhen = extractVerticalSeries(dailyFlowSheetXml, { dateColumn: 'R', valueColumn: 'S' });
  seriesByName.set('南向资金净流入', sumSeriesByDate(southboundShanghai, southboundShenzhen));

  seriesByName.set('期限利差：（国债）10Y-1Y', spreadSeries(
    seriesByName.get('10年国债收益率') ?? [],
    seriesByName.get('1年国债收益率') ?? []
  ));
  seriesByName.set('信用利差：10Y（企业债-国开债）', spreadSeries(
    seriesByName.get('中债企业债到期收益率(AAA):10年') ?? [],
    seriesByName.get('中债国开债到期收益率:10年') ?? []
  ));

  return seriesByName;
}

function findSeries(item, seriesByName = new Map()) {
  return seriesByName.get(item.name) ?? seriesByName.get(item.label) ?? [];
}

function formatNumber(value) {
  const abs = Math.abs(value);
  if (abs > 0 && abs < 0.01) return Number(value.toFixed(4)).toString();
  if (abs > 0 && abs < 0.1) return Number(value.toFixed(3)).toString();
  if (abs >= 1000) return Number(value.toFixed(1)).toString();
  return Number(value.toFixed(2)).toString();
}

function hasPercentUnit(item) {
  const text = `${item.name ?? ''} ${item.label ?? ''}`;
  if (text.includes('PMI') || text.includes('新出口订单') || text.includes('原材料购价')) {
    return false;
  }
  return String(item.current ?? '').includes('%');
}

function unitSuffixFromItem(item) {
  const current = String(item.current ?? '');
  if (hasPercentUnit(item)) return '%';
  const suffixMatch = current.match(/(万亿|万户|亿元|亿|bp|倍)$/);
  return suffixMatch?.[1] ?? '';
}

function currentFromSeries(item, series) {
  if (series.length === 0) return item.current ?? '';
  const suffix = unitSuffixFromItem(item);
  return `${formatNumber(series.at(-1).value)}${suffix}`;
}

function deltaFromSeries(item, series) {
  if (series.length < 2) return item.delta ?? '';
  const latest = series.at(-1).value;
  const previous = series.at(-2).value;
  const delta = latest - previous;
  const prefix = delta > 0 ? '+' : '';
  const unitSuffix = unitSuffixFromItem(item);
  const suffix = unitSuffix === '%' ? 'pct' : (unitSuffix || '点');
  return `${prefix}${formatNumber(delta)}${suffix}`;
}

function signFromSeries(item, series) {
  if (series.length < 2) return item.sign ?? 'flat';
  const delta = series.at(-1).value - series.at(-2).value;
  if (delta > 0) return 'pos';
  if (delta < 0) return 'neg';
  return 'flat';
}

function normalizeItem(item, seriesByName) {
  const series = findSeries(item, seriesByName);
  return {
    label: item.label ?? item.name,
    name: item.name ?? item.label,
    current: currentFromSeries(item, series),
    delta: deltaFromSeries(item, series),
    sign: signFromSeries(item, series),
    points: series.length || item.points || 0,
    series,
    spark: toWebPath(item.spark),
    role: item.role ?? 'display'
  };
}

function normalizeGroup(group, options = {}) {
  const id = options.id ?? toId(group.title);
  const defaultVisible = options.defaultVisible ?? true;

  return {
    id,
    title: group.title,
    subtitle: group.subtitle ?? '',
    display: {
      defaultVisible,
      mode: defaultVisible ? 'default' : 'optional'
    },
    items: (group.items ?? []).map((item) => normalizeItem(item, options.seriesByName))
  };
}

function findChinaSlide(source) {
  const slides = source.slides ?? [];
  const chinaSlide = slides.find((slide) => String(slide.title ?? '').includes('国内'));
  if (!chinaSlide) {
    throw new Error('Cannot find China slide in tree framework data.');
  }
  return chinaSlide;
}

function mergePriceIntoDemand(groups) {
  const priceGroup = groups.find((group) => group.title === '价格');
  if (!priceGroup) return groups;

  return groups
    .filter((group) => group.title !== '价格')
    .map((group) => {
      if (group.title !== '需求') return group;
      return {
        ...group,
        title: '需求',
        items: [...(group.items ?? []), ...(priceGroup.items ?? [])]
      };
    });
}

export function normalizeChinaDisplayData(source, meta = {}) {
  const chinaSlide = findChinaSlide(source);
  const seriesByName = meta.seriesByName ?? new Map();
  const economyGroups = mergePriceIntoDemand(chinaSlide.economy ?? []).map((group) => normalizeGroup(group, {
    id: toId(group.title),
    defaultVisible: group.title !== '产业面',
    seriesByName
  }));
  const liquidityGroups = (chinaSlide.liquidity ?? []).map((group) => normalizeGroup(group, {
    id: toId(group.title),
    defaultVisible: true,
    seriesByName
  }));
  const assets = (chinaSlide.assets ?? []).map((asset) => ({
    id: toId(asset.asset, 'asset'),
    label: asset.asset,
    strategyTitle: asset.strategyTitle ?? '',
    conclusion: asset.conclusion ?? '',
    action: asset.action ?? '',
    groups: (asset.observe ?? []).map((group) => normalizeGroup(group, {
      id: toId(group.title),
      defaultVisible: true,
      seriesByName
    }))
  }));

  return {
    meta: {
      project: 'indicator_explorer',
      generatedAt: meta.generatedAt ?? new Date().toISOString().slice(0, 10),
      sourceFile: meta.sourceFile ?? '',
      workbookFile: meta.workbookFile ?? '',
      displayBoundary: '展示数据包:保留中国侧经济、流动性、资产全部展示字段;不是 Excel 全量原始数据导出。',
      defaultCase: '中国 / 经济基本面 / 供给',
      historySource: '宏观数据、指数走势、A股成交额换手率测试1:按不同 Sheet 结构抽取真实历史序列'
    },
    region: {
      id: 'china',
      label: '中国',
      title: chinaSlide.title,
      subtitle: chinaSlide.subtitle ?? ''
    },
    navigation: {
      sections: [
        { id: 'economy', label: '经济基本面', groupCount: economyGroups.length },
        { id: 'liquidity', label: '流动性', groupCount: liquidityGroups.length },
        { id: 'assets', label: '资产', groupCount: assets.length }
      ]
    },
    sections: {
      economy: {
        id: 'economy',
        label: '经济基本面',
        groups: economyGroups
      },
      liquidity: {
        id: 'liquidity',
        label: '流动性',
        groups: liquidityGroups
      },
      assets: {
        id: 'assets',
        label: '资产',
        assets
      }
    }
  };
}

export async function buildChinaDisplayDataFromFile({ inputFile, outputFile, generatedAt, workbookFile, seriesByName }) {
  const source = JSON.parse(await readFile(inputFile, 'utf8'));
  const normalized = normalizeChinaDisplayData(source, {
    generatedAt,
    sourceFile: inputFile,
    workbookFile,
    seriesByName
  });
  await writeFile(outputFile, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
  return normalized;
}

function collectSparkSources(source) {
  const chinaSlide = findChinaSlide(source);
  const groups = [
    ...(chinaSlide.economy ?? []),
    ...(chinaSlide.liquidity ?? []),
    ...(chinaSlide.assets ?? []).flatMap((asset) => asset.observe ?? [])
  ];
  const sources = new Set();

  groups.forEach((group) => {
    (group.items ?? []).forEach((item) => {
      if (item.spark) sources.add(item.spark);
    });
  });

  return [...sources];
}

async function copySparkSources(source, targetDir) {
  await mkdir(targetDir, { recursive: true });
  const sparkSources = collectSparkSources(source);
  await Promise.all(sparkSources.map((sourceFile) => copyFile(sourceFile, resolve(targetDir, basename(sourceFile)))));
}

async function main() {
  const moduleDir = dirname(fileURLToPath(import.meta.url));
  const repoRoot = resolve(moduleDir, '../../..');
  const inputFile = resolve(repoRoot, 'outputs/tree_macro_strategy_final_v2/tree_final_data.json');
  const outputFile = resolve(repoRoot, 'projects/indicator_explorer/data/china_display_data.json');
  const sparkTargetDir = resolve(repoRoot, 'projects/indicator_explorer/data/sparklines');
  const workbookFile = 'projects/indicator_explorer/data/macro_final_v11.2_2_safe_formula_fix_2026-05-07.xlsx';
  const source = JSON.parse(await readFile(inputFile, 'utf8'));
  const seriesByName = extractMacroSeriesFromWorkbook(resolve(repoRoot, workbookFile));

  const normalized = normalizeChinaDisplayData(source, {
      generatedAt: '2026-05-07',
      sourceFile: inputFile,
      workbookFile,
      seriesByName
    });

  await writeFile(
    outputFile,
    `${JSON.stringify(normalized, null, 2)}\n`,
    'utf8'
  );
  await copySparkSources(source, sparkTargetDir);
  return normalized;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
