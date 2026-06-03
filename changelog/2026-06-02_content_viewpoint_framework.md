# [2026-06-02] 内容观点生成层框架

**变更人**:Codex
**变更类型**:新增功能
**影响范围**:
- 新增 `products/content_viewpoint/README.md`
- 新增 `products/content_viewpoint/workflow.md`
- 新增 `products/content_viewpoint/prompts/viewpoint_prompt.md`
- 新增 `products/content_viewpoint/schemas/viewpoint_pack.schema.json`
- 新增 `products/content_viewpoint/samples/viewpoint_pack_sample.json`
- 新增 `products/content_viewpoint/CHANGELOG.md`
- 更新 `README.md`
- 更新 `README_how_to_use.md`
- 更新 `AGENTS.md`
- 更新 `CLAUDE.md`
- 更新 `docs/01_project_overview.md`
- 更新 `docs/02_architecture.md`
- 更新 `docs/03_workflow.md`
- 更新 `docs/05_file_structure.md`
- 更新 `docs/project_handoff_prompt.md`
- 更新 `skills/analysis_writing.md`
- 更新 `roadmap/pending_issues.md`
- 更新 `products/README.md`
- 更新 `samples/README.md`

## 变更内容

新增内容观点生成层,把 `JSON 快照 -> 投研观点` 独立为 `products/content_viewpoint/`。该层输出统一 `viewpoint_pack`,供全量展示 HTML、日报 PPT 和后续飞书/日报摘要复用,避免下游产品线各自重复生成观点。

## 同步更新的文档

- 更新项目 README、入口文档、工作流和文件结构说明。
- 更新 `skills/analysis_writing.md`,把观点包纳入分析写作规则。
- 更新 roadmap,把内容观点生成层产品化列为下一步优先事项。

## 风险或遗留问题(如有)

- 当前只是框架和 schema,尚未用真实 JSON 跑通每日观点包。
- `viewpoint_pack` 字段需要经过日报 PPT 和全量展示 HTML 的真实使用再定稿。

## 下一步建议(如有)

- 用一份现有 `snapshot_YYYY-MM-DD_lite.json` 生成真实 `viewpoint_pack` 草稿。
- 人工确认字段后,再写自动生成脚本和最小校验。
