# 展示 HTML 产品线

展示 HTML 产品线包含两个模块:

```text
products/display_html/
├── full_dashboard/       全量展示 HTML
└── indicator_explorer/   观察台 / 选指标 HTML
```

## full_dashboard

全量展示 HTML 用来展示 Excel/JSON 的完整视图、7 条链路、指标趋势和项目全貌。当前保留的历史样例是:

```text
products/display_html/full_dashboard/项目展示_fixed.html
```

## indicator_explorer

观察台 / 选指标 HTML 用来查看指标历史变化,辅助判断哪些指标进入日报 PPT。它是日报 PPT 的输入工具,不是日报最终交付物。

## 与日报 PPT 的关系

展示 HTML 产品线负责“看全貌、看变化”;日报 PPT 产品线负责“每天怎么讲、怎么交付”。两条线都来自同一套 Excel / JSON 数据,但交付对象不同。
