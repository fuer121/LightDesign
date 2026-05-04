# TASKS.md

## 0. 文档状态
- 更新时间：2026-05-01
- 责任角色：orchestrator
- 阶段：产品与流程探索

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
| TASK-009 | MVP 本地验证与复盘 | test | todo | P1 | TASK-008 | 验收报告 |
| TASK-010 | 对话式图像调整（结果页重构） | engineer | done | P0 | TASK-008 | /api/adjust + 结果页对话面板 + 版本管理 |

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
- status：ready_for_review
- 背景：项目方向已定为"AI 电商产品图与海报生成网站"，但尚未收敛到具体可执行的首版范围
- 目标：产出一份精简 PRD，卡死首版场景、范围和成功标准
- 输出：docs/product/PRD.md
- 验收标准：读者能准确说出"帮谁解决什么问题、首版做到什么程度、什么明确不做"
- 风险：场景选择过宽导致后续工程发散
- decision_needed：PRD 内容确认
- next_step：用户审阅 PRD → 确认后进入 P2 交互低保真阶段
- eta：已交付

### TASK-005：设计核心页面低保真线框与交互状态
- owner_role：ui
- status：ready_for_review
- 背景：PRD 已确认，首版范围已锁定。需要在进入工程前定义页面布局、组件层级和交互状态。
- 目标：产出 4 个核心页面的低保真线框，涵盖空态、加载、成功、失败和边界状态。
- 输出：docs/page-design/wireframes.md
- 验收标准：开发者能据此开始搭建页面骨架，不需要额外猜测布局或状态处理。
- 风险：未定义响应式行为可能导致移动端体验不一致。对策：P3 工程阶段补充断点设计。
- decision_needed：线框布局和页面流转确认
- next_step：用户审阅线框 → 确认后进入 P3 工程 MVP 阶段
- eta：已交付

---

## 7. 验收清单
- [x] 每个任务都有唯一 `task_id`。
- [x] 每个任务都有明确 owner、状态、输出和验收标准。
- [x] 产品、UI、测试、工程角色的输入输出边界清晰。
- [x] 关键结论同步到 DECISIONS.md。
- [x] UI 或生成流程变更同步到 UI_SPEC.md。
