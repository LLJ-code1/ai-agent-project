import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
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

function normalizeItem(item) {
  return {
    label: item.label ?? item.name,
    name: item.name ?? item.label,
    current: item.current ?? '',
    delta: item.delta ?? '',
    sign: item.sign ?? 'flat',
    points: item.points ?? 0,
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
    items: (group.items ?? []).map(normalizeItem)
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

export function normalizeChinaDisplayData(source, meta = {}) {
  const chinaSlide = findChinaSlide(source);
  const economyGroups = (chinaSlide.economy ?? []).map((group) => normalizeGroup(group, {
    id: toId(group.title),
    defaultVisible: group.title !== '产业面'
  }));
  const liquidityGroups = (chinaSlide.liquidity ?? []).map((group) => normalizeGroup(group, {
    id: toId(group.title),
    defaultVisible: true
  }));
  const assets = (chinaSlide.assets ?? []).map((asset) => ({
    id: toId(asset.asset, 'asset'),
    label: asset.asset,
    strategyTitle: asset.strategyTitle ?? '',
    conclusion: asset.conclusion ?? '',
    action: asset.action ?? '',
    groups: (asset.observe ?? []).map((group) => normalizeGroup(group, {
      id: toId(group.title),
      defaultVisible: true
    }))
  }));

  return {
    meta: {
      project: 'indicator_explorer',
      generatedAt: meta.generatedAt ?? new Date().toISOString().slice(0, 10),
      sourceFile: meta.sourceFile ?? '',
      workbookFile: meta.workbookFile ?? '',
      displayBoundary: '展示数据包:保留中国侧经济、流动性、资产全部展示字段;不是 Excel 全量原始数据导出。',
      defaultCase: '中国 / 经济基本面 / 供给'
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

export async function buildChinaDisplayDataFromFile({ inputFile, outputFile, generatedAt, workbookFile }) {
  const source = JSON.parse(await readFile(inputFile, 'utf8'));
  const normalized = normalizeChinaDisplayData(source, {
    generatedAt,
    sourceFile: inputFile,
    workbookFile
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

  const normalized = normalizeChinaDisplayData(source, {
      generatedAt: '2026-05-07',
      sourceFile: inputFile,
      workbookFile
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
