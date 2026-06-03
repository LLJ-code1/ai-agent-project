# 日报 PPT 产品线

本目录用于承接后续日报 PPT 构建主线。

## 定位

日报 PPT 是最终每日交付物。它从同一套 Excel / JSON 数据出发,结合观察台选出的重点指标和客户经理可转述版,生成可直接分发的 PPT。

## 与展示 HTML 的关系

```text
Excel 原始数据
├── products/display_html/
│   ├── full_dashboard/       看全部数据和项目全貌
│   └── indicator_explorer/   看指标变化,辅助选指标
└── products/daily_ppt/
    └── 生成每日交付 PPT
```

## 当前状态

日报 HTML/PDF 试验线已下线。后续不再沿 `macro_daily_html` 推进,而是在本目录重新梳理 PPT 版式、数据绑定和输出流程。

## 当前文档

- `design_system.md`:日报 PPT 的设计语言、字体、颜色、组件和边界规则。
- `layout_matrix.md`:2-6 个指标或卡片数量下的版式测试矩阵。
- `scripts/polish_v6_layout.py`:基于 V6 原稿生成版式对齐调整版。
- `workflow.md`:日报 PPT 从数据、选指标、写表达到生成 PPT 的流程。

## 当前样张

- PPT 文件:`outputs/daily_ppt/宏观传导框架_资产版_V6_版式对齐_V1.pptx`

## 关键设计约定

- 固定设计系统,不固定具体指标。
- 标准指标卡默认使用 `名称 / 趋势 / 当前值 / 较上期` 四列。
- 国内 `产业面` 是特殊结构,按 V6 的行业横表处理,不强行套标准四列。
- 指标数量不写死上限,先按 `layout_matrix.md` 测试 2-6 个指标时的可读性和适配方式。
