# 产品线目录

`products/` 用来放可复用、可继续产品化的模块和交付线。当前分成三块:

```text
products/
├── content_viewpoint/  内容观点生成层
├── display_html/       全量展示 HTML + 观察台/选指标 HTML
└── daily_ppt/          日报 PPT 构建主线
```

底层数据源仍然是用户每日更新的 Excel,再经 Python 导出 JSON。

`content_viewpoint/` 是分析层,负责从 JSON 生成结构化观点包;`display_html/` 和 `daily_ppt/` 是下游展示/交付层。

`outputs/` 只作为历史试验和本地运行产物区,不代表当前产品结构。
