# 工程实现

## 目录用途
记录网站实现、接口设计、数据结构、脚本化生成和技术验证材料。

当前阶段已进入工程 MVP 验证，工程文档必须准确反映 `lightdesign-app/` 的实际实现与阻塞项。

## 建议文档
- `architecture-notes.md`：架构草案
- `api-notes.md`：接口草案
- `data-model-notes.md`：数据模型草案
- `prototype-notes.md`：原型验证记录

## 当前重点
- 技术栈基线：Next.js 16.2.4、React 19.2.4、Tailwind CSS v4、TypeScript 5。
- 已实现路由：`/`、`/create`、`/generating`、`/result`、`/api/generate`、`/api/adjust`。
- 生图 API 基线：APIMART GPT Image 2；无 `APIMART_API_KEY` 或调用失败时回退 SVG mock。
- 当前验证：`npm run lint` 0 error / 4 warnings；`npm run build` 通过；`npm run test:unit` 通过；`npm run test:e2e` 通过；mock 模式下 `/api/generate` 带图片返回 200，不带图片返回 400；`/api/adjust` 可返回 200；真实 APIMART 图生图链路已完成最小验证；TASK-016 已完成 1 张真实商品图单样本采样，应用 `/api/generate` 修复后返回真实远程图片 URL。
- 当前风险：真实生成质量、成本和长期稳定性仍需 3-5 张图扩样本验证；结果页深链恢复尚未实现。

## 工程验收前置条件
- `npm run lint` 必须保持 0 error。
- `npm run build` 必须保持通过。
- 上传商品图片必须参与生成请求，并在 mock 与真实 API 路径中分别验证。
- MVP 当前已补齐 API/组件级 Vitest 基线。
- MVP 当前已补齐一条 Playwright chromium 核心流程级 E2E 测试。
- 涉及真实 APIMART key 的验证必须通过环境变量提供，不得写入代码或日志。
