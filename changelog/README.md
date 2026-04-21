# Changelog 目录

本目录按时间顺序存放本项目的所有变更日志。每轮修改一个独立文件。

## 命名规范

```
YYYY-MM-DD_<主题>.md
```

### 日期

使用当天日期(年-月-日),如 `2026-04-20`。

### 主题

简短英文 snake_case,描述本次变更的性质:

| 主题关键词 | 适用场景 |
|-----------|---------|
| `excel_fix` | Excel 公式/格式的修复 |
| `python_rewrite` | Python 脚本的适配或重写 |
| `weight_refactor` | 权重体系重构 |
| `prompt_update` | Prompt 的修改 |
| `html_presentation` | HTML 展示页面 |
| `doc_sync` | 纯文档同步 |
| `doc_restructure` | 文档体系重构 |
| `protocol_update` | AGENT_PROTOCOL 的修改 |
| `add_indicator` | 新增指标 |
| `threshold_adjust` | 打分阈值调整 |

**同一天多轮工作时,每轮单独一个文件**,即使是在同一个对话里产生的多份变更。

### 错误示例

- ❌ `changelog_entry.md`(无日期无主题)
- ❌ `changes.md`(过于笼统)
- ❌ `2026-04-17.md`(同一天多轮会覆盖)

### 正确示例

- ✅ `2026-04-17_excel_fix.md`
- ✅ `2026-04-17_weight_refactor.md`(同日两轮独立归档)

---

## 变更日志内容模板

严格按以下模板,**不要自由发挥**:

```markdown
# [YYYY-MM-DD] 变更标题

**变更人**:Claude / Agent ID / 用户姓名
**变更类型**:[新增功能 / 修改现有 / 修复 Bug / 重构 / 文档更新 / 协议更新]
**影响范围**:
- 文件 1 的具体改动
- 文件 2 的具体改动

## 变更内容

(用 1-3 句话描述这次改了什么,为什么改)

## 同步更新的文档

- 更新了 xxx.md 的 xxx 章节
- 新增了 yyy.md

## 风险或遗留问题(如有)

- ...

## 下一步建议(如有)

- ...
```

---

## 变更索引(按时间倒序)

- [2026-04-21_doc_consistency.md](./2026-04-21_doc_consistency.md) — 同步 v11.2 文档状态并入库 AGENTS
- [2026-04-21_add_excel_html_samples.md](./2026-04-21_add_excel_html_samples.md) — 补入核心 Excel 样例和 HTML 展示样例
- [2026-04-21_add_scripts_and_samples.md](./2026-04-21_add_scripts_and_samples.md) — 补入 scripts / prompts / samples + 使用手册
- [2026-04-20_doc_restructure.md](./2026-04-20_doc_restructure.md) — 知识库 GitHub 化重构
- [2026-04-19_html_presentation.md](./2026-04-19_html_presentation.md) — HTML 展示页面首版
- [2026-04-17_protocol_update.md](./2026-04-17_protocol_update.md) — 协议加入 B.1 分阶段交付 + C.2.1 命名规范
- [2026-04-17_weight_refactor.md](./2026-04-17_weight_refactor.md) — 议题 1 权重体系重构
- [2026-04-17_python_rewrite.md](./2026-04-17_python_rewrite.md) — Python 脚本 v2.0→v2.1 适配
- [2026-04-17_excel_fix.md](./2026-04-17_excel_fix.md) — v11 Excel 公式修复
