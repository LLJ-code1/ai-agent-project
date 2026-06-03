# 指标展示实验台流程

## 1. 数据准备

当前子项目先用测试 Excel 快照:

```text
products/display_html/indicator_explorer/data/macro_final_v11.2_2_safe_formula_fix_2026-05-07.xlsx
```

这份 Excel 是为了本轮展示层验证而复制,不是主流程唯一数据源。

## 2. 展示 JSON

运行:

```bash
node products/display_html/indicator_explorer/src/build_china_display_data.mjs
```

输出:

```text
products/display_html/indicator_explorer/data/china_display_data.json
```

当前 JSON 从 `outputs/tree_macro_strategy_final_v2/tree_final_data.json` 读取中国侧数据,整理成:

```text
中国
├── 经济基本面
│   ├── 供给
│   ├── 需求
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

历史点位从测试 Excel 抽取,当前分三类读取:

- `宏观数据`:PMI、社零、固定投资、PPI、CPI、DR007、国债收益率、信用利差等“行=指标、列=日期”的序列
- `指数走势`:上证指数、沪深300、恒生指数、恒生科技、沪深300利润、创业板利润、沪深300预测 PE 等横向日期序列
- `A股成交额换手率测试1`:A股成交额、北向成交、两融余额、南向资金等“行=日期、列=指标”的日度序列

其中 `价格` 不再作为页面单独大组,而是合并进 `需求`。页面展示名称仍然只叫 `需求`。

## 3. HTML 展示

启动本地服务后打开:

```text
http://localhost:5175/products/display_html/indicator_explorer/demo/index.html
```

默认视图:

```text
中国 / 经济基本面 / 供给
```

可切换:

- `经济基本面`:供给、需求、产业面
- `流动性`:央行流动性、银行间流动性、实体流动性
- `资产`:A股、中债、港股

指标卡片的折线图支持:

- `近3期`
- `近6期`
- `近12期`
- `全部`

日度指标按最近交易日切换,月度指标按最近月份切换。HTML 不区分频率,只消费统一的 `series: [{date, value}]`。

## 4. 后续扩展

下一步应优先确认两件事:

- 中国侧 JSON 的字段是否够 HTML 长期使用。
- 美国侧是否沿用同样结构扩展为 `美国基本面 / 美股 / 美债 / 黄金`。
