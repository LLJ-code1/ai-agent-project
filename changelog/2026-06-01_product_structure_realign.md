# [2026-06-01] 产品线目录重整

**变更人**:Codex
**变更类型**:重构 / 文档更新
**影响范围**:
- 新增 `products/` 产品线目录
- 迁移全量展示 HTML 到 `products/display_html/full_dashboard/`
- 迁移观察台到 `products/display_html/indicator_explorer/`
- 新增日报 PPT 主线目录 `products/daily_ppt/`
- 更新相关 README、workflow、入口文档和 `.gitignore`

## 变更内容

根据用户确认,项目产品线改为两条:展示 HTML 产品线和日报 PPT 产品线。展示 HTML 产品线下包含全量展示 HTML 与观察台/选指标 HTML;日报 PPT 产品线单独承接每日交付。

## 同步更新的文档

- 新增 `products/README.md`
- 新增 `products/display_html/README.md`
- 新增 `products/display_html/full_dashboard/README.md`
- 新增 `products/daily_ppt/README.md` 和 `products/daily_ppt/workflow.md`
- 更新观察台 README / workflow / CHANGELOG
- 更新 `README.md`、`AGENTS.md`、`CLAUDE.md`、`README_how_to_use.md`
- 更新 `docs/01_project_overview.md`、`docs/03_workflow.md`、`docs/05_file_structure.md`、`docs/project_handoff_prompt.md`
- 更新 `roadmap/pending_issues.md`

## 风险或遗留问题(如有)

- 当前工作区中 `macro_final_v11.2.xlsx` 已在本轮开始前显示为删除,本次不处理该文件
- `outputs/` 和 `output/` 仍保留历史运行产物,本次只调整产品线目录

## 下一步建议(如有)

- 继续梳理日报 PPT 的模板、字段、样例和生成脚本
