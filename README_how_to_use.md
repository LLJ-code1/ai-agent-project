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

### 步骤 3 · 生成内容观点包(约 2-5 分钟)

当前建议先生成统一观点包,再给 HTML、PPT 或飞书摘要使用。

参考文件:

- `products/content_viewpoint/workflow.md`
- `products/content_viewpoint/prompts/viewpoint_prompt.md`
- `products/content_viewpoint/schemas/viewpoint_pack.schema.json`

有两种方式让 AI 生成观点包,选一种顺手的:

**方式 A · 在 Claude / GPT 对话里生成观点包(推荐给新手)**

1. 新开一个 AI 对话
2. 把 `products/content_viewpoint/prompts/viewpoint_prompt.md` 全部内容粘贴进去
3. 粘贴 `snapshot_YYYY-MM-DD_lite.json`
4. 要求 AI 按 schema 输出 `viewpoint_pack`

**方式 B · 让 Claude Code 在本地跑(推荐给熟练者)**

在 Claude Code 里直接说:
```
请基于 <lite JSON 路径> 和 products/content_viewpoint/prompts/viewpoint_prompt.md,
按 products/content_viewpoint/schemas/viewpoint_pack.schema.json
生成 viewpoint_pack_<日期>.json 和 Markdown 审阅版。
先产出草稿,我确认字段后再做下游 HTML/PPT。
```

**质量检查**(对照 `skills/analysis_writing.md` 的 Checklist):
- 每条观点是否有 evidence
- 客户经理可转述版是否回答"经济怎么样 / 为什么 / 对市场有什么影响"
- PPT 短句是否能放入日报版式
- TIPS 是否改用"通胀保值国债"
- 数值比较是否显式写出两边数值
- 是否超出 JSON 做归因

### 步骤 4 · HTML 展示(当前人工约 10-20 分钟)

> **注:这一步未来要做成 Python 脚本(见 roadmap 的 P2)。当前仍是人工用 AI 编排。**

把 `viewpoint_pack_YYYY-MM-DD.json` + `snapshot_YYYY-MM-DD.json`(完整版,含 history)再投给 AI,让它生成 HTML:

```
请参考 products/display_html/full_dashboard/项目展示_fixed.html 的结构,产出本轮的 HTML 展示页。
包含:Hero + 流程图 + 方法论 + 仪表盘 + 7 链路分析 + 跨链路洞察 + 路线图

每条链路嵌入 3-6 个 sparkline(用 history 字段的数据画)。
A 股默认展开,其他折叠。

最终输出:单文件 HTML,暗色投研终端风。
```

### 步骤 5 · 分发(约 30 秒)

- 把 HTML 发到投研群(目前手动)
- 或者复制 `viewpoint_pack` 里的客户经理可转述版 / PPT 短句到你平时用的报告工具

---

## 文件一览:每天你会接触到的

| 文件 | 每天都要动吗 | 放哪里 |
|------|------------|--------|
| `macro_final_v11.2.xlsx` | ✅ 刷新+保存 | 你本地 |
| `snapshot_YYYY-MM-DD.json` | ✅ 脚本生成 | 你本地/输出目录 |
| `snapshot_YYYY-MM-DD_lite.json` | ✅ 脚本生成 | 你本地/输出目录 |
| `viewpoint_pack_YYYY-MM-DD.json` | ✅ AI 生成 | 你本地 |
| `viewpoint_pack_YYYY-MM-DD.md` | ✅ AI 生成 | 你本地 |
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
☐ 3. 把 lite JSON + Prompt 投喂 AI,让它产出观点包
☐ 4. 对照 Checklist 检查观点质量
   ☐ 每条观点绑定证据
   ☐ 全景判断 ≤ 100 字
   ☐ TIPS → 通胀保值国债
   ☐ 数值比较两边都写
   ☐ 不使用绝对化配置建议
☐ 5. 让 AI 产出 HTML 展示页
☐ 6. 发到投研群
```

---

## 维护这套工具链的人是谁

- **使用者(你)**:每天跑流程 + 看产出 + 决定要不要改项目
- **AI(Claude/GPT/Gemini)**:代劳所有代码、公式、文档的具体修改
- **GitHub**:存放所有说明文档,作为"单一真相来源",防止 AI 对话切换时丢失上下文

项目所有的**专业判断**都是你的,AI 只是执行者。遇到方向性决策,AI 会问你,不会自作主张。
