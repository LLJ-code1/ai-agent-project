# [2026-04-22] PPT 工作流规范

**变更人**:Codex
**变更类型**:新增功能 / 文档更新
**影响范围**:
- 新增 `docs/06_ppt_workflow.md`,沉淀 PPT 展示定位、设计语言、页面类型和图表规则
- 新增 `skills/ppt_workflow.md`,作为后续 PPT/汇报页任务的操作手册
- 新增 `templates/ppt/README.md` 和 `templates/ppt/a_share_economy_basic.md`,记录 A 股经济基本面两页模板
- 更新 `AGENTS.md`、`CLAUDE.md`、`README.md`、`docs/05_file_structure.md`,同步入口和文件结构
- 更新 `.gitignore`,忽略本地 PPT/预览输出目录 `outputs/`

## 变更内容

本轮把 A 股经济基本面 PPT 制作经验沉淀为可选工作流。重点记录了"图表服务观点"、机构投研风格设计语言、热力表分组、PMI 坐标轴、价格指标溯因、内需对比表等规则。

## 同步更新的文档

- 更新了 `AGENTS.md` 和 `CLAUDE.md` 的 skill 入口清单
- 更新了 `README.md` 的仓库结构
- 更新了 `docs/05_file_structure.md` 的 docs、skills、templates 和本地产出说明
- 新增了 `docs/06_ppt_workflow.md`
- 新增了 `skills/ppt_workflow.md`
- 新增了 `templates/ppt/README.md`
- 新增了 `templates/ppt/a_share_economy_basic.md`

## 风险或遗留问题(如有)

- 当前只是半自动规范,尚未把 PPT 生成脚本正式纳入 `scripts/`
- 后续如果要自动化,需要先稳定 Excel/JSON 数据抽取、图表生成和预览检查流程

## 下一步建议(如有)

- 如确认 PPT 工作流会长期使用,可继续开发 `scripts/ppt/` 下的可复用生成脚本
