# [2026-05-07] macro_daily_html 中国 PPT 复刻修正

**变更人**:Codex
**变更类型**:修改现有
**影响范围**:
- `projects/macro_daily_html/demo/index.html`:改为中国 PPT 16:9 单页复刻布局
- `projects/macro_daily_html/demo/assets/china/`:新增 PPT 内嵌趋势图资产
- `projects/macro_daily_html/test/daily_html_structure.test.mjs`:更新为中国页和趋势图约束
- `projects/macro_daily_html/README.md`:同步说明当前只做中国页并保留折线图
- `projects/macro_daily_html/workflow.md`:同步说明 PPT 版式优先规则
- `projects/macro_daily_html/CHANGELOG.md`:记录子项目内变更

## 变更内容

本轮按用户确认,撤回自由网页化设计方向,改为优先复刻已定稿 PPT 中国页。折线图先直接使用 PPT 内嵌图片资产,后续再替换为 Excel/JSON 驱动的真实历史图。

## 同步更新的文档

- 更新 `projects/macro_daily_html/README.md`
- 更新 `projects/macro_daily_html/workflow.md`
- 更新 `projects/macro_daily_html/CHANGELOG.md`

## 风险或遗留问题(如有)

- 当前折线图仍是从 PPT 抽取的静态图片,还不是自动数据生成。
- 当前只迁移中国页,美国页暂未迁移。
- 视觉复刻已按 PPT 坐标和资产推进,后续仍需要用户按实际 PPT 观感确认细节。

## 下一步建议(如有)

- 用户先确认中国页版式是否接近定稿 PPT。
- 确认后再把折线图替换为 Excel/JSON 生成的可更新图。
