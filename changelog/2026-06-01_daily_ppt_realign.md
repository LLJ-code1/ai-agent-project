# [2026-06-01] 日报 PPT 路线重整

**变更人**:Codex
**变更类型**:重构 / 文档更新
**影响范围**:
- 删除 `projects/macro_daily_html/` 日报 HTML/PDF 试验子项目
- 删除相关未落地主线的 `docs/superpowers/plans/2026-05-07-macro-daily-*.md` 计划文件
- 更新 `README.md`、`AGENTS.md`、`CLAUDE.md`、`docs/01_project_overview.md`、`docs/03_workflow.md`、`docs/05_file_structure.md`、`docs/project_handoff_prompt.md`
- 更新 `.gitignore`,移除 `projects/macro_daily_html/demo/*.html` 例外

## 变更内容

根据用户确认,当前日报 HTML 版本不再保留,后续日报交付回到直接构建 PPT。全量展示 HTML `products/display_html/full_dashboard/项目展示_fixed.html` 保留,继续作为 Excel/JSON 全貌展示样例。

## 同步更新的文档

- 更新了项目入口文档中第 5 环节的说明:全量展示层保留 HTML,日报层后续直接构建 PPT
- 更新了文件结构说明,标记 `projects/macro_daily_html/` 已下线删除
- 更新了交接提示词和工作流文档,避免后续 Agent 继续沿用日报 HTML/PDF 路线

## 风险或遗留问题(如有)

- 当前工作区中 `macro_final_v11.2.xlsx` 已在本轮开始前显示为删除,本次未处理该文件
- `output/`、`outputs/` 仍有未跟踪运行产物,本次按用户指令未清理

## 下一步建议(如有)

- 重新梳理日报 PPT 的固定版式、数据绑定字段和客户经理可转述版生成流程
