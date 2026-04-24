# 仓库文件清单和用途

## GitHub 仓库内的文档

### 根目录

| 文件 | 作用 | 谁读 |
|------|------|------|
| `README.md` | GitHub 首页展示,项目简介 | 人(打开仓库的人) |
| `README_how_to_use.md` | 每日使用手册,给投研员/同事 | 使用者 |
| `AGENTS.md` | Codex 入口,硬规则清单 | Codex / AI(接手项目的 Agent) |
| `CLAUDE.md` | AI 入口,硬规则清单 | AI(接手项目的 Agent) |
| `AGENT_PROTOCOL.md` | Agent 工作协议,三动作(读-改-记) | AI(改项目前必读) |
| `macro_final_v11.2.xlsx` | 当前核心 Excel 样例,含真实 Sheet、公式、节点权重和链路信号 | 人 + AI |
| `.gitignore` | Git 忽略规则(Excel/HTML/每日 JSON 等) | Git |

### docs/(知识库)

| 文件 | 作用 |
|------|------|
| `01_project_overview.md` | 项目全貌、使用者画像、解决的问题 |
| `02_architecture.md` | 四层金字塔 + 7 条链路 + 信号标签 |
| `03_workflow.md` | 6 环节工作流详细说明 |
| `04_scoring_logic.md` | 打分系统的设计哲学 |
| `05_file_structure.md` | 本文件,仓库文件清单 |
| `06_ppt_workflow.md` | 可选 PPT 展示工作流、设计语言和图表规则 |
| `07_presentation_system.md` | PPT 输出风格体系:宏观投研风格 vs 俊诚风格 |
| `project_handoff_prompt.md` | 给新 AI 对话的项目介绍模板 |

### skills/(操作手册)

| 文件 | 作用 | 触发词 |
|------|------|-------|
| `excel_maintenance.md` | 修改 Excel 的操作手册 | Excel、公式、行号、打分、权重 |
| `indicator_management.md` | 新增/调整指标的操作手册 | 加指标、新指标、Wind 代码、节点归属 |
| `analysis_writing.md` | 分析写作规则、Prompt、搜索规则 | 分析、报告、Prompt、语气、信号流 |
| `ppt_workflow.md` | PPT 制作操作手册 | PPT、汇报页、展示页、路演稿 |

### templates/(模板规范)

| 文件 | 作用 |
|------|------|
| `ppt/README.md` | PPT 模板目录说明 |
| `ppt/a_share_economy_basic.md` | A 股经济基本面两页模板:总览页 + 证据拆解页 |
| `ppt/macro_asset_framework_page.md` | 宏观框架页模板:左侧传导、右侧资产观察与策略建议 |
| `ppt/juncheng_work_report_style.md` | 俊诚风格:工作汇报、机制建设、项目推进类 PPT |

### changelog/(历史变更)

| 文件 | 作用 |
|------|------|
| `README.md` | changelog 命名规范和使用说明 |
| `YYYY-MM-DD_<主题>.md` | 每轮变更的独立文件 |

**已有条目**(按时间倒序):
- `2026-04-20_doc_restructure.md` — 知识库 GitHub 化重构
- `2026-04-19_html_presentation.md` — HTML 展示页面首版
- `2026-04-17_protocol_update.md` — 协议加入 B.1 分阶段交付 + C.2.1 changelog 命名
- `2026-04-17_weight_refactor.md` — 议题 1 权重体系重构
- `2026-04-17_python_rewrite.md` — Python 脚本 v2.0→v2.1 适配
- `2026-04-17_excel_fix.md` — v11 Excel 公式修复

### roadmap/(未完成事项)

| 文件 | 作用 |
|------|------|
| `pending_issues.md` | 待办清单,按优先级排序 |

### scripts/(Python 脚本)

| 文件 | 作用 |
|------|------|
| `macro_snapshot_export.py` | 从 Excel 导出 JSON 快照的主脚本(v2.2) |

### prompts/(AI Prompt)

| 文件 | 作用 |
|------|------|
| `analysis_prompt_v2.2.md` | 7 条链路分析的 System Prompt(v2.2) |

### samples/(产出样例)

| 文件 | 作用 |
|------|------|
| `README.md` | samples 目录说明 |
| `snapshot_2026-04-17_lite.json` | JSON 精简版样例(AI 用) |
| `snapshot_2026-04-17_full.json` | JSON 完整版样例(HTML 用) |
| `analyses/分析_<资产>_2026-04-19.md` × 7 | 7 份分析产出样例 |
| `html/项目展示_fixed.html` | 首轮 HTML 展示样例,用于理解最终交付形态 |

---

## 入库的数据样例与本地数据资产

### 已入库的核心样例

| 文件 | 格式 | 用途 |
|------|------|------|
| `macro_final_v11.2.xlsx` | Excel | 当前核心 Excel 样例,用于新接手者理解真实结构、公式、节点权重和 7 条链路信号流 |
| `samples/html/项目展示_fixed.html` | HTML | 首轮展示样例,用于参考最终交付页面长什么样 |

**为什么这两个文件入库**:
- 新接手者没有 Excel 原文件时,只能读文档,很难理解真实 Sheet 和公式如何连接
- 当前文件体积较小,适合作为可读样例
- 入库定位是"样例/基线",不是每日 Wind 刷新后的归档

### 不在 GitHub 仓库的每日数据资产

以下文件**默认不受 GitHub 管理**,由用户在本地维护:

### 每日 Excel 工作副本

| 文件 | 格式 | 用途 |
|------|------|------|
| `macro_final_v11*.xlsx` | Excel | Wind 每日刷新后的工作副本。如果只是更新数据,不建议每次提交 |

### 每轮产出

| 文件类型 | 命名模式 | 用途 |
|---------|---------|------|
| JSON 快照(完整版) | `snapshot_YYYY-MM-DD.json` | 含 12 月历史,约 500KB |
| JSON 快照(精简版) | `snapshot_YYYY-MM-DD_lite.json` | 约 23k tokens,供 AI |
| 分析报告 | `分析_<资产>_YYYY-MM-DD.md` | 每个资产一份,约 2KB |
| HTML 展示 | `项目展示_YYYY-MM-DD.html` | 单文件,约 100KB |
| PPT 展示 | `*.pptx` / 预览图 | 可选汇报产物,默认放本地 `outputs/` |

**为什么每日产出不入仓库**:
- Excel 是二进制文件,Git 管理体验差
- 每次刷新数据都会变,commit 日志会爆炸
- 大文件(如 full JSON 500KB)会拖累仓库 clone 速度
- 产出物本身不是"知识",而是"某次运行的结果"
- PPTX 和预览图通常是某次汇报的结果,默认不入库；稳定模板写入 `templates/ppt/`

这些文件通过仓库根目录的 `.gitignore` 显式排除,确保 `git add .` 时不会误入。当前 `.gitignore` 对 `macro_final_v11.2.xlsx` 和 `samples/html/*.html` 做了例外放行。

**例外**:`samples/` 目录里保留了**一份产出样例**(2026-04-19 版),根目录保留一份核心 Excel 样例。这些样例不跟随每日产出自动更新。

---

## 文件命名规范

### 英文 snake_case(本仓库主要用)

```
excel_maintenance.md
project_handoff_prompt.md
2026-04-20_doc_restructure.md
```

**用途**:所有入 GitHub 的说明文档。

**原因**:URL 友好(GitHub 上链接不会出现 %E4%B8%AD 编码),Claude Code 操作路径更稳。

### 中文文件名(用户本地)

```
项目展示_2026-04-19.html
分析_A股_2026-04-19.md
```

**用途**:用户本地产出物,发给同事时可读性好。

---

## 目录层级的设计原则

### 为什么有三个"内容目录"(docs / skills / changelog)?

| 目录 | 定位 | 阅读时机 |
|------|------|---------|
| `docs/` | **项目是什么**(背景知识) | 新接手时 / 需要理解原理时 |
| `skills/` | **怎么改它**(操作手册) | 接到具体任务时 |
| `changelog/` | **改过什么**(历史记录) | 排查问题 / 追溯决策时 |

### 为什么 `AGENTS.md` / `CLAUDE.md` 和 `AGENT_PROTOCOL.md` 放根目录?

因为:
- 它们是**所有 Agent 的入口**,放根目录最显眼
- 引用它们的路径最短(`CLAUDE.md` 比 `docs/CLAUDE.md` 简洁)
- GitHub 一眼能看到,不用点进目录

### 为什么 `pending_issues.md` 单独一个 `roadmap/` 目录?

虽然只有一个文件,但:
- `pending_issues.md` 和 `changelog/` 是**对称的**(过去 vs 未来)
- 未来可能会拆分:`roadmap/short_term.md`、`roadmap/long_term.md`
- 独立目录便于后续扩展

---

## Git 工作流对应的文件操作

### 日常小改动(改 Excel 阈值、Python 脚本小调整)

```bash
# 1. 改 Excel / Python 文件(用户本地)
# 2. 更新对应 skill 文档
vim skills/excel_maintenance.md

# 3. 新建 changelog
vim changelog/2026-04-21_threshold_adjust.md

# 4. 提交
git add skills/excel_maintenance.md changelog/2026-04-21_threshold_adjust.md
git commit -m "threshold_adjust: PMI 阈值改为 52/51/50/49/48"
git push
```

### 中等改动(加新指标、改权重)

```bash
# 1. 改 Excel(加行)+ 改 Python NODE_INDICATORS
# 2. 更新多个 skill
vim skills/indicator_management.md
vim skills/excel_maintenance.md

# 3. changelog
vim changelog/2026-04-21_add_indicator.md

# 4. 提交
git add .
git commit -m "add_indicator: 新增美国企业债信用利差(挂美债链路供需节点)"
git push
```

### 大改(议题级别,如议题 2 AI 打分)

- 新建多个 changelog 文件(按时间顺序)
- 可能需要更新 `CLAUDE.md` 和 `AGENT_PROTOCOL.md`(如果引入新协议)
- 议题完成后,在 `pending_issues.md` 里标记完成
