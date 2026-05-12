# [2026-05-08] project map update

**变更人**:Codex
**变更类型**:文档更新
**影响范围**:
- `README.md`:新增项目地图,明确基础层、分析层、全量展示层、日报层和日报观察台关系
- `AGENTS.md`、`CLAUDE.md`:修正 R6 子项目与展示层规则,将 `indicator_explorer` 定位为日报辅助工具
- `docs/project_handoff_prompt.md`:更新新对话交接提示中的当前状态和仓库结构
- `docs/05_file_structure.md`:更新 `projects/`、`samples/html`、`outputs/` 的目录定位

## 变更内容

本轮校正项目地图:基础层和分析层保持不变,产品化展示/交付分为"全量展示层"和"日报层"两条线。`samples/html/项目展示_fixed.html` 是全量展示层历史样例;`projects/macro_daily_html/` 是日报成品层;`projects/indicator_explorer/` 是服务日报层的观察台/选指标测试工具。

## 同步更新的文档

- 更新 `README.md` 的项目地图和仓库结构
- 更新 `AGENTS.md`、`CLAUDE.md` 的项目定位、必读文档和 R6 规则
- 更新 `docs/project_handoff_prompt.md` 的交接提示
- 更新 `docs/05_file_structure.md` 的文件清单和目录说明

## 风险或遗留问题(如有)

- 本轮不移动文件,不新建全量展示层子项目,只做文档地图校正。
- `outputs/` 仍是本地运行产物和阶段性试验结果的混合目录,后续可单独整理。
- 当前工作区存在 `macro_final_v11.2.xlsx` 删除状态,本轮不处理。

## 下一步建议(如有)

- 如果确认全量展示层要产品化,后续可单独拆出 `projects/full_dashboard_html/`。
