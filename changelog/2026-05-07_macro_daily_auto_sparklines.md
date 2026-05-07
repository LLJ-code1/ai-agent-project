# [2026-05-07] macro_daily_html A 版自动小折线扩展

**变更人**:Codex
**变更类型**:修改现有
**影响范围**:
- `projects/macro_daily_html/src/china_daily_dynamic.mjs`:扩展固定 slot 映射,从中国展示 JSON 收集经济、流动性和资产端指标
- `projects/macro_daily_html/demo/index.html`:给同口径指标行补充 `data-slot` 动态属性,保留原 PPT 图片和值作为兜底
- `projects/macro_daily_html/test/china_daily_dynamic.test.mjs`:新增流动性和资产端动态 slot 测试
- `projects/macro_daily_html/test/daily_html_structure.test.mjs`:新增代表性 HTML slot 结构检查
- `projects/macro_daily_html/README.md`、`workflow.md`、`CHANGELOG.md`:同步 A 版小折线规则和覆盖范围
- `docs/superpowers/plans/2026-05-07-macro-daily-auto-sparklines.md`:新增实施计划

## 变更内容

本轮按用户确认的 A 版方案扩展日报页自动趋势图:表格内只生成紧凑 SVG 小折线,不引入完整坐标轴或大图表。页面只接入 `china_display_data.json` 中已有且同口径的历史序列;缺失或口径不完全一致的指标继续保留 PPT 抽取图片和值作为兜底。

## 同步更新的文档

- 更新了 `projects/macro_daily_html/README.md` 的当前目标、文件结构和 demo 说明
- 更新了 `projects/macro_daily_html/workflow.md` 的数据绑定范围和兜底规则
- 更新了 `projects/macro_daily_html/CHANGELOG.md`
- 新增了 `docs/superpowers/plans/2026-05-07-macro-daily-auto-sparklines.md`

## 风险或遗留问题(如有)

- `非制造业PMI`、`新增人民币贷款`、`深成指数`、`创业板指`、`交易总金额`、`换手率` 等仍未动态化,原因是 JSON 缺失或当前口径不完全一致。
- 当前小折线只用于日报表格内快速展示趋势方向,不承担完整图表解读功能。

## 下一步建议(如有)

- 先检查动态化后的中国页视觉是否仍接近 PPT。
- 如需继续扩展,下一步应先补齐 `indicator_explorer` 的同口径数据包,再接剩余槽位。
