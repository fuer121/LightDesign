# docs 目录索引

## 目录目的
本目录用于沉淀“AI 电商产品图与海报生成网站”的产品探索、流程设计、页面设计、生成链路、模板规则、测试验证和工程准备材料。

当前阶段优先沉淀文档和协作结构，不以代码实现为主。所有可交付内容应能回连到根目录状态文件：
- `PLANS.md`：计划与阶段目标
- `TASKS.md`：任务、owner、checkpoint
- `DECISIONS.md`：关键决策
- `UI_SPEC.md`：页面与 UI 规范

---

## 目录结构

| 目录 | 用途 | 主要角色 |
| --- | --- | --- |
| `product-positioning/` | 产品定位、目标用户、价值主张、版本边界 | product |
| `user-scenarios/` | 用户场景、角色、任务、痛点和成功标准 | product |
| `core-flows/` | 核心业务流程、用户路径、多 agent 协作流程 | orchestrator / product |
| `page-design/` | 页面清单、信息架构、交互状态、视觉规范 | ui |
| `generation-pipeline/` | 产品图、海报、文案、模板的生成链路 | product / engineer-* |
| `templates-and-rules/` | 模板沉淀、提示词规则、输入输出 schema、禁用项 | ui / engineer-* |
| `testing-validation/` | 验收清单、测试用例、质量评估、回归记录 | test |
| `decisions-and-learnings/` | 决策补充、复盘、经验、失败记录 | orchestrator |
| `system-rules/` | 项目规则、agent 协作、发布和安全约束 | orchestrator |
| `engineering/` | 后续工程实现说明、接口草案、技术验证记录 | engineer-* |

---

## 使用规则
1. 新任务先登记到 `TASKS.md`，再补充到对应目录。
2. 影响产品、流程、UI、技术路径的结论同步到 `DECISIONS.md`。
3. 页面和生成结果相关规范同步到 `UI_SPEC.md`。
4. 每个文档尽量包含：目标、范围、输入、输出、验收标准、待决策问题。
5. 当前阶段允许粗粒度草案，但必须可追溯、可复用、可继续推进。

