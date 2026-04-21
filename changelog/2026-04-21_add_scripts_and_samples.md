# [2026-04-21] 补入 scripts / prompts / samples + 使用手册

**变更人**:Claude + 用户
**变更类型**:新增功能(入库资产扩展)
**影响范围**:
- 新建 `scripts/` 目录,入库 `macro_snapshot_export.py` v2.2
- 新建 `prompts/` 目录,入库 `analysis_prompt_v2.2.md`
- 新建 `samples/` 目录,入库 7 份分析 md + 2 份 JSON 快照(2026-04-17)
- 新建 `README_how_to_use.md`,每日使用手册(用户视角)
- 更新 `.gitignore`,允许 scripts 和 prompts 入库
- 更新 `README.md` 仓库结构图
- 更新 `docs/05_file_structure.md` 的文件清单

## 变更内容

### 背景

前一轮(2026-04-20)把文档迁到 GitHub 后,Python 脚本和 AI Prompt 被当成"用户本地资产"排除。用户反馈:
1. 这两个文件本质是"项目知识的一部分",改动不频繁,适合 Git 追踪
2. 新 AI 对话接手时,看不到 Prompt 就没法理解"AI 分析怎么写"
3. 希望有"每日使用手册",让同事也能看懂怎么跑

于是本轮对所有非 Excel / HTML 资产重新分类入库。

### 新增目录及内容

#### scripts/

- `macro_snapshot_export.py` v2.2(16,322 字节)
- 从 Excel 导出 JSON 快照的主脚本,含前置 recalc 检查、NODE_INDICATORS 映射、衍生指标计算

#### prompts/

- `analysis_prompt_v2.2.md`(4,450 字节)
- 7 条链路分析的 System Prompt,含排版规则、硬规则、AI 搜索补充规则

#### samples/

- `README.md` — 样例目录说明
- `snapshot_2026-04-17_lite.json`(145 KB,精简版)
- `snapshot_2026-04-17_full.json`(493 KB,完整版)
- `analyses/分析_<资产>_2026-04-19.md` × 7(首轮完整分析样本)

**用途**:供新 AI 接手时参考"正常输出长什么样",不跟随每日产出更新。

### 新增使用手册

- `README_how_to_use.md` — 给**使用者**(投研员、同事)看的每日操作手册
  - 步骤 1:Wind 刷新 → Ctrl+S
  - 步骤 2:跑 Python 脚本导出 JSON
  - 步骤 3:AI 生成 7 份分析
  - 步骤 4:AI 编排 HTML
  - 步骤 5:分发
  - 常见问题 6 条
  - 每日 Checklist(可打印贴墙)

### .gitignore 调整

- 允许 `scripts/*.py` 和 `prompts/*.md` 入库
- 允许 `samples/*.json` 和 `samples/analyses/分析_*.md` 入库(同时排除根目录的每日产出)
- Excel / HTML / 每日 JSON 仍排除

### 文件分类三分法(新框架)

此后仓库内容遵循以下分类:

| 类别 | 特征 | 入库 |
|------|------|------|
| **说明文档** | 项目知识,改动不频繁 | ✅ |
| **代码 & Prompt** | 核心可执行/可配置资产,改动不频繁 | ✅ |
| **样例产出** | 供参考的快照,极少更新 | ✅(仅 samples/) |
| **核心数据(Excel)** | 每日更新,二进制 | ❌ |
| **每日产出(JSON/md/HTML)** | 每日更新 | ❌ |

## 同步更新的文档

- `README.md` 新增仓库结构图里的 scripts / prompts / samples
- `README.md` 非代码资产章节改写,scripts/prompts 从"不入库"改为"入库"
- `docs/05_file_structure.md` 根目录清单新增 `README_how_to_use.md` 和 `.gitignore`
- `docs/05_file_structure.md` 新增 scripts/ prompts/ samples/ 三个子章节
- `docs/05_file_structure.md` "不在仓库的资产"章节改写,scripts/prompts 移除
- `.gitignore` 规则重写,允许 scripts/prompts/samples 通过

## 风险或遗留问题

- Prompt 文件在用户本地可能还有老版本(v2.0/v2.1),入库的是 v2.2。后续改 Prompt 要确保只改仓库里的,不要在本地改完忘记推上去
- samples 只有 2026-04-19 一轮的产出,没有基线对比(未来可以考虑每月手工加一份)
- Python 脚本未加单元测试,改脚本后的回归验证仍需人工跑一遍完整流程

## 下一步建议

- 把本轮更新的仓库重新 push 到 GitHub
- 后续如果改 Python 脚本或 Prompt,严格在仓库里改 + commit + push,保持单一真相来源
- 下个议题:P1 的议题 2(AI 替代公式打分)

---

**同步策略**:用户本地的 `macro_snapshot_export.py` 和 `analysis_prompt_v2.2.md` 应与本仓库保持一致。建议用户本地用 `git pull` 获取最新版,或者把本地文件移出工作目录,仅使用仓库里的版本。
