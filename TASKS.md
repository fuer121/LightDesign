# TASKS.md

## 0. 文档状态
- 更新时间：2026-05-07
- 责任角色：orchestrator
- 阶段：工程 MVP 验证

---

## 1. 状态枚举
- `todo`：未开始
- `in_progress`：执行中
- `blocked`：阻塞
- `ready_for_review`：待验收
- `done`：完成

## 2. 角色枚举
- `orchestrator`
- `product`
- `ui`
- `test`
- `engineer-*`

---

## 3. 主任务看板

| task_id | 标题 | owner_role | 状态 | 优先级 | 依赖 | 交付物 |
| --- | --- | --- | --- | --- | --- | --- |
| TASK-000 | 建立最小状态文件模板 | orchestrator | done | P0 | 无 | PLANS.md / TASKS.md / DECISIONS.md / UI_SPEC.md |
| TASK-001 | 建立产品探索目录骨架 | orchestrator | done | P0 | TASK-000 | docs/ 目录结构与索引 |
| TASK-002 | 建立核心用户流程模板 | product | done | P0 | TASK-001 | docs/core-flows/core-user-flow-template.md |
| TASK-003 | 建立图像生成链路设计模板 | product | done | P0 | TASK-002 | docs/generation-pipeline/image-generation-pipeline-template.md |
| TASK-004 | 编写首版 PRD，收敛产品范围与核心流程 | product | done | P0 | TASK-001 | docs/product/PRD.md |
| TASK-005 | 设计核心页面低保真线框与交互状态 | ui | done | P0 | TASK-004 | docs/page-design/wireframes.md, prototype.html |
| TASK-006 | 工程 MVP 骨架搭建 | engineer | done | P0 | TASK-005 | lightdesign-app (Next.js) |
| TASK-007 | 后端生图 API 实现 | engineer | done | P0 | TASK-006 | src/app/api/generate/route.ts |
| TASK-008 | 前端四页面实现 | engineer | done | P0 | TASK-006 | 四个页面 + 公共组件 |
| TASK-009 | MVP 本地验证与复盘 | test | done | P0 | TASK-008 / TASK-010 / TASK-011 / TASK-012 / TASK-014 / TASK-015 | docs/testing-validation/mvp-validation-report.md |
| TASK-010 | 对话式图像调整（结果页重构） | engineer | done | P0 | TASK-008 | /api/adjust + 结果页对话面板 + 版本管理 |
| TASK-011 | 修复 MVP 工程门禁与上传图生图链路 | engineer-* | done | P0 | TASK-009 / DEC-010 | lint 通过 + 上传文件进入生成链路 |
| TASK-012 | 建立 MVP 最小自动化测试基线 | test | done | P0 | TASK-011 | Vitest API / 页面组件测试 |
| TASK-014 | 真实 APIMART 图生图路径验证 | engineer-* / test | done | P1 | TASK-011 / TASK-012 | docs/testing-validation/task-014-apimart-img2img-validation.md |
| TASK-015 | MVP 浏览器 E2E 冒烟测试 | test | done | P1 | TASK-012 | Playwright chromium 主流程测试 |
| TASK-013 | 收敛对话式结果页文档与验收口径 | orchestrator / product / ui | done | P0 | DEC-010 | PRD / 页面清单 / 线框 / UI_SPEC 更新 |
| TASK-016 | 真实商品图质量 / 成本 / 稳定性采样评估 | test / product | ready_for_review | P1 | TASK-009 / TASK-014 | docs/testing-validation/task-016-quality-cost-stability.md |
| TASK-017 | PR 交付材料准备 | orchestrator / writer | done | P1 | TASK-009 | docs/engineering/pr-description-draft.md |
| TASK-018 | 工程遗留风险处理建议 | engineer-* / security-reviewer | done | P1 | TASK-009 | 遗留风险评估报告 |
| TASK-019 | 真实商品图扩样本与对话式调整验证方案 | test / product | done | P1 | TASK-016 | 扩样本测试矩阵与 checkpoint 建议 |
| TASK-020 | 上传前图片压缩 / 降采样实现 | engineer-* | done | P1 | TASK-016 / TASK-019 | create/page.tsx + create/page.test.tsx |
| TASK-021 | 现有网站 UI 高级化重设计派单 | ui / engineer-* | done | P1 | TASK-020 | 页面视觉与交互优化实现 + 验收记录 |
| TASK-022 | 高级官网首页与全站视觉统一 | ui / engineer-* | done | P1 | TASK-021 | 新官网首页 + /dashboard 迁移 + 本地 showcase 资产 + 验证记录 |

---

## 4. 任务卡模板

### TASK-XXX：任务标题
- owner_role：
- status：todo
- 背景：
- 目标：
- 范围内：
- 范围外：
- 输入：
- 输出：
- 验收标准：
- 风险：
- decision_needed：
- next_step：
- eta：

---

## 5. Checkpoint 模板

### CP-XXX：checkpoint 标题
- task_id：
- owner_role：
- status：
- progress：
- deliverables：
- risks：
- decision_needed：
- next_step：
- eta：
- orchestrator 裁决：通过并继续 / 退回补充 / 升级讨论 / 暂停

---

## 6. 当前任务拆分

### TASK-004：编写首版 PRD
- owner_role：product
- status：done
- 背景：项目方向已定为"AI 电商产品图与海报生成网站"，但尚未收敛到具体可执行的首版范围
- 目标：产出一份精简 PRD，卡死首版场景、范围和成功标准
- 输出：docs/product/PRD.md
- 验收标准：读者能准确说出"帮谁解决什么问题、首版做到什么程度、什么明确不做"
- 风险：场景选择过宽导致后续工程发散
- decision_needed：无
- next_step：已进入工程 MVP 验证阶段
- eta：已交付

### TASK-005：设计核心页面低保真线框与交互状态
- owner_role：ui
- status：done
- 背景：PRD 已确认，首版范围已锁定。需要在进入工程前定义页面布局、组件层级和交互状态。
- 目标：产出 4 个核心页面的低保真线框，涵盖空态、加载、成功、失败和边界状态。
- 输出：docs/page-design/wireframes.md
- 验收标准：开发者能据此开始搭建页面骨架，不需要额外猜测布局或状态处理。
- 风险：未定义响应式行为可能导致移动端体验不一致。对策：P3 工程阶段补充断点设计。
- decision_needed：对话式调整是否正式替代本地微调，需要产品确认
- next_step：根据当前实现更新页面基线或补齐原线框能力
- eta：已交付

### TASK-009：MVP 本地验证与复盘
- owner_role：test
- status：done
- 背景：工程 MVP 已实现，需验证是否满足首版 PRD、页面线框和工程质量门禁。
- 目标：完成 MVP 本地验证，明确可验收项、失败项、阻塞项和下一步修复优先级。
- 范围内：`npm run lint`、`npm run build`、`npm run test:unit`、`npm run test:e2e`、mock 模式 API 验证、真实 APIMART 图生图链路验证、页面路由连通性、文档与实现一致性检查。
- 范围外：真实生成质量/成本/稳定性评估、生产部署、main 合并。
- 输入：`lightdesign-app/` 当前实现、PRD、页面线框、UI_SPEC、测试清单。
- 输出：`docs/testing-validation/mvp-validation-report.md`
- 验收标准：lint/build/API/页面流程均有证据；失败项可定位到文件或任务；给出是否可验收结论。
- 风险：真实生成质量、成本和长期稳定性已有 TASK-016 单样本记录但未形成统计；仍有 4 个 `<img>` lint warning。
- decision_needed：无，用户已验收 TASK-009。
- next_step：如需继续推进，进入真实商品图质量 / 成本 / 稳定性采样评估。
- eta：已验收。

### CP-009：MVP 本地验证 checkpoint
- task_id：TASK-009
- owner_role：test / orchestrator
- status：done
- progress：测试 agent 已完成只读测试；TASK-011 已完成工程门禁与上传链路修复；TASK-012 已落地 Vitest 最小测试基线；TASK-014 已完成真实 APIMART 图生图链路验证；TASK-015 已落地 Playwright E2E；主线程复核 lint/build/unit/e2e 通过。
- deliverables：`docs/testing-validation/mvp-validation-report.md`
- risks：真实生成质量、成本和长期稳定性已有 TASK-016 单样本记录但未形成统计；仍有 4 个 `<img>` lint warning。
- decision_needed：无。
- next_step：如需生产级验证，继续做真实商品图扩样本质量评估和稳定性评估。
- eta：已验收。
- orchestrator 裁决：通过并完成验收。

### TASK-011：修复 MVP 工程门禁与上传图生图链路
- owner_role：engineer-*
- status：done
- 背景：TASK-009 验证显示 `npm run lint` 未通过，且上传商品图片未进入 `/api/generate` 生成链路。
- 目标：让 MVP 达到可复测的工程基线。
- 范围内：修复 lint error；让前端提交上传文件；后端读取上传文件并在 APIMART 支持时传入图生图请求；mock 模式保持可用；保持 `npm run build` 通过。
- 范围外：账号、付费、模板库、生产部署、main 合并。
- 输入：TASK-009 测试报告、DEC-010 结果页方向、当前 `lightdesign-app/` 代码。
- 输出：代码变更、验证命令结果、风险说明。
- 验收标准：`npm run lint` 通过；`npm run build` 通过；无 key mock 生成仍可用；有上传文件时请求链路不丢文件；不泄露环境变量。
- 风险：APIMART 图生图接口参数需以当前实现和实际返回为准，真实 key 路径仍需单独验证。
- decision_needed：若 APIMART 上传图参数不明确，先实现本地链路与 mock，真实 API 参数作为后续小任务确认。
- next_step：进入 TASK-012 自动化测试。
- eta：已完成。

### TASK-012：建立 MVP 最小自动化测试基线
- owner_role：test
- status：done
- 背景：当前缺少测试文件和 `test` script，TASK-009 只能依赖手工命令与代码证据。
- 目标：沉淀可重复执行的最小测试基线。
- 范围内：API 参数校验测试、mock 成功路径测试、核心页面流程测试方案；必要时补测试脚本。
- 范围外：真实 APIMART key 稳定性测试、全量浏览器矩阵、性能压测。
- 输入：TASK-011 修复结果、当前 MVP 验收报告。
- 输出：`vitest.config.ts`、`src/test/setup.ts`、API route 测试、页面组件测试、`test:unit` 脚本。
- 验收标准：测试命令可重复运行；覆盖 `/api/generate`、`/api/adjust` 和至少一条创建-生成-结果-导出流程。
- 风险：当前 E2E 只覆盖 mock 主流程，不覆盖真实 APIMART 质量。
- decision_needed：无。
- next_step：按需扩展更多浏览器场景。
- eta：已完成。

### TASK-014：真实 APIMART 图生图路径验证
- owner_role：engineer-* / test
- status：done
- 背景：TASK-011 已打通上传文件到后端和 mock 生成链路，但真实 APIMART 图生图参数与线上返回尚未完成验证。
- 目标：在用户通过环境变量提供真实 key 的前提下，验证上传商品图参与真实图生图请求。
- 范围内：真实 key 环境下 `/api/generate` 上传图片验证、失败返回记录、耗时与结果质量记录。
- 范围外：记录或泄露任何 secret、生产发布、成本优化。
- 输入：`APIMART_API_KEY`、`APIMART_RESOLUTION`（可选）、TASK-011 当前 API 实现。
- 输出：真实 API 验证报告和必要修复建议。
- 验收标准：明确真实 APIMART 图生图是否可用；若不可用，错误原因可复现且不含 secret。
- 风险：外部 API 文档或参数可能与当前实现不一致。
- decision_needed：用户需通过环境变量提供真实 key 并允许调用外部 API。
- next_step：如需生产级验收，补真实商品图质量、成本和稳定性评估。
- eta：已完成。

### TASK-015：MVP 浏览器 E2E 冒烟测试
- owner_role：test
- status：done
- 背景：TASK-012 已落地 Vitest API/组件测试，但真实浏览器中的跨页交互、文件上传、导出与 `localStorage` 仍未自动化覆盖。
- 目标：使用 Playwright bundled chromium 建立一条 MVP 主流程冒烟测试。
- 范围内：上传商品图、填写卖点、选择平台/风格、生成 mock 结果、进入结果页、导出、返回工作台验证最近任务。
- 范围外：真实 APIMART key 调用、视觉像素级比对、全浏览器矩阵、性能压测。
- 输入：当前 `lightdesign-app/`、`test:unit` 基线、mock 无 key生图路径。
- 输出：`playwright.config.ts`、`e2e/mvp-smoke.spec.ts`、`test:e2e` 脚本、执行结果。
- 验收标准：可通过 `npm run test:e2e` 或等价命令运行；不依赖系统 Chrome channel；不访问真实 APIMART。
- 风险：当前只覆盖 mock 主流程，不覆盖真实 APIMART 质量。
- decision_needed：无。
- next_step：按需扩展更多浏览器场景。
- eta：已完成。

### TASK-013：收敛对话式结果页文档与验收口径
- owner_role：orchestrator / product / ui
- status：done
- 背景：DEC-010 已确认结果页正式采用对话式调整，需要同步 PRD、页面清单、线框说明和 UI 验收口径。
- 目标：让文档基线与当前产品方向一致。
- 范围内：PRD 下一步、页面清单、线框历史说明、测试验收标准。
- 范围外：代码实现与测试脚本。
- 输入：DEC-010、TASK-009 测试报告、当前结果页实现。
- 输出：更新后的文档基线。
- 验收标准：文档不再把“本地字号/位置微调”作为结果页必做验收项；对话式调整能力有清晰验收标准。
- 风险：若 UI_SPEC 与实现仍有差异，后续需要继续拆小任务。
- decision_needed：无。
- next_step：后续文档更新随 TASK-012 复测结果同步。
- eta：已完成。

### TASK-016：真实商品图质量 / 成本 / 稳定性采样评估
- owner_role：test / product
- status：ready_for_review
- 背景：TASK-009 已验收，但真实 APIMART 仅完成链路可用性验证，尚未评估生成质量、成本和稳定性。
- 目标：用少量真实或代表性商品图验证主体保真、文字可读性、耗时、失败率和单次成本估算。
- 范围内：采样方案、可用素材盘点、最小真实调用验证、质量评分表、成本/耗时记录。
- 范围外：大规模压测、付费模型设计、生产 SLA 承诺。
- 输入：当前 `lightdesign-app/`、TASK-014 验证记录、可用商品图素材。
- 输出：`docs/testing-validation/task-016-quality-cost-stability.md`
- 验收标准：至少明确“是否有足够真实素材”“是否完成真实采样”“质量/成本/稳定性风险是否可接受”。
- 风险：当前仅 1 张真实商品图，无法代表多类目稳定性；真实 API 调用已产生外部成本。
- decision_needed：是否继续补充 2-4 张代表性商品图进入扩样本验证。
- next_step：复跑测试门禁后交付本轮 checkpoint；扩样本验证待素材。
- eta：本轮单样本验证完成，待验收。

### TASK-017：PR 交付材料准备
- owner_role：orchestrator / writer
- status：done
- 背景：TASK-009 已验收，项目进入 PR 交付准备阶段。
- 目标：整理本轮变更摘要、范围、验证结果、风险与回滚点，形成可直接用于 PR 的描述草案。
- 范围内：文档变更、工程变更、测试变更、验证命令、剩余风险、回滚建议。
- 范围外：创建 PR、提交 git、合并 main。
- 输入：当前 git diff、TASK-009/014/015 验收记录。
- 输出：`docs/engineering/pr-description-draft.md`
- 验收标准：PR 描述包含 task_id、变更摘要、变更范围、验证方式与结果、风险与回滚点。
- 风险：当前工作区包含既有未提交改动，需要明确哪些属于本轮交付。
- decision_needed：无。
- next_step：PR 创建前确认 stage 范围，排除根目录误生成的 `node_modules/` 和根 `package.json`。
- eta：已完成。

### TASK-018：工程遗留风险处理建议
- owner_role：engineer-* / security-reviewer
- status：done
- 背景：TASK-009 验收后仍有 4 个 `<img>` warning、`npm audit` moderate vulnerabilities、`/result` 深链恢复未实现。
- 目标：评估这些遗留项的优先级、修复成本和建议拆分方式。
- 范围内：`<img>` warning 是否应替换为 `next/image`、依赖漏洞审计、`/result` 深链恢复的实现方案。
- 范围外：大规模重构、直接合并 main、未经确认的依赖强制升级。
- 输入：当前 `lightdesign-app/`、`npm audit` 输出、Next.js 图片使用点、结果页状态管理。
- 输出：遗留风险处理建议。
- 验收标准：每个遗留项有建议动作、风险等级、是否建议立即修复。
- 风险：`npm audit fix --force` 可能引入破坏性升级，默认不得执行。
- decision_needed：无，当前结论为不阻塞 TASK-009/PR；不要误 stage 根目录 `node_modules/` 和根 `package.json`。
- next_step：后续拆分依赖升级、`<img>` 性能优化和 `/result` 深链恢复任务。
- eta：已完成。

### TASK-019：真实商品图扩样本与对话式调整验证方案
- owner_role：test / product
- status：done
- 背景：TASK-016 已完成 1 张真实商品图单样本采样，但样本量不足，且真实 `/api/adjust` 远程图链路尚未单独验收。
- 目标：定义下一轮 3-5 张真实商品图扩样本验证方案，覆盖质量、耗时、失败率、成本风险和对话式调整链路。
- 范围内：扩样本测试矩阵、真实外部调用数量控制、质量评分维度、checkpoint 字段建议。
- 范围外：立即执行真实外部调用、大规模压测、生产 SLA 承诺。
- 输入：TASK-016 报告、当前 `/api/generate` 与 `/api/adjust` 实现、用户可提供的商品图素材。
- 输出：扩样本验证方案与 TASK-019 checkpoint 建议。
- 验收标准：明确需要几张图、每张图怎么测、是否调用真实 API、如何记录成本/耗时/失败率。
- 风险：真实调用会产生外部成本；缺少更多素材会导致任务转为 blocked。
- decision_needed：无。
- next_step：进入 PR 汇总与后续任务（如需再扩样本可另开任务）。
- eta：已完成并验收。

### TASK-020：上传前图片压缩 / 降采样实现
- owner_role：engineer-*
- status：done
- 背景：TASK-016 发现 5712x3213、约 4.2MB 原图会增加 data URL payload 与外部请求不稳定风险；缩放后真实路由可用。
- 目标：在前端上传前完成必要的图片降采样，降低失败率、耗时和外部 API payload 风险。
- 范围内：`create/page.tsx` 上传处理；新增或更新 `create/page.test.tsx`；长边 1024、JPEG 约 0.85、PNG 保持 PNG。
- 范围外：修改 API 契约、引入重型图片处理依赖、服务端持久化资产、真实外部 API 调用。
- 输入：`lightdesign-app/src/app/create/page.tsx`、`/api/generate` 上传限制、TASK-016 采样记录。
- 输出：上传前降采样实现与 focused 单测。
- 验收标准：大图会被降采样后进入 context 和预览；小图保持原文件；处理失败有明确错误提示；相关单测通过。
- 风险：压缩可能损伤商品细节；浏览器端 canvas 处理需兼容大图和移动端内存。
- decision_needed：无，已裁决立即实现。
- next_step：用户验收后可作为 TASK-019 扩样本验证前置条件。
- eta：已验收。

### TASK-021：现有网站 UI 高级化重设计派单
- owner_role：ui / engineer-*
- status：done
- 背景：当前功能链路已完成 MVP 验收，但页面视觉质感、排版层级和交互状态仍有“模板化”特征。
- 目标：基于 `redesign-existing-projects` 技能对现有网站做高质量 UI 升级，在不破坏功能前提下提升品牌感与可用性。
- 范围内：保留现有 Next.js + Tailwind 体系；优化首页、创建页、结果页的排版、色彩层级、背景深度、按钮状态、可访问性细节。
- 范围外：重写业务逻辑、迁移技术栈、修改 API 契约、引入无必要大型依赖。
- 输入：`lightdesign-app/src/app/*.tsx`、`lightdesign-app/src/app/globals.css`、现有交互流与验收口径。
- 输出：UI 升级代码变更、验证结果、设计诊断与修复说明。
- 验收标准：功能不回归；视觉层级显著改善；交互态（hover/active/focus）完整；桌面/移动可用。
- 风险：样式改动涉及多页，需重点防止可点击区域、文字可读性和状态逻辑回归。
- decision_needed：无。
- next_step：进入后续体验验收与 PR 补充说明同步。
- eta：已完成。

### TASK-022：高级官网首页与全站视觉统一
- owner_role：ui / engineer-*
- status：done
- 背景：用户已接受“对话式调整”作为结果页正式方向，并要求将 `/` 从工作台升级为高级感官网首页，强化品牌展示、效果证明和开始创作入口。
- 目标：实现 Pristine Light Mode + Quiet Premium Neutral 风格官网首页，原工作台迁移到 `/dashboard`，并保持创建、生成、结果页视觉语言一致。
- 范围内：`/` 6 分区首页；Header Logo / 工作台 / 开始创作路由调整；本地 showcase 静态资源；`/dashboard` 工作台迁移；创建页与结果页返回工作台路径更新；单测与 E2E 路由断言更新。
- 范围外：新增运行时外部图片请求；新增依赖；`/result/[taskId]` 深链；修改 API、context、生成或调整业务逻辑。
- 输入：用户提供的 TASK-022 方案、4 张真实商品图、本轮 TASK-021 UI 基线。
- 输出：`lightdesign-app/src/app/page.tsx`、`lightdesign-app/src/app/dashboard/page.tsx`、`lightdesign-app/public/showcase/*`、Header / create / result / test / e2e 更新、PR 草案更新。
- 验收标准：首页 3 秒内表达“高质量电商图生成网站”；桌面和移动端“开始创作”显眼且可点击；showcase 至少 4 类商品图并可横向滚动；原工作台可在 `/dashboard` 使用；生成、调整、导出流程不回归。
- 风险：大幅首页视觉改造需重点验证移动端 fixed CTA 是否遮挡内容；直接访问 `/result` 仍是会话态限制。
- decision_needed：无，用户已明确批准执行该方案。
- next_step：执行 unit / e2e / lint / build 与浏览器桌面、移动走查；作为 PR #1 follow-up commit 推送。
- eta：已完成。

### CP-016：真实商品图采样评估 checkpoint
- task_id：TASK-016
- owner_role：test / product
- status：ready_for_review
- progress：已使用用户提供的真实商品图完成单样本采样；direct APIMART 成功返回真实结果；修复应用路由 URL 拼接和 curl 传参后，`/api/generate` 返回真实远程图片 URL。
- deliverables：`docs/testing-validation/task-016-quality-cost-stability.md`；`lightdesign-app/src/app/api/generate/route.ts`；`lightdesign-app/src/app/api/adjust/route.ts`
- risks：样本量不足，不能代表生产稳定性；原始大图仍建议增加前端压缩；真实 `/api/adjust` 仍需用远程图补测。
- decision_needed：是否继续提供 2-4 张代表性商品图进入扩样本验证。
- next_step：复跑 unit / lint / build 后交付 checkpoint。
- eta：本轮验证完成，待验收。
- orchestrator 裁决：通过并进入验收；生产级验证前需扩样本。

### CP-017：PR 交付材料 checkpoint
- task_id：TASK-017
- owner_role：orchestrator / writer
- status：done
- progress：已生成 PR 描述草案。
- deliverables：`docs/engineering/pr-description-draft.md`
- risks：当前工作区有根目录误生成的 `node_modules/` 和根 `package.json`，不得误纳入 PR。
- decision_needed：无。
- next_step：创建 PR 前确认 stage 范围。
- eta：已完成。
- orchestrator 裁决：通过。

### CP-018：工程遗留风险 checkpoint
- task_id：TASK-018
- owner_role：engineer-* / security-reviewer
- status：done
- progress：已完成 `<img>` warning、npm audit、`/result` 深链恢复和 PR 卫生评估。
- deliverables：遗留风险评估报告。
- risks：`<img>` warning 为低风险；npm audit moderate 为上游依赖链风险；`/result` 深链恢复为中风险产品能力缺口；根目录误生成文件是 PR 卫生风险。
- decision_needed：无。
- next_step：后续拆分依赖升级、性能优化、结果页恢复能力。
- eta：已完成。
- orchestrator 裁决：通过。

### CP-019：扩样本验证方案派单 checkpoint
- task_id：TASK-019
- owner_role：test / product
- status：done
- progress：已按用户授权执行 4 次真实 `/api/generate` 外部调用（冰淇淋、篮球鞋、键盘、徒步背包）；4/4 返回 200 且 `imageUrlKind=remote-url`，无 mock 回退。并补 1 次真实 `/api/adjust` 链路验证（含 1 次 generate 前置），返回 200 且 `imageUrlKind=remote-url`。
- deliverables：`/tmp/task019-real-sampling-4cases.json`，以及 `docs/testing-validation/task-019-real-sampling-report.md`。
- risks：接口响应不返回单次价格明细，成本仍需按调用次数控制。
- decision_needed：无。
- next_step：维持当前结论，必要时再开更大样本任务。
- eta：已完成。
- orchestrator 裁决：通过并完成。

### CP-020：上传前压缩方案派单 checkpoint
- task_id：TASK-020
- owner_role：engineer-*
- status：done
- progress：已完成上传前长边 1024 降采样实现；大图按比例 canvas 降采样，JPEG quality 0.85，PNG 保持 PNG；小图保持原文件；处理失败显示明确错误。
- deliverables：`lightdesign-app/src/app/create/page.tsx`；`lightdesign-app/src/app/create/page.test.tsx`
- risks：压缩策略若过强会影响主体细节；若过弱则无法降低 payload 风险。
- decision_needed：无。
- next_step：后续 TASK-019 扩样本应基于该上传压缩链路执行。
- eta：已验收。
- orchestrator 裁决：通过并完成。

### CP-021：UI 重设计派单 checkpoint
- task_id：TASK-021
- owner_role：ui / engineer-*
- status：done
- progress：已完成 Scan -> Diagnose -> Fix。工作台/创建页/生成页/结果页完成 UI 升级；统一交互态、增强表面层次、补充可访问性 alt 文本、保持现有业务链路不变。
- deliverables：`lightdesign-app/src/app/globals.css`、`lightdesign-app/src/app/page.tsx`、`lightdesign-app/src/app/create/page.tsx`、`lightdesign-app/src/app/generating/page.tsx`、`lightdesign-app/src/app/result/page.tsx`
- risks：样式层改动覆盖范围较大，需防止功能和可读性回归。
- decision_needed：无。
- next_step：进入视觉走查与用户体验确认；按需再拆分微调任务。
- eta：已完成。
- orchestrator 裁决：通过并完成。

### CP-022：高级官网首页与全站视觉统一 checkpoint
- task_id：TASK-022
- owner_role：orchestrator / ui / engineer-*
- status：done
- progress：已按 6 个 section 参考方向实现官网首页：Hero、Showcase、Workflow、Quality proof、Use cases、Final CTA；原工作台迁移至 `/dashboard`；Header 增加工作台入口与开始创作 CTA；功能页保留原业务逻辑，仅同步路由与视觉语义。
- deliverables：`lightdesign-app/src/app/page.tsx`、`lightdesign-app/src/app/dashboard/page.tsx`、`lightdesign-app/public/showcase/icecream.png`、`lightdesign-app/public/showcase/sneakers.png`、`lightdesign-app/public/showcase/keyboard.png`、`lightdesign-app/public/showcase/backpack.png`、相关测试与 PR 草案更新。
- risks：`/result` 仍依赖当前会话态，刷新或直访恢复能力不在本任务范围；本地商品图资产增加仓库体积约 3.4MB。
- decision_needed：无。
- next_step：完成自动化验证与浏览器走查后推送 follow-up commit 到现有 PR。
- eta：已完成。
- orchestrator 裁决：通过并进入 PR follow-up 交付。

---

## 7. 验收清单
- [x] 每个任务都有唯一 `task_id`。
- [x] 每个任务都有明确 owner、状态、输出和验收标准。
- [x] 产品、UI、测试、工程角色的输入输出边界清晰。
- [x] 关键结论同步到 DECISIONS.md。
- [x] UI 或生成流程变更同步到 UI_SPEC.md。
