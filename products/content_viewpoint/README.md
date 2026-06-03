# 内容观点生成层

本目录用于承接 `Excel/JSON -> 内容观点` 的分析层产品化。

## 定位

内容观点生成层位于 JSON 快照之后、所有展示和交付之前:

```text
Excel 原始数据
  -> JSON 快照
  -> products/content_viewpoint/
      -> 全量展示 HTML
      -> 日报 PPT
      -> 后续飞书 / 日报摘要
```

它不是 HTML 产品线,也不是 PPT 产品线。它负责把结构化数据加工成可复用的投研观点包,再交给下游不同交付物使用。

## 解决的问题

如果直接从 JSON 分别生成 HTML、PPT 和飞书摘要,同一套判断会散落在多个产品线里,后续改指标或改表达时容易不一致。

本层先生成统一的 `viewpoint_pack`,让下游只负责展示:

- 全量展示 HTML:读取完整观点、证据和链路解释。
- 日报 PPT:读取重点判断、客户经理可转述版和 PPT 短句。
- 飞书/日报摘要:读取压缩后的核心判断。

## 当前文件

- `workflow.md`:内容观点生成流程。
- `prompts/viewpoint_prompt.md`:观点生成 Prompt 草案。
- `schemas/viewpoint_pack.schema.json`:观点包结构约束。
- `samples/viewpoint_pack_sample.json`:观点包样例。
- `CHANGELOG.md`:本产品线内部变更记录。

## 当前边界

- 输入只接受同口径 JSON 快照,不直接读 Excel。
- 输出先以结构化观点包为主,暂不直接生成 PPT。
- 观点必须绑定数据证据,不能超出 JSON 做归因。
- 客户经理可转述版是必需字段,不是可选附加文案。

## 后续方向

1. 用现有 `snapshot_*.json` 跑一份真实观点包。
2. 确认字段是否足够服务日报 PPT。
3. 再决定是否写自动生成脚本。
