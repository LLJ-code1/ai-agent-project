# 日报 PPT 流程

## 1. 数据来源

底层仍是用户每日更新的 Excel:

```text
Excel 原始数据
  -> scripts/macro_snapshot_export.py
  -> JSON 快照 / 展示数据包
```

## 2. 选指标

先通过观察台查看指标变化:

```text
products/display_html/indicator_explorer/
```

观察台只负责“看变化、辅助选择”,不负责生成最终日报。

## 3. 写日报表达

日报 PPT 需要先形成客户经理可转述版,回答:

- 经济怎么样
- 为什么
- 对市场有什么影响

然后再压缩成 PPT 中的总结句。

## 4. 生成 PPT

当前已有 V6 版式对齐样张:

```bash
python3 products/daily_ppt/scripts/polish_v6_layout.py
```

输出:

```text
outputs/daily_ppt/宏观传导框架_资产版_V6_版式对齐_V1.pptx
```

后续产品化目标:

- 固定 PPT 版式和组件规范
- 明确进入 PPT 的指标字段
- 接入同口径 JSON/历史序列
- 输出可直接分发的日报 PPT

历史 PPT 试版仍在 `outputs/` 中,只作为参考,不作为当前产品目录。

## 5. 版式约束

生成或手工调整 PPT 前,先检查:

- `design_system.md`:颜色、字体、字号、趋势图和文案规则。
- `layout_matrix.md`:当前指标数量对应的卡片密度和排列方式。

具体约束:

- 指标分组可以调整,但同一层级的视觉样式不能临时变化。
- 标准指标卡默认四列:名称、趋势、当前值、较上期。
- 国内产业面按 V6 原定行业横表特殊处理。
- 当单卡超过 6 个指标、一个大区超过 6 张卡,或字号需要低于 7pt 才能放下时,优先拆页、合并或转入观察台。
