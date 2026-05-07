# 指标展示实验台变更日志

## 2026-05-07

- 新建 `projects/indicator_explorer/` 子项目。
- 复制测试 Excel 快照 `macro_final_v11.2_2_safe_formula_fix_2026-05-07.xlsx` 到 `data/`。
- 新增中国侧展示数据包 `data/china_display_data.json`。
- 复制中国侧用到的 42 张 sparkline 小图到 `data/sparklines/`。
- 新增数据整理脚本 `src/build_china_display_data.mjs`。
- 新增 demo 页面 `demo/index.html`,用于验证指标可选展示。
- 新增最小数据转换测试 `test/normalize_china_data.test.mjs`。
