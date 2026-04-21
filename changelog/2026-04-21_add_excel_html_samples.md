# [2026-04-21] 补入核心 Excel 样例和 HTML 展示样例

**变更人**:Codex + 用户
**变更类型**:新增功能 / 文档更新
**影响范围**:
- 新增 `macro_final_v11.2.xlsx` 作为当前核心 Excel 样例文件
- 新增 `samples/html/项目展示_fixed.html` 作为首轮 HTML 展示样例
- 更新 `.gitignore`,允许当前 Excel 样例和 samples/html 下的 HTML 样例入库
- 更新 `README.md` 的当前状态、仓库结构和数据资产说明
- 更新 `docs/05_file_structure.md` 的文件清单和数据资产分类
- 更新 `samples/README.md` 的 HTML 样例说明
- 更新 `changelog/README.md` 的变更索引

## 变更内容

用户希望新接手者只看 GitHub 仓库也能理解项目真实结构,因此本轮把当前核心 Excel 样例和首轮 HTML 展示样例纳入仓库。Excel 用于理解真实 Sheet、公式、节点权重和链路信号,HTML 用于理解最终交付页面形态。

## 同步更新的文档

- 更新了 `README.md` 的当前状态、仓库结构和数据资产说明
- 更新了 `docs/05_file_structure.md` 的根目录、samples 目录和数据资产分类
- 更新了 `samples/README.md` 的 HTML 展示样例说明
- 更新了 `changelog/README.md` 的变更索引

## 风险或遗留问题(如有)

- Excel 是二进制文件,Git 不能展示单元格级别 diff。后续如果只是 Wind 日常刷新,不建议每次提交 Excel。
- `samples/html/项目展示_fixed.html` 是特定时点展示样例,不代表每日最新数据。

## 下一步建议(如有)

- 后续如果正式升级 Excel 结构或公式,再更新 `macro_final_v11.2.xlsx` 或新增更高版本样例,并同步 changelog。
