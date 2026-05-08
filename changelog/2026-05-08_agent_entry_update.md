# [2026-05-08] agent entry update

**变更人**:Codex
**变更类型**:文档更新
**影响范围**:
- `AGENTS.md`:补充项目阶段、子项目阅读规则、展示层硬规则和当前进度
- `CLAUDE.md`:同步 `AGENTS.md` 的入口规则,避免两个 Agent 入口分叉

## 变更内容

本轮将 5 月以来形成的子项目边界写入 Agent 入口文档。项目当前不再只按 Excel/Python/Prompt 三件套理解,而是包含宏观数据底座、指标观察台和日报 HTML/PDF 交付层。

## 同步更新的文档

- 更新 `AGENTS.md` 的项目定位、必读文档、R6 子项目与展示层规则、当前版本和接手提示
- 更新 `CLAUDE.md` 的同名章节,保持两个入口一致

## 风险或遗留问题(如有)

- `docs/project_handoff_prompt.md` 仍停留在 2026-04-20 口径,后续如果要给新对话交接,建议单独更新。
- `docs/05_file_structure.md` 的 changelog 列表不是最新倒序,后续可单独做一次文档清理。

## 下一步建议(如有)

- 如果继续推进日报 HTML/PDF,优先保持 `indicator_explorer` 和 `macro_daily_html` 的边界清晰,不要把观察台和成品页混成一个模块。
