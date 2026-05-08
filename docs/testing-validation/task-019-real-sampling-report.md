# TASK-019 真实商品图扩样本调用记录（4次）

## 文档状态
- 更新时间：2026-05-06
- 责任角色：test / orchestrator
- 关联任务：TASK-019
- 状态：done

---

## 1. 执行范围
- 按用户授权执行最小 4 次真实外部调用。
- 完成 4 次 `/api/generate` 扩样本。
- 在“继续”指令下补 1 组真实对话式链路验证：1 次 `/api/generate` + 1 次 `/api/adjust`。

## 2. 输入素材
- `/Users/fuer/Downloads/冰淇淋.png`
- `/Users/fuer/Downloads/篮球鞋.png`
- `/Users/fuer/Downloads/键盘.png`
- `/Users/fuer/Downloads/徒步背包.png`

## 3. 4张图扩样本结果（`/api/generate`）

| 样本 | 接口 | HTTP | 耗时(ms) | 返回类型 | 结果 |
| --- | --- | --- | --- | --- | --- |
| 冰淇淋 | `/api/generate` | 200 | 52718 | remote-url | 成功 |
| 篮球鞋 | `/api/generate` | 200 | 51819 | remote-url | 成功 |
| 键盘 | `/api/generate` | 200 | 46566 | remote-url | 成功 |
| 徒步背包 | `/api/generate` | 200 | 40057 | remote-url | 成功 |

汇总：
- 成功率：4/4（100%）
- mock 回退：0 次
- 平均耗时：47790 ms（约 47.8 秒）
- 最长耗时：52718 ms
- 最短耗时：40057 ms

## 4. 对话式链路补测（`/api/generate` + `/api/adjust`）

| 步骤 | 接口 | HTTP | 耗时(ms) | 返回类型 | 结果 |
| --- | --- | --- | --- | --- | --- |
| G5 | `/api/generate`（键盘） | 200 | 50204 | remote-url | 成功 |
| A1 | `/api/adjust`（基于 G5 结果） | 200 | 51713 | remote-url | 成功 |

补测结论：
- 真实对话式调整链路已覆盖并通过。
- `versionId` 正常返回。

## 5. 证据文件
- 原始结果：`/tmp/task019-real-sampling-4cases.json`
- 对话式补测：`/tmp/task019-adjust-validation.json`

## 6. 结论
- 在 TASK-020 上传前降采样已落地的前提下，4 张真实商品图调用全部返回远程结果，链路稳定性较上轮单样本更可信。
- 真实 `/api/adjust` 远程图链路已补测通过，因此 TASK-019 可收口为 `done`。

## 7. 下一步建议
1. 如需更高置信度，可继续扩展到 8-10 张跨类目样本并记录缺陷类型分布。
2. 在 PR 说明中明确本轮真实调用总量与成功率，便于后续成本评估。
