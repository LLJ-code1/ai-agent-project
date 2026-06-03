# 指标展示实验台变更日志

## 2026-06-01

- 迁入 `products/display_html/indicator_explorer/`,作为展示 HTML 产品线下的观察台/选指标模块。
- 保留原有 demo、展示 JSON、测试 Excel 快照、脚本和测试。
- 更新 README / workflow 中的路径和定位:观察台服务于日报 PPT 选指标,但不属于日报最终交付产物。

## 2026-05-07

- 新建 `projects/indicator_explorer/` 子项目。
- 复制测试 Excel 快照 `macro_final_v11.2_2_safe_formula_fix_2026-05-07.xlsx` 到 `data/`。
- 新增中国侧展示数据包 `data/china_display_data.json`。
- 复制中国侧用到的 42 张 sparkline 小图到 `data/sparklines/`。
- 新增数据整理脚本 `src/build_china_display_data.mjs`。
- 新增 demo 页面 `demo/index.html`,用于验证指标可选展示。
- 新增最小数据转换测试 `test/normalize_china_data.test.mjs`。
- 将 `价格` 指标并入 `需求`,页面组名保持为 `需求`。
- 从测试 Excel 的 `宏观数据` Sheet 抽取真实历史序列写入 JSON。
- 将指标卡片改为 SVG 折线图,增加横纵坐标、网格线、点位和最新值标注。
- 新增时间区间切换:`近3期`、`近6期`、`近12期`、`全部`。
- 补齐日度数据读取:接入 `指数走势` 与 `A股成交额换手率测试1`,让资产、资金面、银行间流动性等指标也能展示真实历史折线。
- 新增日度序列测试,覆盖 DR007、A股成交额、北向成交、两融余额、南向资金、指数、PE、信用利差等指标。
