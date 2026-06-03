# 宏观投研自动化工程

> 把中美宏观数据(Wind 终端 118 个指标)自动转化为结构化的投研分析报告,覆盖 7 类资产的传导链路。

---

## 这是什么

投研团队的日常工作中,每天要从 Wind 拉海量宏观数据,人工整理成对资产的判断。这套系统把其中的机械整理和结构化分析部分自动化,**从数据刷新到分析产出,压缩到 5 分钟之内**。

**主链路**:

```
① Wind 数据刷新(人工)
  ↓
② Excel 自动打分(全自动)
  118 指标 × 打分公式 → 29 节点加权得分 → 7 条链路信号流
  ↓
③ Python 导出 JSON(全自动)
  ↓
④ 内容观点生成层(全自动)
  ↓
⑤ 产品化展示/交付(进行中)
  ├─ 展示 HTML 产品线:全量展示 + 观察台/选指标
  └─ 日报 PPT 产品线:后续直接构建 PPT
  ↓
⑥ 飞书推送(⬜ 未开发)
```

## 项目地图

当前项目按 4 层理解:

| 层级 | 模块 | 定位 |
|------|------|------|
| 基础层 | `macro_final_v11.2.xlsx` + `scripts/macro_snapshot_export.py` | Wind 数据刷新、Excel 打分、导出结构化 JSON |
| 分析层 / 内容观点生成层 | `products/content_viewpoint/` + `prompts/` + `skills/` | 从 JSON 生成结构化观点包、客户经理可转述版和 PPT 短句 |
| 产品线 A:展示 HTML | `products/display_html/` | 包含全量展示 HTML 和观察台/选指标 HTML |
| ├─ 全量展示 | `products/display_html/full_dashboard/项目展示_fixed.html` | Excel/JSON 的完整优化展示,用于内部复盘、领导汇报、项目展示 |
| └─ 观察台 / 选指标 | `products/display_html/indicator_explorer/` | 观察指标历史变化,辅助判断哪些指标进入日报 PPT |
| 产品线 B:日报 PPT | `products/daily_ppt/` | 每日精选指标和结论,生成客户经理可用的日报 PPT |

注意:观察台属于展示 HTML 产品线,但它不是最终交付物;日报最终交付回到 PPT。

## 覆盖的资产

7 条传导链路:A 股、港股、短债、中长债、美股、美债、黄金。

每条链路 4-5 个节点,如 A 股:
```
央行 → 银行间 → 实体 → 经济 → 市场
```

## 当前状态

- **Excel**:`macro_final_v11.2.xlsx`(v11 + 议题 1 权重重构后,当前核心样例文件)
- **Python 脚本**:`macro_snapshot_export.py` v2.2
- **Prompt**:`analysis_prompt_v2.2.md`
- **内容观点生成层**:`products/content_viewpoint/`
- **首轮完整观点**:2026-04-19,7 份 markdown 分析
- **全量展示 HTML**:`products/display_html/full_dashboard/项目展示_fixed.html`(单文件,含 21 个趋势图)

## 仓库结构

```
.
├── README.md                 ← 你在看(项目介绍)
├── README_how_to_use.md      ← 每日使用手册(给投研员/同事)
├── AGENTS.md                 ← Codex 入口文档(Agent 必读)
├── CLAUDE.md                 ← AI 入口文档(Agent 必读)
├── AGENT_PROTOCOL.md         ← Agent 工作协议(改项目前必读)
├── macro_final_v11.2.xlsx    ← 当前核心 Excel 样例(用于理解真实结构)
│
├── docs/                     ← 项目知识库
│   ├── 01_project_overview.md    项目全貌
│   ├── 02_architecture.md        四层金字塔 + 7 条链路
│   ├── 03_workflow.md            6 环节工作流
│   ├── 04_scoring_logic.md       打分系统设计哲学
│   ├── 05_file_structure.md      文件清单和用途
│   └── project_handoff_prompt.md 新对话交接模板
│
├── skills/                   ← 操作手册(按任务分类)
│   ├── excel_maintenance.md
│   ├── indicator_management.md
│   └── analysis_writing.md
│
├── scripts/                  ← Python 脚本(版本化追踪)
│   └── macro_snapshot_export.py
│
├── prompts/                  ← AI 分析/观点生成的 Prompt
│   └── analysis_prompt_v2.2.md
│
├── products/                 ← 产品线
│   ├── content_viewpoint/    内容观点生成层
│   ├── display_html/         展示 HTML 产品线
│   │   ├── full_dashboard/   全量展示 HTML
│   │   └── indicator_explorer/ 观察台/选指标 HTML
│   └── daily_ppt/            日报 PPT 产品线
│
├── samples/                  ← 产出样例(供 AI 参考"正常输出什么样")
│   ├── README.md
│   ├── snapshot_2026-04-17_lite.json
│   ├── snapshot_2026-04-17_full.json
│   └── analyses/             7 份样例分析 md
│
├── changelog/                ← 历史变更日志(每轮独立文件)
│   ├── README.md             命名规范
│   └── YYYY-MM-DD_*.md
│
└── roadmap/                  ← 未完成事项
    └── pending_issues.md
```

## 给 AI 接手者的话

1. 用 Codex 接手时先读 `AGENTS.md`;用 Claude 接手时先读 `CLAUDE.md`
2. 再读 `AGENT_PROTOCOL.md`
3. 根据具体任务读对应的 `skills/*.md`
4. 遇到决策点,问用户,不要自己拍

## 数据资产与样例

当前仓库保留一份核心 Excel 样例和一份 HTML 展示样例,方便新接手者理解真实结构:

- `macro_final_v11.2.xlsx`:当前核心 Excel 样例,包含真实 Sheet 结构、公式、节点权重和链路信号
- `products/display_html/full_dashboard/项目展示_fixed.html`:首轮全量 HTML 展示样例,用于参考 Excel/JSON 优化展示形态。它是展示 HTML 产品线的全量展示模块,不是日报层。

以下文件仍由使用者本地管理,不随每日运行自动入库:

- 每日刷新后的 Excel 工作副本(`*.xlsx`):如果只是日常 Wind 刷新,不建议每次提交
- 每轮产出的 JSON 快照(`snapshot_YYYY-MM-DD*.json`):每日产出
- 每日生成的 HTML 展示页(`项目展示_*.html`):每日产出
- 每轮的观点包(`viewpoint_pack_*.json` / `.md`):每日内容中间产物
- 每轮的 markdown 分析报告(`分析_<资产>_*.md`):历史长文分析形态,需要时产出

本仓库管理以下内容:

- **说明文档**(README / CLAUDE / docs / skills / changelog / roadmap)
- **Python 脚本**(`scripts/macro_snapshot_export.py`)
- **AI Prompt**(`prompts/analysis_prompt_v2.2.md`)
- **核心样例**(`macro_final_v11.2.xlsx` + `samples/`,供 AI 和新接手者参考真实输入与输出)

## 作者

投研团队(非开发者) + Claude (Anthropic)

**协作方式**:用户用 Claude Code 连接本仓库,每次修改项目文件时,AI 会自动读最新文档、执行协议、更新变更日志、提交 GitHub。
