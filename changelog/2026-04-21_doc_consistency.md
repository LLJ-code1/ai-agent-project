# [2026-04-21] 同步 v11.2 文档状态并入库 AGENTS

**变更人**:Codex + 用户
**变更类型**:文档更新
**影响范围**:
- 新增 `AGENTS.md` 到 Git 管理,作为 Codex 接手项目的入口文档
- 更新 `README.md` 中 HTML 环节状态与 Codex/Claude 入口说明
- 更新 `CLAUDE.md` / `AGENTS.md` 的当前版本信息
- 更新 `README_how_to_use.md` 的 Excel 文件名、脚本示例和 AI 接手提示
- 更新 `docs/03_workflow.md` 的 Excel 文件名和脚本示例
- 更新 `skills/excel_maintenance.md` 的核心 Excel 样例文件名
- 更新 `scripts/macro_snapshot_export.py` 顶部用法说明,不改导出逻辑
- 更新 `docs/project_handoff_prompt.md` 和 `docs/05_file_structure.md` 的文件说明

## 变更内容

本轮先处理仓库一致性问题,不修改 Excel 公式。主要把文档中的旧文件名 `macro_final_v11.xlsx` 同步为当前核心样例 `macro_final_v11.2.xlsx`,把 HTML 环节状态修正为半自动,并将 Codex 入口文档 `AGENTS.md` 入库。

## 同步更新的文档

- 更新了 `README.md` 的流程状态、仓库结构和 AI 接手说明
- 更新了 `CLAUDE.md` / `AGENTS.md` 的当前版本信息
- 更新了 `README_how_to_use.md`、`docs/03_workflow.md`、`skills/excel_maintenance.md`
- 更新了 `docs/project_handoff_prompt.md`、`docs/05_file_structure.md` 和 `changelog/README.md`

## 风险或遗留问题(如有)

- `macro_final_v11.2.xlsx` 内仍存在 `_xlfn.IFS` / `IFS(` 公式,本轮按用户要求暂不处理 Excel。

## 下一步建议(如有)

- 单独做一轮 Excel 公式兼容性修复,把 `IFS` 改为嵌套 `IF`,再用导出脚本验证。
