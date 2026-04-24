# [2026-04-24] 稳定 PPT 样例入库

**变更人**:Codex  
**变更类型**:文档更新  
**影响范围**:
- 新增 `samples/ppt/国内宏观传导框架V4_稳定样例.pptx`,作为当前确认的首个稳定 PPT 样例
- 更新 `samples/README.md`,补充 PPT 样例说明和用途
- 更新 `docs/05_file_structure.md`,同步 `samples/ppt/` 样例入口
- 更新 `docs/06_ppt_workflow.md` 和 `skills/ppt_workflow.md`,明确“稳定案例可放入 samples/ppt/”

## 变更内容

本次将用户确认的最新国内宏观框架页正式作为稳定案例入库,放在 `samples/ppt/` 下。同步补齐了样例目录说明和 PPT 入库边界,明确“默认不入库,只有确认后的稳定案例才入样例目录”。

## 同步更新的文档

- 更新了 `samples/README.md`
- 更新了 `docs/05_file_structure.md`
- 更新了 `docs/06_ppt_workflow.md`
- 更新了 `skills/ppt_workflow.md`
- 新增了 `samples/ppt/国内宏观传导框架V4_稳定样例.pptx`

## 风险或遗留问题(如有)

- 当前只确认了国内版稳定案例,美国框架页是否入样例待确认。
- 样例是参考案例,后续若继续修改并替换,需要单独写 changelog。

## 下一步建议(如有)

- 如后续国内框架页继续迭代,优先基于该稳定案例扩展而不是从零重做。
- 美国框架页确认稳定后,可按同样方式补入 `samples/ppt/`。
