# 每日使用手册

> 这个文件面向**使用者**(投研员、同事)。讲清楚每天怎么跑起来这套工具链。
>
> 如果你是 AI / Agent 接手项目,请先看 `CLAUDE.md`,不是这个文件。

---

## 每日跑一轮的完整流程

假设今天是周一早上 9:00,你想产出当天的宏观分析报告。整个流程约 5 分钟。

### 步骤 1 · 刷新 Wind 数据(约 1 分钟)

1. 打开 Excel 文件:`macro_final_v11.2.xlsx`(或你本地当天使用的最新版工作副本)
2. 确认已加载 Wind 插件
3. 点 **Wind 刷新按钮**(或 `Wind > 刷新全部`)
4. 等所有指标拉取完成
5. **Ctrl+S 保存一次**(这步很重要,触发公式重算)

**检查点**:汇总 Sheet 的 H 列(当前值)应该没有空白或 `#N/A`。如果有,可能是 Wind 网络问题,重新刷新。

### 步骤 2 · 导出 JSON(约 30 秒)

打开终端,到放 Excel 的目录:

```bash
cd /path/to/your/files

# 运行脚本
python3 /path/to/macro-dashboard/scripts/macro_snapshot_export.py macro_final_v11.2.xlsx
```

**输出**:
- `snapshot_YYYY-MM-DD.json`(完整版 500KB)
- `snapshot_YYYY-MM-DD_lite.json`(精简版 150KB,AI 用)

**可选参数**:
```bash
# 指定输出目录
python3 .../scripts/macro_snapshot_export.py macro_final_v11.2.xlsx --output-dir ./snapshots

# 补充当日市场背景(AI 会参考)
python3 .../scripts/macro_snapshot_export.py macro_final_v11.2.xlsx \
    --context "美伊停火谈判中,市场关注油价能否回落"
```

**常见报错**:
- `ValueError: Excel 未 recalc` → 回步骤 1,重新 Ctrl+S
- `KeyError: '汇总'` → Excel 文件不是 v11,确认文件名
- `ModuleNotFoundError: openpyxl` → 跑 `pip install openpyxl`

### 步骤 3 · AI 生成分析(约 2-5 分钟)

有三种方式让 AI 生成分析,选一种顺手的:

**方式 A · 在 Claude / GPT 对话里按资产逐条生成(推荐给新手)**

1. 新开一个 AI 对话
2. 把 `prompts/analysis_prompt_v2.2.md` 全部内容粘贴进去,作为开场 System Prompt
3. 输入:"请分析 A 股链路",同时粘贴对应 JSON 片段(lite 版的 chains.A 股部分)
4. AI 按 Prompt 规则产出分析
5. 重复 7 次覆盖所有链路

**方式 B · 让 Claude Code 在本地跑(推荐给熟练者)**

在 Claude Code 里直接说:
```
请基于 <lite JSON 路径> 和 prompts/analysis_prompt_v2.2.md,
产出 7 份完整分析到 ./分析_<资产>_<日期>.md。
搜索补充 Bloomberg 港股盈利、CME FedWatch、美联储最新讲话等 JSON 没有的数据。
先跑 2 条(A 股 + 美股)我确认,再补剩余 5 条。
```

**方式 C · 一次性投喂,全部 7 份一起出**

把 System Prompt + 完整 lite JSON 一起给 AI,说:

```
请为以下资产产出分析:A股 / 港股 / 短债 / 中长债 / 美股 / 美债 / 黄金

每个资产一份完整的 markdown 分析,按 Prompt 里的结构写:
信号流 + 全景判断 + 断点展开 + 其余节点 + 后续关注

每份 600-800 字。对于数据搜索补充,参考 Prompt 里的"AI 搜索补充规则"。
```

AI 会一次性产出 7 份 markdown。

**质量检查**(对照 `skills/analysis_writing.md` 的 Checklist):
- 信号流是否带节点名
- 全景判断是否在 100 字以内
- TIPS 是否改用"通胀保值国债"
- 数值比较是否显式写出两边数值
- 是否提到投资建议(不该有)

### 步骤 4 · HTML 展示(当前人工约 10-20 分钟)

> **注:这一步未来要做成 Python 脚本(见 roadmap 的 P2)。当前仍是人工用 AI 编排。**

把 7 份 markdown + `snapshot_YYYY-MM-DD.json`(完整版,含 history)再投给 AI,让它生成 HTML:

```
请参考 samples/html/项目展示_fixed.html 的结构,产出本轮的 HTML 展示页。
包含:Hero + 流程图 + 方法论 + 仪表盘 + 7 链路分析 + 跨链路洞察 + 路线图

每条链路嵌入 3-6 个 sparkline(用 history 字段的数据画)。
A 股默认展开,其他折叠。

最终输出:单文件 HTML,暗色投研终端风。
```

### 步骤 5 · 分发(约 30 秒)

- 把 HTML 发到投研群(目前手动)
- 或者复制 7 份 markdown 到你平时用的报告工具

---

## 文件一览:每天你会接触到的

| 文件 | 每天都要动吗 | 放哪里 |
|------|------------|--------|
| `macro_final_v11.2.xlsx` | ✅ 刷新+保存 | 你本地 |
| `snapshot_YYYY-MM-DD.json` | ✅ 脚本生成 | 你本地/输出目录 |
| `snapshot_YYYY-MM-DD_lite.json` | ✅ 脚本生成 | 你本地/输出目录 |
| `分析_<资产>_YYYY-MM-DD.md` × 7 | ✅ AI 生成 | 你本地 |
| `项目展示_YYYY-MM-DD.html` | ✅ AI 生成 | 你本地 |
| 本仓库文档 | ❌ 只在改项目时动 | GitHub |

---

## 常见问题

### Q1:脚本报"汇总 Sheet 未 recalc"

**原因**:openpyxl 只能读 Excel 里缓存的公式值。如果你 Wind 刷新后没按 Ctrl+S,公式还是旧值。

**解决**:回 Excel,Ctrl+S 保存一下,再跑脚本。

### Q2:某个指标值异常大或异常小

**可能原因 1**:Wind 单位错乱(如把"亿"当"万亿")
**可能原因 2**:节假日/停更,Wind 返回旧数据

**排查**:打开 Excel,看"宏观数据"Sheet 对应行的最近几个数据点,看和历史比是否正常。

### Q3:AI 生成的分析有明显事实错误

常见的是**数值比较错误**(如"1.48% 低于 1.18%")。这是 AI 的典型失误。

**对策**:严格按 `skills/analysis_writing.md` 的 Checklist 过一遍。数值比较必须要求 AI 显式写两边数值或做算术验证。

### Q4:想加新指标/改阈值怎么办?

**不要自己改**(除非你确定知道影响)。找个 AI 对话框,让它按 `skills/excel_maintenance.md` 或 `skills/indicator_management.md` 的流程来改。AI 会先给你方案等你确认。

### Q5:想看历史某天的分析

查 `samples/analyses/` 目录(仓库里有 2026-04-19 的样本)或你本地的产出目录。

### Q6:Claude Code 里怎么让 AI 接手?

在 Claude Code 启动后,发:

> 如果用 Codex,请先读 `AGENTS.md` → `AGENT_PROTOCOL.md`;如果用 Claude,请先读 `CLAUDE.md` → `AGENT_PROTOCOL.md`,然后等我下指令。
> 每次改完文档要按协议在 `changelog/` 加新文件、git commit + push。

AI 就知道怎么工作了。

---

## 每日 Checklist(打印出来贴墙上)

```
☐ 1. Wind 刷新 → Ctrl+S 保存
☐ 2. 跑 Python 脚本,确认两份 JSON 生成
☐ 3. 把 lite JSON + Prompt 投喂 AI,让它产出 7 份分析
☐ 4. 对照 Checklist 检查分析质量
   ☐ 信号流带节点名
   ☐ 全景判断 ≤ 100 字
   ☐ TIPS → 通胀保值国债
   ☐ 数值比较两边都写
   ☐ 无投资建议
☐ 5. 让 AI 产出 HTML 展示页
☐ 6. 发到投研群
```

---

## 维护这套工具链的人是谁

- **使用者(你)**:每天跑流程 + 看产出 + 决定要不要改项目
- **AI(Claude/GPT/Gemini)**:代劳所有代码、公式、文档的具体修改
- **GitHub**:存放所有说明文档,作为"单一真相来源",防止 AI 对话切换时丢失上下文

项目所有的**专业判断**都是你的,AI 只是执行者。遇到方向性决策,AI 会问你,不会自作主张。
