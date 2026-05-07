# 日报 HTML/PDF 子项目变更日志

## 2026-05-07

- 新建 `projects/macro_daily_html/` 子项目。
- 新增两页日报 HTML demo。
- 新增 `导出 PDF` 按钮,当前使用浏览器打印能力。
- 新增结构测试 `test/daily_html_structure.test.mjs`。
- 新增 README 和 workflow,明确本项目与 `indicator_explorer` 的边界。

## 2026-05-07 中国 PPT 复刻修正

- 将 demo 从自由网页卡片布局改为中国 PPT 16:9 单页复刻布局。
- 暂时移除美国页,先只做中国页。
- 抽取 PPT 内嵌趋势折线图到 `demo/assets/china/`,并放回各指标表“趋势”列。
- 更新结构测试,要求页面保留中国页、PPT 画布和至少 16 个趋势图。
