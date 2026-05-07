# 日报 HTML/PDF 子项目

本子项目用于把当前的日报 PPT 逐步替换为 HTML/PDF 交付。

当前第一版目标很窄:

- 先严格复刻最新 PPT 的中国页排版。
- 页面结构先只覆盖 `中国` 一页。
- 折线图先使用 PPT 内嵌的趋势图图片,不能省略。
- 先提供 HTML 页面和 `导出 PDF` 按钮。
- 暂不做复杂自动选指标,后续再接日报编辑器。

## 与 indicator_explorer 的关系

```text
projects/indicator_explorer/
  = 数据原展示 / 指标观察台
  = 看所有指标历史变化,判断哪些指标值得进入日报

projects/macro_daily_html/
  = 日报成品层
  = 只放当天需要讲的核心指标、结论和资产策略
```

简单说:

- `indicator_explorer` 解决“数据原来怎么变”。
- `macro_daily_html` 解决“今天日报怎么讲、怎么发”。

## 文件结构

```text
projects/macro_daily_html/
├── README.md
├── workflow.md
├── CHANGELOG.md
├── demo/
│   ├── assets/
│   │   └── china/
│   │       └── image*.png
│   └── index.html
└── test/
    └── daily_html_structure.test.mjs
```

## 当前 demo

本地服务启动后打开:

```text
http://localhost:5175/projects/macro_daily_html/demo/index.html
```

页面包含:

- 顶部工具条
- `导出 PDF` 按钮
- 中国 PPT 复刻页
- PPT 内嵌趋势折线图兜底
- `需求 / 供给 / 价格` 三块动态读取中国展示 JSON
- 打印/PDF 专用样式

当前动态数据来源:

```text
projects/indicator_explorer/data/china_display_data.json
```

当前仍需注意:`非制造业PMI` 暂未出现在该 JSON 中,页面保留 PPT 静态兜底。

## 后续目标

后续分三步推进:

1. **框架复刻**:先把 PPT 中国页的日报排版稳定迁到 HTML。
2. **数据绑定**:接入 Excel/JSON 和 `indicator_explorer` 已整理的历史序列。当前先完成中国页 `需求 / 供给 / 价格`。
3. **日报编辑器**:从指标观察台选择“今天要讲的指标”,自动进入日报 HTML,再导出 PDF。
