# MVP 本地验证报告

## 文档状态
- 更新时间：2026-05-05
- 责任角色：test / orchestrator
- 关联任务：TASK-009
- 状态：done

---

## 1. 验收结论
TASK-009 已验收通过。工程门禁、上传链路、最小自动化测试、浏览器 E2E 冒烟测试和真实 APIMART 图生图链路均已通过复核。TASK-016 已补充 1 张真实商品图单样本采样；剩余风险集中在扩样本稳定性、成本分布、结果页深链恢复和少量 Next.js `<img>` warning。

原因：
- 结果页当前为 `/result` 会话态页面；DEC-010 已接受对话式调整方向，但 `/result/[taskId]` 详情页和保存模板仍未实现。
- 真实 APIMART 已完成链路可用性验证和 1 张真实商品图单样本采样，尚未完成多类目扩样本质量、成本和稳定性评估。

---

## 2. 已执行验证

| 命令 / 检查 | 结果 | 说明 |
| --- | --- | --- |
| `npm run lint` | 通过 | 0 errors / 4 warnings，剩余为 Next.js `<img>` 性能 warning |
| `npm run build` | 通过 | Next.js 16.2.4 生产构建、TypeScript、静态页面生成通过 |
| mock 模式 `POST /api/generate` 带图片 | 通过 | 返回 200 与 SVG data URL，上传图已进入后端处理链路 |
| mock 模式 `POST /api/generate` 不带图片 | 通过 | 返回 400，错误为“请上传商品图片” |
| mock 模式 `POST /api/adjust` | 通过 | 返回新版本 SVG data URL 与调整 prompt |
| 空卖点调用 `/api/generate` | 通过 | 返回 400，错误为“卖点 1 和卖点 2 为必填项” |
| 空调整指令调用 `/api/adjust` | 通过 | 返回 400，错误为“请输入调整指令” |
| `npm run test:unit` | 通过 | 5 个测试文件，8 个用例，覆盖 API、上传提交、工作台历史、结果页导出、APIMART `image_urls` 请求体 |
| `npm run test:e2e` | 通过 | Playwright chromium 1 条主流程：创建、上传、生成、结果、导出、工作台历史 |
| 真实 APIMART 图生图探针 | 通过 | `curl` 回退提交和轮询成功，返回图片 URL；未记录 secret 或完整 URL |

---

## 3. 通过项
- 生产构建通过，说明当前代码可完成 Next.js build。
- 页面路由已存在：`/`、`/create`、`/generating`、`/result`。
- API 路由已存在：`/api/generate`、`/api/adjust`。
- mock 降级链路可用，便于无 key 本地验证。
- 基础接口参数校验存在。
- 上传商品图片已从前端进入 `/api/generate` 请求，后端可校验并在 mock 结果中使用。
- 真实 APIMART 请求体已携带 `image_urls`，并通过最小真实任务验证。
- `localStorage` 历史任务链路从代码结构上闭环：导出写入最近任务，工作台读取，复用写入创建页预填信息。
- Vitest 最小测试基线已落地：API route、生成页上传提交、工作台历史读取、结果页导出写入均有自动化覆盖。
- Playwright E2E 已覆盖 mock 主流程。

---

## 4. 失败项
- 真实 APIMART 已完成 1 张真实商品图单样本采样，未覆盖多类目质量、成本和长期稳定性。
- `/result` 依赖 `GenContext` 内存态，无法深链访问和恢复历史详情。
- 保存模板能力未独立实现；当前只有最近任务与部分复用参数。
- 早期本地字号/位置微调已被 DEC-010 替代为对话式重新生成，后续需按新口径补测试用例。

---

## 5. 风险
- 外部 API 风险：真实 APIMART 链路可用，但 `https.request` 直连仍不稳定，当前依赖 `curl` 回退。
- 验收口径风险：PRD、早期线框和当前实现存在差异，若不维护基线会导致误判。
- 工程协作风险：当前 lint 已无 error，但 4 个 `<img>` warning 后续可优化。
- 可恢复性风险：结果页不是任务详情页，刷新或直访可能丢失上下文。
- 生产质量风险：真实生成结果的主体保真、文字质量、耗时、成本已有单样本记录，但尚未形成统计。

---

## 6. 下一步建议
1. 若进入生产级验收，在 TASK-016 单样本基础上补 2-4 张真实商品图扩样本、成本记录和稳定性采样。
2. 按需继续优化 4 个 `<img>` warning 和 `/result` 深链恢复能力。

---

## 7. Orchestrator 裁决
- `task_id`：TASK-009
- `owner_role`：test / orchestrator
- `status`：done
- `progress`：已完成只读测试、文档基线更新、TASK-011 工程修复、TASK-012 最小测试基线、TASK-014 真实 APIMART 图生图链路验证、TASK-015 Playwright E2E，并完成主线程复核。
- `deliverables`：本报告、TASKS checkpoint、DECISIONS 更新、页面/工程/测试基线更新。
- `risks`：真实生成质量、成本和长期稳定性已有单样本记录但未形成统计；`/result` 深链恢复未实现；仍有 4 个 `<img>` warning。
- `decision_needed`：无，用户已验收 TASK-009。
- `next_step`：后续按需做生产级质量评估。
- `eta`：已验收。
- `orchestrator 裁决`：通过并完成验收。
