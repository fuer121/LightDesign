# INDEX.md

## 0. 项目总控入口
本文件是 LightDesign 项目的总索引和控制面板。后续任何新任务进入项目时，先阅读本文件，再进入对应状态文件或 `docs/` 子目录。

当前阶段：工程 MVP 验证完成 / TASK-016 单样本真实商品图采样待验收 / TASK-019 方案待验收 / TASK-020 上传前降采样待验收。

---

## 1. 当前项目目标
本项目目标是探索一个“AI 电商产品图与海报生成网站”：

1. 帮助电商卖家、运营和内容团队生成产品图、活动海报和营销素材。
2. 把图片生成过程拆成可追踪、可复用、可验收的流程。
3. 沉淀产品定位、用户场景、页面设计、生成链路、模板规则和测试验证方法。
4. 先验证产品流程和协作机制，再进入大规模工程实现。

当前不优先做：
- 完整生产级网站代码。
- 复杂账号、权限、支付或资产管理系统。
- 未经过验证的大规模自动化生成能力。

---

## 2. 根目录文件入口

| 文件 | 用途 | 当前状态 |
| --- | --- | --- |
| `AGENTS.md` | 项目多 agent 协作规则、任务流转和交付规范 | 已存在 |
| `PLANS.md` | 阶段计划、产品假设、近期路线和风险 | 已建立初版 |
| `TASKS.md` | 任务看板、任务卡、checkpoint 和验收清单 | 已建立初版 |
| `DECISIONS.md` | 关键决策日志与决策模板 | 已建立初版 |
| `UI_SPEC.md` | 页面、组件、状态和生成输入字段的 UI 规范 | 已建立初版 |
| `README.md` | 项目说明入口 | 已存在，当前工作区显示为新增待提交 |
| `PLAYBOOK.md` | 项目原有流程或操作说明 | 已存在 |
| `INDEX.md` | 当前总索引和控制面板 | 当前文件 |

---

## 3. 当前目录结构

```text
.
├── AGENTS.md
├── DECISIONS.md
├── INDEX.md
├── PLANS.md
├── PLAYBOOK.md
├── README.md
├── TASKS.md
├── UI_SPEC.md
├── prototype.html
├── lightdesign-app/
│   ├── package.json
│   ├── src/app/
│   ├── src/components/
│   └── src/lib/
└── docs/
    ├── README.md
    ├── product-positioning/
    ├── user-scenarios/
    ├── core-flows/
    ├── page-design/
    ├── generation-pipeline/
    ├── templates-and-rules/
    ├── testing-validation/
    ├── decisions-and-learnings/
    ├── system-rules/
    └── engineering/
```

---

## 4. docs 目录用途

| 目录 | 模块 | 当前作用 |
| --- | --- | --- |
| `docs/product-positioning/` | 产品定位 | 记录目标用户、价值主张、版本边界 |
| `docs/user-scenarios/` | 用户场景 | 记录电商素材生成场景、输入输出和成功标准 |
| `docs/core-flows/` | 核心流程 | 记录用户流程、多 agent 流程和 checkpoint |
| `docs/page-design/` | 页面设计 | 记录页面清单、信息架构、交互状态 |
| `docs/generation-pipeline/` | 生成链路 | 记录从输入到产品图、海报、验收的生成过程 |
| `docs/templates-and-rules/` | 模板与规则 | 记录模板、提示词规则、平台规则和风格约束 |
| `docs/testing-validation/` | 测试与验证 | 记录验收清单、测试用例和质量验证 |
| `docs/decisions-and-learnings/` | 决策与经验 | 记录复盘、经验和决策背景材料 |
| `docs/system-rules/` | 系统规则 | 记录文件命名、协作细则和规则补充 |
| `docs/engineering/` | 工程实现 | 为后续架构、接口、数据结构和原型验证预留 |

---

## 5. 当前已有进展
已完成：
- 建立根目录状态文件：`PLANS.md`、`TASKS.md`、`DECISIONS.md`、`UI_SPEC.md`。
- 建立 `docs/` 文档目录骨架。
- 为关键目录写入最小 README 或草案文件。
- 明确当前项目方向为“AI 电商产品图与海报生成网站”。
- 已产出首版 PRD、核心页面低保真线框和高保真静态原型。
- 已搭建 `lightdesign-app/` Next.js 工程 MVP。
- 已实现工作台、新建任务、生成等待、结果页、`/api/generate`、`/api/adjust`。
- 已验证 `npm run build`、`npm run test:unit`、`npm run test:e2e` 通过，mock 模式下生成与调整 API 可返回结果。
- 已完成一次真实 APIMART 图生图链路最小验证，确认 `image_urls` 参数可用。

尚未完成：
- `npm run lint` 已 0 error，但仍有 4 个 `<img>` 性能 warning。
- 上传商品照片已进入 `/api/generate`，mock 和真实 APIMART 请求体链路均已验证。
- 结果页当前为 `/result` 会话态页面，不是可深链访问的 `/result/[taskId]`。
- 当前实现采用对话式调整与版本管理，已偏离早期线框中的本地字号/位置微调方案。
- 真实商品图已有 1 张单样本质量 / 耗时记录，尚未完成 3-5 张扩样本统计。
- 还没有正式生成模板库、用户访谈或生产级成本稳定性记录。

---

## 6. 当前待处理模块

| 优先级 | 模块 | 待处理事项 | 建议 owner_role |
| --- | --- | --- | --- |
| P0 | 产品定位 | 收敛目标用户、核心价值、首个版本边界 | product |
| P0 | 用户场景 | 选择 2-3 个优先验证场景 | product |
| P0 | 核心流程 | 定义一次端到端生成任务的标准流程 | orchestrator / product |
| P1 | 页面设计 | 输出工作台、新建任务、结果预览的低保真结构 | ui |
| P1 | 生成链路 | 明确输入 schema、输出结构和质量门禁 | product / engineer-* |
| P1 | 模板与规则 | 定义商品主图和活动海报的首批模板记录格式 | ui / engineer-* |
| P0 | 测试与验证 | TASK-009 已验收，后续按需扩展生产级验证 | test |
| P0 | 工程实现 | 真实生成质量、成本和稳定性评估 | engineer-* / test |
| P1 | 文档基线 | 同步 PRD / 页面清单 / 工程说明与当前实现差异 | orchestrator |

---

## 7. 推荐下一步
建议下一轮任务从以下三件事中选择一件推进：

1. 做真实商品图质量评估：检查主体保真、文字可读性、耗时和成本。
2. 决定是否补 `/result` 深链恢复、模板库和更多浏览器 E2E。
3. 准备 PR 交付材料：汇总变更摘要、验证结果、风险与回滚点。

推荐优先级：先决定是否进入生产级质量评估，再准备 PR 交付。

---

## 8. 新任务进入规则
1. 先阅读 `INDEX.md`、`AGENTS.md`、`TASKS.md`。
2. 在 `TASKS.md` 中确认或新增唯一 `task_id`。
3. 判断任务应留在主线程、拆分子线程，还是进入 worktree。
4. 明确目标、范围、输出、验收标准和 owner_role。
5. 执行后同步更新相关文档。
6. 涉及关键方向变化时，更新 `DECISIONS.md`。

---

## 9. 状态速览

| 项目项 | 当前判断 |
| --- | --- |
| 产品阶段 | 工程 MVP 验证 |
| 主要资产 | 文档基线、Next.js MVP、mock/真实图生图链路、Vitest/Playwright 测试 |
| 主要风险 | 真实生成质量未评估、结果页不可深链恢复、仍有少量 `<img>` warning |
| 当前最需要 | 决定是否进入生产级质量评估 |
| 工程状态 | 已实现 MVP 垂直切片并通过本地自动化验证，TASK-009 已验收 |
