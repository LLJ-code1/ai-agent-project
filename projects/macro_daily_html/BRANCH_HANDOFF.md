# 中国日报动态化分支交接

分支:`codex/macro-daily-china-dynamic`

## 目标

只把中国 PPT 复刻页的 `需求 / 供给 / 价格` 三块接到 `indicator_explorer` 中国 JSON。

## 边界

- 不改 PPT 版式。
- 不做完整日报编辑器。
- 不处理美国页。
- 不改 Excel 公式。

## 当前数据链路

```text
projects/indicator_explorer/data/china_display_data.json
  -> projects/macro_daily_html/src/china_daily_dynamic.mjs
  -> projects/macro_daily_html/demo/index.html
```

页面打开后会读取 JSON,再按固定 PPT 槽位更新:

- 当前值
- 较上期
- 趋势 SVG 折线图

## 已动态化的槽位

- 需求:社零、固定投资、房屋销售、出口
- 供给:制造业PMI、工业增加值
- 价格:PPI、CPI、原材料购价

## 暂时兜底的槽位

- 供给:非制造业PMI

原因:`china_display_data.json` 当前没有中国侧 `非制造业PMI` 条目。页面会保留 PPT 抽取的静态图和值,不让格子空掉。

## 后续建议

1. 先确认当前中国页动态化后视觉是否仍接近 PPT。
2. 再决定是否把 `非制造业PMI` 补进 `indicator_explorer` 数据包。
3. 需求/供给/价格稳定后,再接流动性和资产端。
