# 指标展示实验台

本子项目用于验证“指标总库保留、展示层按需选择”的 HTML 方案。

第一版只做方案 A:

- 不改主 Excel 公式
- 不改 `scripts/macro_snapshot_export.py`
- 复制一份测试 Excel 快照到本子项目
- 基于现有 tree framework 输出整理中国侧展示 JSON
- 用独立 HTML demo 测试指标选择交互

## 文件结构

```text
projects/indicator_explorer/
├── README.md
├── workflow.md
├── CHANGELOG.md
├── data/
│   ├── macro_final_v11.2_2_safe_formula_fix_2026-05-07.xlsx
│   ├── china_display_data.json
│   └── sparklines/
├── demo/
│   └── index.html
├── src/
│   └── build_china_display_data.mjs
└── test/
    └── normalize_china_data.test.mjs
```

## JSON 是什么

`data/china_display_data.json` 是**展示数据包**,不是 Excel 全量原始数据导出。

当前测试口径:

- 方向:只含 `中国`
- 大类:含 `经济基本面`、`流动性`、`资产`
- 经济基本面:含 `供给`、`需求`、`产业面`
- `价格` 指标并入 `需求`,页面上不再单独显示“需求与价格”或“价格”大组
- 资产:含 `A股`、`中债`、`港股`

其中 `产业面` 保留为可选展示,默认不作为中国经济基本面的首屏展示。

## 当前数据来源

- 测试 Excel 快照:`data/macro_final_v11.2_2_safe_formula_fix_2026-05-07.xlsx`
- 展示 JSON 来源:`outputs/tree_macro_strategy_final_v2/tree_final_data.json`
- 历史序列来源:测试 Excel 的 `宏观数据` Sheet,按指标行号抽取真实历史点
- 生成脚本:`src/build_china_display_data.mjs`

## Demo 功能

- 左侧选择大类、分组和指标。
- 指标卡片使用 SVG 折线图展示历史序列。
- 时间区间支持 `近3期`、`近6期`、`近12期`、`全部`。
- 图表含横轴、纵轴、网格线、点位和最新值标注。

## 本地查看

从仓库根目录启动静态服务:

```bash
python3 -m http.server 5175
```

打开:

```text
http://localhost:5175/projects/indicator_explorer/demo/index.html
```

## 设计边界

- Excel 是指标总库和测试数据来源。
- JSON 是给 HTML 使用的中间层。
- HTML 只决定“展示哪些指标”,不决定指标是否保留。
- 后续如果要接入美国侧,应扩展同一 JSON 结构,不要新开一套 HTML 逻辑。
