# [2026-05-07] indicator_explorer 子项目

**变更人**:Codex
**变更类型**:新增功能
**影响范围**:
- 新增 `projects/indicator_explorer/` 子项目
- 新增中国侧展示 JSON 和 HTML demo
- 复制测试 Excel 快照到子项目
- 复制中国侧 sparkline 小图到子项目
- 更新根目录 README 的仓库结构说明

## 变更内容

本轮建立独立的指标展示实验台,用于验证“指标总库保留、展示层按需选择”的方案 A。第一版只使用中国侧数据,展示层包含经济基本面、流动性和资产三大类。

## 同步更新的文档

- 新增 `projects/indicator_explorer/README.md`
- 新增 `projects/indicator_explorer/workflow.md`
- 新增 `projects/indicator_explorer/CHANGELOG.md`
- 更新 `README.md` 的仓库结构说明

## 风险或遗留问题(如有)

- 当前 JSON 是展示数据包,不是 Excel 全量原始数据导出。
- 当前只做中国侧,美国侧还未接入。
- demo 页面依赖本地静态服务加载 JSON。

## 下一步建议(如有)

- 确认中国侧展示结构是否符合日报 HTML 使用习惯。
- 如果结构确认,再扩展到美国基本面、美股、美债和黄金。
