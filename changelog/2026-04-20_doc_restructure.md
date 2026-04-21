# [2026-04-20] 知识库 GitHub 化重构

**变更人**:Claude + 用户
**变更类型**:重构(文档体系)
**影响范围**:
- 全部说明文档迁移至 GitHub 仓库结构
- 新增 README.md(GitHub 首页)
- 目录层级重新组织

## 变更内容

### 背景

此前知识库是散落在对话产出里的 `.md` 文件(CLAUDE.md、AGENT_PROTOCOL.md、kb_skill_*.md 等)。随着用户计划用 Claude Code 管理项目 + 多 AI 对话协作,需要把知识库迁移到 GitHub,以解决"记忆跨对话一致性"问题。

### 新的仓库结构

```
macro-dashboard/
├── README.md                      ← GitHub 首页(新增)
├── CLAUDE.md                      ← AI 入口
├── AGENT_PROTOCOL.md              ← 工作协议
│
├── docs/                          ← 知识库专题文档(新目录)
│   ├── 01_project_overview.md
│   ├── 02_architecture.md
│   ├── 03_workflow.md
│   ├── 04_scoring_logic.md
│   ├── 05_file_structure.md
│   └── project_handoff_prompt.md  ← 新对话交接提示词
│
├── skills/                        ← 操作手册(新目录)
│   ├── excel_maintenance.md       (原 kb_skill_excel.md)
│   ├── indicator_management.md    (原 kb_skill_indicators.md)
│   └── analysis_writing.md        (原 kb_skill_analysis.md)
│
├── changelog/                     ← 独立归档(新目录)
│   ├── README.md                  命名规范
│   ├── 2026-04-17_excel_fix.md
│   ├── 2026-04-17_python_rewrite.md
│   ├── 2026-04-17_weight_refactor.md
│   ├── 2026-04-17_protocol_update.md
│   ├── 2026-04-19_html_presentation.md
│   └── 2026-04-20_doc_restructure.md ← 本文件
│
├── roadmap/                       ← 路线图(新目录)
│   └── pending_issues.md
│
└── .gitignore
```

### 关键设计决策

1. **英文文件名 + 中文内容**:GitHub URL 友好,Claude Code 操作路径稳
2. **分离 docs / skills / changelog**:docs 是背景知识,skills 是操作手册,changelog 是历史。用途分离,层次清晰
3. **README.md 新增**:面向人(打开 GitHub 的人),和面向 AI 的 CLAUDE.md 职责分离
4. **changelog/ 独立目录**:一年后会有几十个文件,独立目录避免污染根目录
5. **roadmap/ 目录**:虽然当前只有 1 个文件,但未来可能拆分为 short_term / long_term,独立目录便于扩展
6. **不入仓库的资产**:Excel / HTML / JSON / 每轮分析 md,由用户本地管理,通过 `.gitignore` 隔离

### 本次文档全面更新的内容

相比迁移前的旧版本,以下内容在新仓库中做了更新:

- **CLAUDE.md**:补充了 R2.5 数值比较、R2.6 TIPS 中文化、R5 分阶段交付
- **AGENT_PROTOCOL.md**:完整化 B.1 + C.2.1,新增"Git 工作流"章节
- **skills/analysis_writing.md**:新增 R7 数值比较 / R8 债市多层 / R9 黄金新框架 / HTML 展示规范
- **skills/indicator_management.md**:新增"黄金定价因子的当前权重(2026 年更新)"
- **skills/excel_maintenance.md**:更新布伦特特殊逻辑、议题 1 重构要点
- **docs/04_scoring_logic.md**:新增"总分的含义"章节(对应 HTML 仪表盘说明)
- **docs/project_handoff_prompt.md**:新对话交接模板,八条踩坑

### 迁移前后对照

| 旧文件 | 新位置 |
|--------|-------|
| `CLAUDE.md` | `CLAUDE.md`(更新) |
| `AGENT_PROTOCOL.md` | `AGENT_PROTOCOL.md`(更新) |
| `kb_skill_excel.md` | `skills/excel_maintenance.md` |
| `kb_skill_indicators.md` | `skills/indicator_management.md` |
| `kb_skill_analysis.md` | `skills/analysis_writing.md` |
| `pending_issues.md` | `roadmap/pending_issues.md` |
| `99_change_log.md` | 拆分为 `changelog/YYYY-MM-DD_*.md` 多文件 |
| `changelog_2026-04-17_*.md` | `changelog/2026-04-17_*.md` |
| `项目交接_提示词.md` | `docs/project_handoff_prompt.md` |
| (新增) | `README.md` |
| (新增) | `docs/01_project_overview.md` |
| (新增) | `docs/02_architecture.md` |
| (新增) | `docs/03_workflow.md` |
| (新增) | `docs/04_scoring_logic.md` |
| (新增) | `docs/05_file_structure.md` |
| (新增) | `changelog/README.md` |
| (新增) | `.gitignore` |

## 同步更新的文档

- 本次为文档体系重构,所有文档均为新建或重写
- `AGENT_PROTOCOL.md` 新增"Git 工作流"章节,说明用 Claude Code 时的 commit 流程

## 风险或遗留问题

- 旧的零散 .md 文件在本地可能仍存在,用户清理时不要误删用户本地的非知识库文件(如 Excel / HTML / JSON / 每轮分析 md)
- 议题 2(AI 替代公式打分)尚未实施,`auto_view` 字段仍是数据陈述

## 下一步建议

- 用户在 GitHub 创建 `macro-dashboard` 仓库,把本目录下所有文件 push 上去
- 用 Claude Code 在本地 clone 仓库,作为后续所有 AI 协作的"单一真相来源"
- 按 `roadmap/pending_issues.md` 的优先级,下一个议题是议题 2(AI 替代公式打分)
