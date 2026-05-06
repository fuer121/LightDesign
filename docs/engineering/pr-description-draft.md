# TASK-017 PR 交付材料草案

- 更新时间：2026-05-06
- 责任角色：orchestrator / writer
- 关联任务：TASK-017
- 基于材料：当前 git diff、`docs/testing-validation/mvp-validation-report.md`、`docs/testing-validation/task-014-apimart-img2img-validation.md`、`docs/testing-validation/task-016-quality-cost-stability.md`、`docs/testing-validation/task-019-real-sampling-report.md`、`TASKS.md`、`DECISIONS.md`
- 说明：本文档仅用于 PR 描述起草，不代表已提交、已创建 PR，也不代表已合并 `main`。当前工作区存在既有未提交与未跟踪项，下面内容仅按现状整理。

## 变更摘要

- 完成 MVP 验证后的 PR 交付材料整理，把当前实现、测试基线、真实 APIMART 验证和文档口径统一到同一版本。
- 结果页正式采用对话式调整方向，保留版本切换与导出能力，不再把早期本地字号/位置微调作为 MVP 必做项。
- 上传商品图片已进入生成链路，mock 路径与真实 APIMART 路径都已完成验证。
- 上传前图片降采样能力已落地（长边 1024，JPEG 0.85，PNG 保持 PNG），用于降低大图 payload 导致的真实调用风险。
- 新增最小自动化测试基线与浏览器冒烟测试，补齐 API、页面和工作台历史的可重复验证能力。
- 已完成真实商品图扩样本最小验证：4 张图 `/api/generate` 真实调用全部成功，并补 1 组真实 `/api/adjust` 对话式链路验证通过。
- 同步更新任务、决策、PRD、页面清单和测试验证文档，使文档基线与当前实现一致。

## 变更范围

### 文档与任务基线

- `DECISIONS.md`
- `INDEX.md`
- `PLANS.md`
- `TASKS.md`
- `README.md`
- `docs/README.md`
- `docs/engineering/README.md`
- `docs/page-design/page-inventory.md`
- `docs/page-design/wireframes.md`
- `docs/product/PRD.md`
- `docs/testing-validation/README.md`
- `docs/testing-validation/mvp-validation-report.md`
- `docs/testing-validation/task-014-apimart-img2img-validation.md`
- `docs/testing-validation/task-016-quality-cost-stability.md`
- `docs/testing-validation/task-019-real-sampling-report.md`

### 工程实现与测试基线

- `lightdesign-app/package.json`
- `lightdesign-app/package-lock.json`
- `lightdesign-app/start.sh`
- `lightdesign-app/src/app/api/generate/route.ts`
- `lightdesign-app/src/app/api/adjust/route.ts`
- `lightdesign-app/src/app/page.tsx`
- `lightdesign-app/src/app/create/page.tsx`
- `lightdesign-app/src/app/generating/page.tsx`
- `lightdesign-app/src/app/result/page.tsx`
- `lightdesign-app/src/app/layout.tsx`
- `lightdesign-app/src/components/ErrorCatcher.tsx`
- `lightdesign-app/vitest.config.ts`
- `lightdesign-app/src/test/setup.ts`
- `lightdesign-app/src/app/api/generate/route.test.ts`
- `lightdesign-app/src/app/api/adjust/route.test.ts`
- `lightdesign-app/src/app/page.test.tsx`
- `lightdesign-app/src/app/create/page.test.tsx`
- `lightdesign-app/src/app/generating/page.test.tsx`
- `lightdesign-app/src/app/result/page.test.tsx`
- `lightdesign-app/e2e/mvp-smoke.spec.ts`
- `lightdesign-app/playwright.config.ts`

### 本次不包含

- 生产部署
- 创建 PR、提交 git、合并 `main`
- 登录、付费、模板库、批量生成
- `/result/[taskId]` 深链详情页
- 更大规模（8-10张以上）真实商品图统计与生产级 SLA 结论

## 验证方式与结果

### TASK-009 最终验收口径

| 验证项 | 方式 | 结果 |
| --- | --- | --- |
| 工程门禁 | `npm run lint` | 通过，`0 errors / 4 warnings` |
| 生产构建 | `npm run build` | 通过 |
| 单元测试 | `npm run test:unit` | 通过，6 个测试文件、11 个用例 |
| 浏览器冒烟 | `npm run test:e2e` | 通过，Playwright chromium 主流程覆盖创建、上传、生成、结果、导出、工作台历史 |
| mock 生成 | `POST /api/generate` 带图片 | 通过，返回 200 且上传图进入后端链路 |
| mock 生成 | `POST /api/generate` 不带图片 | 通过，返回 400，提示“请上传商品图片” |
| mock 调整 | `POST /api/adjust` | 通过，返回 200 |
| 参数校验 | 空卖点 / 空调整指令 | 通过，分别返回 400，提示明确 |
| 真实 APIMART 探针 | `curl` 回退提交 + 轮询 | 通过，拿到图片 URL；未记录 secret 或完整 URL |
| 真实扩样本（4图） | `POST /api/generate` x4 | 通过，4/4 返回 200 且 `remote-url`，无 mock 回退 |
| 真实对话链路 | `POST /api/adjust` x1 | 通过，返回 200 且 `remote-url`，`versionId` 存在 |

### TASK-014 验证结论

- 真实 APIMART 图生图路径可用。
- 真实调用使用 `model: gpt-image-2`、`size: 1:1`、`resolution: APIMART_RESOLUTION 或默认 1k`、`image_urls` 携带 `data:` 图。
- 验证前 `/api/generate` 真实分支未把上传图传给 APIMART；验证后已补齐。

### TASK-015 验证结论

- 已落地 Playwright chromium 一条 MVP 主流程冒烟测试。
- 覆盖范围是 mock 主流程，不访问真实 APIMART。
- 路径包括上传商品图、填写卖点、选择平台/风格、生成、结果页、导出和返回工作台验证最近任务。

### TASK-020 验证结论

- 已在上传页落地上传前降采样：当文件大于 2MB 或长边大于 1024 时触发处理。
- JPEG 输出质量约 0.85，PNG 保持 PNG，不改变现有 API 契约。
- focused 单测 `src/app/create/page.test.tsx` 通过，覆盖大图降采样、小图直通和异常提示。

### TASK-019 验证结论

- 4 张真实商品图调用 `/api/generate` 全部成功，返回远程结果 URL。
- 真实对话式 `/api/adjust` 链路补测通过，返回 `remote-url` 和 `versionId`。
- 最小真实链路（generate + adjust）已收口，可支持当前阶段验收结论。

## 风险与回滚点

- 外部 API 仍是最大风险点。`https.request` 直连路径在当前环境下仍可能命中非 JSON 响应，因此 `curl` 回退仍是必要兜底。
- 结果页当前是会话态页面，不支持 `/result/[taskId]` 深链恢复；刷新或直访历史详情仍有上下文丢失风险。
- 仍保留少量 Next.js `<img>` warnings，短期不阻断验收，但后续应单独收敛。
- 真实调用已完成最小采样，但样本量仍偏小，不应被表述为生产级统计结论。
- 若需要回滚，优先回退 `lightdesign-app/src/app/api/generate/route.ts`、`lightdesign-app/src/app/api/adjust/route.ts`、结果页与测试基线相关文件；文档层回退可单独处理，不影响代码回退判断。

## 可直接用于 PR 的结论

本轮变更将 LightDesign 的 MVP 验证口径收敛到已验收状态：工程门禁、mock/真实生成链路、上传前降采样、自动化测试和浏览器冒烟测试均有证据，且结果页方向已按对话式调整定稿。当前仍保留更大样本统计与深链恢复等后续风险项，适合在 PR 中明确列为未包含范围。

## 建议 Stage 范围

- 建议纳入：`lightdesign-app/`、`docs/`、`TASKS.md`、`PLANS.md`、`INDEX.md`、`DECISIONS.md`、`README.md`
- 明确排除：根目录 `node_modules/`、根目录 `package.json`
