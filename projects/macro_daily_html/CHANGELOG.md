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

## 2026-05-07 中国页动态化试验

- 在 `codex/macro-daily-china-dynamic` 分支上新增中国页动态化试验。
- `需求 / 供给 / 价格` 三块开始读取 `indicator_explorer` 中国展示 JSON。
- 新增 SVG 折线图渲染逻辑,页面加载成功后替换 PPT 静态趋势图。
- 保留静态兜底:JSON 加载失败或指标缺失时不清空页面。
- 新增 `BRANCH_HANDOFF.md`,方便新对话接续。

## 2026-05-07 A 版自动小折线扩展

- 用户确认采用 A 版趋势图方案:表格内只放紧凑 SVG 小折线,不加入坐标轴、网格线或大图表。
- 将流动性、部分 A股/中债/港股指标接入 `china_display_data.json` 历史序列。
- 只接同口径 JSON 指标;缺失或口径不完全一致的行继续保留 PPT 图片和值作为兜底。
- 更新动态模块测试和 HTML 结构测试,覆盖新增 slot。
