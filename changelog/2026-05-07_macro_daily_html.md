# [2026-05-07] macro_daily_html 子项目

**变更人**:Codex
**变更类型**:新增功能
**影响范围**:
- 新增 `projects/macro_daily_html/` 子项目
- 新增日报 HTML/PDF demo
- 新增子项目 README、workflow、CHANGELOG
- 新增结构测试 `daily_html_structure.test.mjs`
- 更新根目录 README 和 `.gitignore`

## 变更内容

本轮建立日报 HTML/PDF 子项目,定位为当前 PPT 日报的替代层。第一版先复刻最新 PPT 的中国/美国两页内容框架,并提供浏览器打印导出 PDF 的入口。

## 同步更新的文档

- 新增 `projects/macro_daily_html/README.md`
- 新增 `projects/macro_daily_html/workflow.md`
- 新增 `projects/macro_daily_html/CHANGELOG.md`
- 更新 `README.md` 的子项目结构说明
- 新增 `docs/superpowers/plans/2026-05-07-macro-daily-html.md`

## 风险或遗留问题(如有)

- 当前 demo 仍是静态框架,尚未接入 Excel/JSON 自动数据绑定。
- 当前导出 PDF 依赖浏览器打印能力,还不是服务端自动生成 PDF。
- 日报编辑器能力尚未开发,后续再从 `indicator_explorer` 接入选指标流程。

## 下一步建议(如有)

- 先确认 HTML 框架是否符合 PPT 替代方向。
- 再接入中国侧数据包和日报文案生成。
- 最后做指标观察台到日报编辑器的选取流程。
