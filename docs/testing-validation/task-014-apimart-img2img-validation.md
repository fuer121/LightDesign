# TASK-014 真实 APIMART 图生图验证记录

## 文档状态
- 更新时间：2026-05-06
- 责任角色：engineer-*
- 关联任务：TASK-014
- 状态：done

---

## 1. 验证目标
- 验证当前环境下真实 APIMART 图生图参数是否可用。
- 明确 `lightdesign-app/src/app/api/generate/route.ts` 当前真实分支是否真的把上传图传给 APIMART。
- 全程不记录、不输出任何 secret 或 `.env` 值。

## 2. 环境结论
- `lightdesign-app/.env.local` 中存在非空 `APIMART_API_KEY`，因此本次不是“无 key 阻塞”场景。
- 当前 shell 进程未直接导出该变量，但 Next.js build 已确认会读取 `.env.local`。

## 3. 真实调用记录

| 检查项 | 结果 | 说明 |
| --- | --- | --- |
| `https.request` 直连提交 | 失败 | 返回非 JSON 响应，命中当前代码里已知的 TLS/CDN 兼容风险，不能据此判定业务参数失败 |
| `curl` 回退提交 `/v1/images/generations` | 通过 | `HTTP/2 200`，`code=200`，返回真实 `task_id` |
| 轮询 `/v1/tasks/{taskId}` | 通过 | `HTTP/2 200`，任务状态 `completed` |
| 是否返回图片 URL | 是 | 轮询完成后拿到图片 URL；文档只记录“有/无”，不记录完整 URL |

本次真实调用使用的参数特征：
- `model: gpt-image-2`
- `size: 1:1`
- `resolution: APIMART_RESOLUTION 或默认 1k`
- `image_urls: [data:image/png;base64,...]`
- 参考图为最小 PNG `data:` 图，仅用于验证图生图参数链路，不用于质量评测

## 4. 代码核对结论
- 真实 APIMART 探针已证明：当前环境下，`image_urls` 携带 `data:` 图可以被 APIMART 接受并完成任务。
- 但验证前的 `/api/generate` 真实分支只提交 `model/prompt/n/size/resolution`，没有把上传图传给 APIMART。
- 这意味着验证前代码即使走到真实 API，也只是“真实文生图”，不能算“真实图生图路径可用”。

## 5. 本次最小修复
- 在 `lightdesign-app/src/app/api/generate/route.ts` 新增 APIMART 请求体构造函数。
- 当上传图存在时，真实分支会把 `uploadedSourceImage.dataUrl` 写入 `image_urls`。
- 补充单测，断言真实请求体包含 `image_urls`，避免后续回归。

## 6. 风险与限制
- 本次只做 1 组最小真实图生图任务验证，不代表稳定性、成本或结果质量已完成评估。
- `https.request` 直连仍可能命中非 JSON 响应；当前代码保留 `curl` 回退是必要的。
- 本次没有记录完整图片 URL，也没有做视觉比对，因此结论只覆盖“参数链路可用”，不覆盖“生成质量达标”。

## 7. 验证结论
- 真实 APIMART 图生图能力：可用。
- 验证前代码状态：不可宣称“上传图参与了真实图生图请求”。
- 验证后代码状态：`/api/generate` 已把上传图带入 APIMART `image_urls`，可进入真实图生图路径。
- 后续 TASK-016 发现并修复了应用路由 URL 拼接丢失 `/v1` 的问题；修复后真实商品图通过 `/api/generate` 返回远程图片 URL。

## 8. Checkpoint
- `task_id`：TASK-014
- `owner_role`：engineer-* / test
- `status`：done
- `progress`：已完成真实 key 条件检查、真实 APIMART 单任务验证、最小代码修复与本地门禁复跑。
- `deliverables`：本验证记录、`lightdesign-app/src/app/api/generate/route.ts`、`lightdesign-app/src/app/api/generate/route.test.ts`
- `risks`：真实生成质量和长期稳定性尚未覆盖；`https.request` 仍依赖 `curl` 回退兜底。
- `decision_needed`：无。
- `next_step`：已进入 TASK-016 单样本真实商品图质量评估；生产级验证前继续扩样本。
- `eta`：已完成。
