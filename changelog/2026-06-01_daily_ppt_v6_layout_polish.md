# [2026-06-01] 日报 PPT V6 版式对齐

**变更人**:Codex
**变更类型**:修改现有
**影响范围**:
- 新增 `products/daily_ppt/scripts/polish_v6_layout.py`
- 生成 `outputs/daily_ppt/宏观传导框架_资产版_V6_版式对齐_V1.pptx`
- 更新 `products/daily_ppt/README.md`
- 更新 `products/daily_ppt/workflow.md`
- 更新 `products/daily_ppt/CHANGELOG.md`

## 变更内容

基于用户提供的 V6 日报 PPT 原稿另存调整版,不另起新 PPT。重点修正第一页产业政策文字越界并压到财政政策的问题,同时对齐第二页顶部图例、资产/配置按钮、流动性区左边距和三张流动性卡片列线;第二页经济面长句缩小字号并回收到自身区域。

## 同步更新的文档

- 更新日报 PPT 产品线 README 的当前样张路径。
- 更新日报 PPT workflow 的生成命令和输出路径。
- 更新日报 PPT 产品线 CHANGELOG。

## 风险或遗留问题(如有)

- 本轮只做 V6 现有页面的版式整理,没有重构指标框架。
- Quick Look 已能渲染两页预览,但最终仍建议在 PowerPoint 中目检一次文字细节。

## 下一步建议(如有)

- 用户确认 V6 对齐版后,再在该版式基础上测试 2/3/4/5 个指标的真实适配方式。
