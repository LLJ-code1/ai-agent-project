# [2026-06-01] 日报 PPT 设计系统

**变更人**:Codex
**变更类型**:文档更新
**影响范围**:
- 新增 `products/daily_ppt/design_system.md`
- 新增 `products/daily_ppt/layout_matrix.md`
- 新增 `products/daily_ppt/scripts/polish_v6_layout.py`
- 新增 `products/daily_ppt/CHANGELOG.md`
- 更新 `products/daily_ppt/README.md`
- 更新 `products/daily_ppt/workflow.md`
- 生成 `outputs/daily_ppt/宏观传导框架_资产版_V6_版式对齐_V1.pptx`

## 变更内容

根据用户对 V6 日报 PPT 的反馈,本轮不固定具体指标数量,而是沉淀可复用的设计系统。标准指标卡保留四列结构,但国内产业面按现有特殊行业横表处理;指标数量通过 2-6 个指标/卡片的布局矩阵来判断是否适合放在同一页。

本轮同时基于用户提供的 V6 原稿生成一份版式对齐样张,优先修正现有页面里的边界和对齐问题,不另起一套 PPT 版式。

## 同步更新的文档

- 新增日报 PPT 设计系统文档
- 新增指标数量布局测试矩阵
- 更新日报 PPT 产品线 README 和 workflow
- 新增日报 PPT 产品线内部 CHANGELOG

## 风险或遗留问题(如有)

- 当前 PPT 样张沿用 V6 原稿数据,只做版式调整。
- 后续接入真实日报数据时,仍需逐页检查文字对齐和越界问题。

## 下一步建议(如有)

- 先确认 V6 版式对齐效果,再讨论 2-6 个指标在现有 V6 框架内的适配规则。
