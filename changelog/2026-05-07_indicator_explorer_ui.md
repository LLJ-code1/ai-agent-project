# [2026-05-07] indicator_explorer UI refinement

**变更人**:Codex
**变更类型**:功能调整
**影响范围**:
- `projects/indicator_explorer/src/build_china_display_data.mjs`
- `projects/indicator_explorer/data/china_display_data.json`
- `projects/indicator_explorer/demo/index.html`
- `projects/indicator_explorer/README.md`
- `projects/indicator_explorer/workflow.md`
- `projects/indicator_explorer/CHANGELOG.md`

## 变更内容

本轮按展示口径调整中国经济基本面 demo:`价格` 指标并入 `需求`,页面组名保持为 `需求`。同时从测试 Excel 的 `宏观数据` Sheet 抽取真实历史序列,替换原先只依赖 PNG 小图的展示方式。

前端指标卡片改为 SVG 折线图,增加横轴、纵轴、网格线、点位、最新值标注和时间区间切换。

## 同步更新的文档

- 更新 `projects/indicator_explorer/README.md`
- 更新 `projects/indicator_explorer/workflow.md`
- 更新 `projects/indicator_explorer/CHANGELOG.md`

## 风险或遗留问题(如有)

- 当前历史序列只覆盖已在脚本里登记行号的中国侧指标。
- 资产类部分指标仍保留展示字段,但未全部接入 Excel 历史序列。
