# 指标展示实验台流程

## 1. 数据准备

当前子项目先用测试 Excel 快照:

```text
projects/indicator_explorer/data/macro_final_v11.2_2_safe_formula_fix_2026-05-07.xlsx
```

这份 Excel 是为了本轮展示层验证而复制,不是主流程唯一数据源。

## 2. 展示 JSON

运行:

```bash
node projects/indicator_explorer/src/build_china_display_data.mjs
```

输出:

```text
projects/indicator_explorer/data/china_display_data.json
projects/indicator_explorer/data/sparklines/*.png
```

当前 JSON 从 `outputs/tree_macro_strategy_final_v2/tree_final_data.json` 读取中国侧数据,整理成:

```text
中国
├── 经济基本面
│   ├── 供给
│   ├── 需求
│   ├── 价格
│   └── 产业面(可选)
├── 流动性
│   ├── 央行流动性
│   ├── 银行间流动性
│   └── 实体流动性
└── 资产
    ├── A股
    ├── 中债
    └── 港股
```

## 3. HTML 展示

启动本地服务后打开:

```text
http://localhost:5175/projects/indicator_explorer/demo/index.html
```

默认视图:

```text
中国 / 经济基本面 / 供给
```

可切换:

- `经济基本面`:供给、需求、价格、产业面
- `流动性`:央行流动性、银行间流动性、实体流动性
- `资产`:A股、中债、港股

## 4. 后续扩展

下一步应优先确认两件事:

- 中国侧 JSON 的字段是否够 HTML 长期使用。
- 美国侧是否沿用同样结构扩展为 `美国基本面 / 美股 / 美债 / 黄金`。
