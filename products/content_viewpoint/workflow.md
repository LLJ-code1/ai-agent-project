# 内容观点生成流程

## 1. 输入

输入来自 Python 导出的 JSON 快照:

```text
snapshot_YYYY-MM-DD_lite.json
```

优先使用精简版 JSON。完整 HTML 需要历史图时,再从完整版 JSON 补充 history。

## 2. 生成目标

本层生成统一观点包:

```text
viewpoint_pack_YYYY-MM-DD.json
viewpoint_pack_YYYY-MM-DD.md
```

JSON 用于下游产品线读取;Markdown 用于人工审阅。

## 3. 处理步骤

```text
JSON 快照
  -> 读取 meta.export_date 和 7 条链路信号流
  -> 识别今日关键变化和断点
  -> 生成宏观判断
  -> 生成资产观点
  -> 生成客户经理可转述版
  -> 压缩成 PPT 短句和飞书摘要
  -> 输出 viewpoint_pack
```

## 4. 输出结构

观点包至少包含:

- `daily_core`:今日核心判断。
- `macro_sections`:中国宏观、海外宏观等分区观点。
- `asset_views`:A 股、港股、短债、中长债、美股、美债、黄金等资产观点。
- `client_manager_brief`:客户经理可转述版。
- `ppt_digest`:可直接放入日报 PPT 的短句。
- `source_checks`:数据边界、数值比较和外部搜索检查。

详细字段见 `schemas/viewpoint_pack.schema.json`。

## 5. 与下游产品线关系

### 全量展示 HTML

读取完整观点、证据和链路解释,用于展示完整分析逻辑。

### 日报 PPT

读取:

- `daily_core.one_sentence`
- `macro_sections[].summary`
- `asset_views[].ppt_sentence`
- `client_manager_brief.talk_track`

日报 PPT 不重新发明观点,只负责把观点放进 V6 版式。

### 飞书/日报摘要

读取更短的核心判断和客户经理话术,用于消息推送。

## 6. 硬规则

- 只能基于 JSON 中存在的数据做判断。
- 所有观点必须有 `evidence` 绑定。
- 出现数值比较时,必须显式写出两边数值。
- 日度数据不能直接做趋势判断,优先使用累计或月度变化。
- 价格指标上涨时,必须检查是否可能受能源价格推动。
- 客户经理可转述版必须回答:经济怎么样、为什么、对市场有什么影响。

## 7. 人工确认点

以下情况不应直接下游生成 PPT:

- 观点证据不足。
- 关键字段来自外部搜索但未注明来源。
- 同一指标对多个资产结论冲突。
- 需要新增或删除指标。
- PPT 短句超过版式承载范围。
