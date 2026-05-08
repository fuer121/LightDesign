# DECISIONS.md

## 0. 文档状态
- 更新时间：2026-05-05
- 责任角色：orchestrator
- 阶段：工程 MVP 验证

---

## 1. 记录规则
1. 只记录会影响产品方向、协作流程、UI 规范、技术路径或交付方式的决策。
2. 每条决策必须包含背景、选项、结论、影响和回看条件。
3. 决策状态使用：`proposed` / `accepted` / `rejected` / `superseded`。
4. 被替代的决策不得删除，需标记 `superseded` 并指向新决策。

---

## 2. 决策日志

| decision_id | 日期 | 关联任务 | 决策 | 状态 | owner_role |
| --- | --- | --- | --- | --- | --- |
| DEC-000 | 2026-05-01 | TASK-000 | 采用四个根目录状态文件作为最小协作骨架 | accepted | orchestrator |
| DEC-001 | 2026-05-01 | TASK-001 | 采用 docs 分层目录承载产品探索与生成流程沉淀 | accepted | orchestrator |
| DEC-002 | 2026-05-01 | TASK-004 | 首发场景选定为"商品主图生成"，其余场景后置 | accepted | product |
| DEC-003 | 2026-05-01 | TASK-004 | 首版不暴露裸 prompt，通过平台模板+风格方向引导用户输入 | accepted | product |
| DEC-004 | 2026-05-01 | TASK-004 | 最终产品形态定为全栈 Web 应用，生图能力调用第三方 API | accepted | product |
| DEC-005 | 2026-05-02 | TASK-006 | 采用 Next.js 14 + Tailwind CSS v4 + TypeScript 作为技术栈 | superseded → DEC-007 | engineer |
| DEC-006 | 2026-05-02 | TASK-007 | API 采用 DALL-E 优先 + SVG mock 兜底，无 key 时自动降级 | superseded → DEC-008 | engineer |
| DEC-007 | 2026-05-05 | TASK-006 | 工程 MVP 当前基线为 Next.js 16.2.4 + React 19.2.4 + Tailwind CSS v4 + TypeScript | accepted | engineer |
| DEC-008 | 2026-05-05 | TASK-007 / TASK-010 | 生图 API 当前基线为 APIMART GPT Image 2 + SVG mock 兜底，含生成与对话式调整 | accepted | engineer |
| DEC-009 | 2026-05-05 | TASK-009 | TASK-009 验收状态为 blocked，需先修 lint 与上传图片链路 | accepted | orchestrator |
| DEC-010 | 2026-05-05 | TASK-010 | 接受“对话式调整”作为结果页正式方向，替代早期本地微调方案 | accepted | product |
| DEC-011 | 2026-05-05 | TASK-012 | MVP 最小自动化测试基线采用 Vitest + Testing Library，Playwright E2E 后置 | accepted | test |
| DEC-012 | 2026-05-05 | TASK-009 | 用户验收 TASK-009，MVP 本地验证与复盘完成 | accepted | orchestrator |

---

## 3. 决策详情模板

### DEC-XXX：决策标题
- 日期：
- 关联任务：
- owner_role：
- 状态：proposed
- 背景：
- 可选方案：
- 结论：
- 影响范围：
- 风险：
- 回看条件：

---

## 4. 已接受决策

### DEC-000：采用四个根目录状态文件作为最小协作骨架
- 日期：2026-05-01
- 关联任务：TASK-000
- owner_role：orchestrator
- 状态：accepted
- 背景：项目处于产品与流程探索阶段，需要轻量但可执行的共享状态入口。
- 可选方案：单一总文档 / docs 目录分层 / 根目录四个状态文件。
- 结论：先使用 `PLANS.md`、`TASKS.md`、`DECISIONS.md`、`UI_SPEC.md` 承载计划、任务、决策和 UI 规范。
- 影响范围：后续网站产品、生成流程和多 agent 协作任务均优先引用这四个文件。
- 风险：根目录文档可能随任务增多变长。
- 回看条件：当任一文件超过 200 行，评估是否拆分到 `docs/` 子目录。

### DEC-001：采用 docs 分层目录承载产品探索与生成流程沉淀
- 日期：2026-05-01
- 关联任务：TASK-001
- owner_role：orchestrator
- 状态：accepted
- 背景：项目目标从通用 LightDesign 明确到“AI 电商产品图与海报生成网站”，需要按产品探索、页面设计、生成链路和验证流程组织材料。
- 可选方案：继续使用根目录平铺 / 直接进入代码目录 / 建立文档优先的 `docs/` 分层目录。
- 结论：采用 `docs/` 作为探索期主目录，并按产品定位、用户场景、核心流程、页面设计、生成链路、模板规则、测试验证、决策经验、系统规则和工程准备分层。
- 影响范围：后续文档、模板、流程和实现说明优先进入对应 `docs/` 子目录。
- 风险：目录较多时可能出现空文档或重复记录。
- 回看条件：当某一目录连续 3 个任务未被使用，评估合并或调整命名。

### DEC-002：首发场景选定为"商品主图生成"
- 日期：2026-05-01
- 关联任务：TASK-004
- owner_role：product
- 状态：accepted
- 背景：场景地图草案包含商品主图、活动海报、多风格探索、模板复用四个场景，需要选定一个作为 MVP 切入点。
- 可选方案：商品主图生成 / 活动海报生成 / 多场景同时推进。
- 结论：选定"商品主图生成"为首发场景，其余场景后置至后续版本。理由：输入边界最清晰（商品图+卖点文案）、输出质量可客观评估、商业价值最直接（直接用于上架）。
- 影响范围：P2 页面设计、P3 工程 MVP 均只服务此场景。
- 风险：活动海报场景用户需求可能不同，后续扩展时需重新评估流程。
- 回看条件：MVP 上线后收集用户反馈，若 ≥ 30% 用户主动提出海报生成需求，优先进入下一版本。

### DEC-003：首版不暴露裸 prompt
- 日期：2026-05-01
- 关联任务：TASK-004
- owner_role：product
- 状态：accepted
- 背景：AI 生图工具常见两种交互范式——自由 prompt 输入 vs 结构化参数引导。
- 可选方案：暴露裸 prompt 输入框 / 通过平台模板和风格方向引导。
- 结论：首版不暴露裸 prompt，通过"平台选择+风格方向+卖点文案"三个结构化输入替代。理由：目标用户（中小卖家）不应被要求学习 prompt engineering，结构化输入能稳定输出质量。
- 影响范围：P2 输入表单设计、P3 后端 prompt 模板构造逻辑。
- 风险：高级用户可能觉得自由度不够，但不影响首版目标用户。
- 回看条件：当用户反馈中出现 ≥ 5 次"希望自定义 prompt"，评估增加高级模式。

### DEC-004：全栈 Web 应用 + 第三方 API 生图
- 日期：2026-05-01
- 关联任务：TASK-004
- owner_role：product
- 状态：accepted
- 背景：需要确定最终产品形态和生图引擎方案。
- 可选方案：全栈 Web + 第三方 API / 全栈 Web + 自托管 SD / 桌面工具 / 前端原型。
- 结论：全栈 Web 应用，生图调用第三方 API（DALL-E / Stability AI）。理由：用户无需本地部署，第三方 API 降低了首版工程复杂度，且质量已在商用中验证。
- 影响范围：P3 技术选型和架构设计。
- 风险：第三方 API 成本和配额可能限制规模化扩展，需在 P3 阶段实测。
- 回看条件：P3 实测若单次生成成本 > ¥0.5 或失败率 > 10%，评估自托管方案。

### DEC-005：采用 Next.js 14 + Tailwind CSS v4 + TypeScript 作为技术栈
- 日期：2026-05-02
- 关联任务：TASK-006
- owner_role：engineer
- 状态：superseded
- 背景：工程 MVP 初始搭建时记录的技术栈决策。
- 可选方案：Next.js 14 / 其他 React 全栈框架。
- 结论：该记录已被实际工程基线替代，见 DEC-007。
- 影响范围：历史记录保留，不再作为当前工程验收依据。
- 风险：若继续引用该决策，会导致版本判断错误。
- 回看条件：升级 Next.js 或 React 主版本时重新记录。

### DEC-006：API 采用 DALL-E 优先 + SVG mock 兜底
- 日期：2026-05-02
- 关联任务：TASK-007
- owner_role：engineer
- 状态：superseded
- 背景：早期 API 方案记录。
- 可选方案：DALL-E / APIMART GPT Image 2 / 自托管模型。
- 结论：该记录已被当前 APIMART GPT Image 2 实现替代，见 DEC-008。
- 影响范围：历史记录保留，不再作为当前 API 验收依据。
- 风险：文档引用旧模型会误导测试和成本评估。
- 回看条件：替换 API 供应商或模型时重新记录。

### DEC-007：工程 MVP 当前技术栈基线
- 日期：2026-05-05
- 关联任务：TASK-006
- owner_role：engineer
- 状态：accepted
- 背景：当前 `lightdesign-app/package.json` 已进入可构建 MVP 状态，需要以实际版本作为文档基线。
- 可选方案：沿用旧文档 Next.js 14 / 以 package.json 为准更新基线。
- 结论：当前工程 MVP 基线为 Next.js 16.2.4、React 19.2.4、Tailwind CSS v4、TypeScript 5。
- 影响范围：工程验证、lint/build、后续依赖升级和故障排查。
- 风险：React 19 lint 规则更严格，当前已暴露 `set-state-in-effect` 问题。
- 回看条件：升级 Next.js、React、Tailwind 或 TypeScript 主版本时。

### DEC-008：生图 API 当前实现基线
- 日期：2026-05-05
- 关联任务：TASK-007 / TASK-010
- owner_role：engineer
- 状态：accepted
- 背景：当前实现已从早期 DALL-E 口径转为 APIMART GPT Image 2，并增加对话式调整 API。
- 可选方案：DALL-E 生成 / APIMART GPT Image 2 / mock-only demo。
- 结论：当前基线为 `/api/generate` 与 `/api/adjust` 调用 APIMART GPT Image 2；无 `APIMART_API_KEY` 或调用失败时回退 SVG mock。
- 影响范围：API 测试、环境变量配置、成本和真实质量验证。
- 风险：真实 API 路径尚未完成端到端验收；当前上传图片尚未进入生成请求。
- 回看条件：真实 key 验证失败、单次成本超预算、或改用其他图像模型。

### DEC-009：TASK-009 验收状态裁决
- 日期：2026-05-05
- 关联任务：TASK-009
- owner_role：orchestrator
- 状态：accepted
- 背景：测试 agent 与主线程验证均显示 build/API mock 可用，但 lint 和产品一致性未达验收标准。
- 可选方案：验收通过 / 带风险通过 / blocked 后退回补充。
- 结论：TASK-009 状态裁决为 `blocked`，先修 `npm run lint`、上传图片参与生成链路和文档/实现差异，再进行复测。
- 影响范围：当前不得声明 MVP 验收完成，不进入发布或 PR 合并判断。
- 风险：若忽略该裁决，后续 PR 会基于错误验收口径推进。
- 回看条件：lint 通过、上传图生图链路补齐、自动化测试至少覆盖 API 与核心流程后。

### DEC-010：结果页正式采用对话式调整
- 日期：2026-05-05
- 关联任务：TASK-010
- owner_role：product
- 状态：accepted
- 背景：工程 MVP 已实现 `/result` 结果页，采用右侧对话面板、自然语言调整和版本管理；早期线框中的本地字号/位置微调尚未实现。
- 可选方案：继续补回本地微调 / 接受对话式调整为正式方向 / 同时保留两套调整方式。
- 结论：接受“对话式调整”作为结果页正式方向，替代早期本地文字字号/位置微调方案。结果页核心能力改为：预览当前版本、用自然语言描述调整、生成新版本、切换历史版本并导出。
- 影响范围：PRD、页面清单、线框说明、UI_SPEC、结果页验收标准和测试用例。
- 风险：对话式调整依赖后端生图能力，单次调整耗时和成本高于本地微调；需要通过 mock 与真实 API 分别验证。
- 回看条件：用户明确要求精确控制文字位置/字号，或对话式调整的耗时、成本、成功率无法满足 MVP 验收。

### DEC-011：MVP 最小自动化测试基线
- 日期：2026-05-05
- 关联任务：TASK-012
- owner_role：test
- 状态：accepted
- 背景：TASK-009 暴露缺少自动化测试的问题；Playwright 浏览器环境需要额外配置，但 API 与核心页面状态可先用 jsdom/Node 覆盖。
- 可选方案：只保留手工验证 / Vitest 优先 / 直接引入完整 Playwright E2E。
- 结论：MVP 最小自动化测试基线采用 Vitest + Testing Library，优先覆盖 `/api/generate`、`/api/adjust`、上传文件提交、工作台历史和结果页导出。Playwright chromium E2E 后置为增强项。
- 影响范围：`lightdesign-app/package.json`、`vitest.config.ts`、`src/test/setup.ts` 和 `src/**/*.test.*`。
- 风险：Vitest 不能完全替代真实浏览器交互，导出下载和跨页跳转仍需后续 E2E 覆盖。
- 回看条件：进入发布前验收、引入复杂拖拽/文件上传交互、或 CI 需要浏览器级保障时。

### DEC-012：TASK-009 验收通过
- 日期：2026-05-05
- 关联任务：TASK-009
- owner_role：orchestrator
- 状态：accepted
- 背景：TASK-009 已完成工程门禁、上传链路、Vitest 测试、Playwright E2E、真实 APIMART 图生图链路验证，并由用户明确验收。
- 可选方案：继续保持 ready_for_review / 标记 done 并进入后续质量评估。
- 结论：TASK-009 状态更新为 `done`，MVP 本地验证与复盘完成。
- 影响范围：`TASKS.md`、`docs/testing-validation/mvp-validation-report.md`、`INDEX.md`、`PLANS.md`。
- 风险：该验收不等同于生产级质量验收；真实生成质量、成本、长期稳定性、结果页深链恢复仍需后续任务覆盖。
- 回看条件：进入生产发布、接入真实用户或发现真实生成质量不稳定时。
