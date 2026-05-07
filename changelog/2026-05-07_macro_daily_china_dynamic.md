# [2026-05-07] macro_daily_html 中国页动态化试验

**变更人**:Codex
**变更类型**:新增功能
**影响范围**:
- `projects/macro_daily_html/src/china_daily_dynamic.mjs`:新增中国页 JSON 映射和 SVG 折线图渲染模块
- `projects/macro_daily_html/demo/index.html`:需求/供给/价格三块接入动态槽位
- `projects/macro_daily_html/test/china_daily_dynamic.test.mjs`:新增动态数据模块测试
- `projects/macro_daily_html/test/daily_html_structure.test.mjs`:新增动态脚本和槽位结构检查
- `projects/macro_daily_html/BRANCH_HANDOFF.md`:新增分支交接说明
- `projects/macro_daily_html/README.md`、`workflow.md`、`CHANGELOG.md`:同步动态化说明
- `docs/superpowers/plans/2026-05-07-macro-daily-china-dynamic.md`:新增实施计划

## 变更内容

本轮在 `codex/macro-daily-china-dynamic` 分支上试验中国页动态化。页面保持 PPT 复刻版式不变,打开时从 `indicator_explorer` 的中国展示 JSON 读取需求/供给/价格指标,并用历史序列生成 SVG 折线图;若指标缺失,保留原 PPT 静态值和趋势图。

## 同步更新的文档

- 新增 `projects/macro_daily_html/BRANCH_HANDOFF.md`
- 更新 `projects/macro_daily_html/README.md`
- 更新 `projects/macro_daily_html/workflow.md`
- 更新 `projects/macro_daily_html/CHANGELOG.md`
- 新增 `docs/superpowers/plans/2026-05-07-macro-daily-china-dynamic.md`

## 风险或遗留问题(如有)

- `china_display_data.json` 当前没有中国侧 `非制造业PMI`,该格子仍走 PPT 静态兜底。
- 当前只接了需求/供给/价格三块,流动性和资产端仍使用 PPT 静态图。
- SVG 折线图已可随 JSON 变化,但样式仍需用户按 PPT 观感继续微调。

## 下一步建议(如有)

- 先确认动态化后的中国页视觉是否保持 PPT 风格。
- 再补 `非制造业PMI` 数据映射,或继续接流动性三块。
