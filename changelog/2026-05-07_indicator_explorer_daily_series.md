# [2026-05-07] indicator_explorer daily series

**变更人**:Codex
**变更类型**:功能调整
**影响范围**:
- `projects/indicator_explorer/src/build_china_display_data.mjs`
- `projects/indicator_explorer/test/normalize_china_data.test.mjs`
- `projects/indicator_explorer/data/china_display_data.json`
- `projects/indicator_explorer/README.md`
- `projects/indicator_explorer/workflow.md`
- `projects/indicator_explorer/CHANGELOG.md`

## 变更内容

本轮补齐日度指标历史序列。此前脚本只读取 `宏观数据` Sheet,导致资产类、资金面和部分日度流动性指标没有 `series`。现在脚本同时读取 `指数走势` 和 `A股成交额换手率测试1`,并把不同表格形态统一整理成 HTML 可消费的 `series: [{date, value}]`。

## 同步更新的文档

- 更新 `projects/indicator_explorer/README.md` 的数据来源说明
- 更新 `projects/indicator_explorer/workflow.md` 的历史点位抽取流程
- 更新 `projects/indicator_explorer/CHANGELOG.md`

## 风险或遗留问题(如有)

- 日度数据的最新值以 Excel 缓存值为准;Wind 公式行如果日期缓存为空,脚本会跳过该行,不自行猜测日期。
- 当前仍是中国侧 demo,美国侧日度数据读取尚未接入。
