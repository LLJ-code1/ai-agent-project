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
  ['商品房销售面积:累计同比', 105],
  ['1Y同业存单到期收益率(AAA)', 106],
  ['PMI主要原材料购进价格', 107],
  ['CFETS人民币汇率指数', 109]
]);

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

export function extractMacroSeriesFromWorkbook(workbookPath) {
  const sheetXml = execFileSync('unzip', ['-p', workbookPath, 'xl/worksheets/sheet3.xml'], {
    encoding: 'utf8',
    maxBuffer: 30 * 1024 * 1024
  });

  const dateCells = extractNumericCells(getRowXml(sheetXml, 1));
  const columnDates = new Map(
    [...dateCells.entries()]
      .filter(([, serial]) => serial >= 30000)
      .map(([column, serial]) => [column, excelSerialToDate(serial)])
  );
  const seriesByName = new Map();

  MACRO_DATA_ROWS.forEach((rowNumber, name) => {
    const valueCells = extractNumericCells(getRowXml(sheetXml, rowNumber));
    const series = [...valueCells.entries()]
      .filter(([column]) => columnDates.has(column))
      .map(([column, value]) => ({ date: columnDates.get(column), value: Number(value.toFixed(4)) }))
      .sort((left, right) => left.date.localeCompare(right.date));

    seriesByName.set(name, series);
  });

  return seriesByName;
}

function findSeries(item, seriesByName = new Map()) {
  return seriesByName.get(item.name) ?? seriesByName.get(item.label) ?? [];
}

function formatNumber(value) {
  return Number(value.toFixed(2)).toString();
}

function hasPercentUnit(item) {
  const text = `${item.name ?? ''} ${item.label ?? ''}`;
  if (text.includes('PMI') || text.includes('新出口订单') || text.includes('原材料购价')) {
    return false;
  }
  return String(item.current ?? '').includes('%');
}

function currentFromSeries(item, series) {
  if (series.length === 0) return item.current ?? '';
  const suffix = hasPercentUnit(item) ? '%' : '';
  return `${formatNumber(series.at(-1).value)}${suffix}`;
}

function deltaFromSeries(item, series) {
  if (series.length < 2) return item.delta ?? '';
  const latest = series.at(-1).value;
  const previous = series.at(-2).value;
  const delta = latest - previous;
  const prefix = delta > 0 ? '+' : '';
  const suffix = hasPercentUnit(item) ? 'pct' : '点';
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
      historySource: '宏观数据 sheet:按指标行号抽取真实历史序列'
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
