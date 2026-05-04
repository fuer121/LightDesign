# LightDesign UI Specification v2.0

**更新时间**：2026-05-04
**状态**：Engineering MVP — Design System Applied
**关联框架**：Next.js 16 + Tailwind CSS v4 + React 19

---

## 1. Brand Identity

### 1.1 品牌定位
LightDesign 是面向电商运营人员的 AI 产品主图生成工具。视觉语言传达**专业、高效、可信赖**，避免营销浮夸风格。

### 1.2 Logo
- 形式：琥珀色圆角方块内白色 "L" 字母
- 文字：Geist SemiBold，"LightDesign"
- 实现：`<span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-xs font-bold text-white">L</span>`

---

## 2. Color System

### 2.1 主色调

| Token | 值 | Tailwind | 用途 |
|-------|-----|----------|------|
| Accent | `#d97706` | `amber-500` | 主要按钮、选中态、进度条、链接 |
| Accent Hover | `#b45309` | `amber-600` | 悬停态 |
| Accent Light | `#fef3c7` | `amber-50` | 选中背景、高亮区域 |
| Accent Ring | `rgba(217,119,6,0.25)` | 自定义 | Focus ring、选中外发光 |

### 2.2 中性色

| Token | Tailwind | 用途 |
|-------|----------|------|
| Page BG | `bg-zinc-50` | 全局页面背景 |
| Surface | `bg-white` | 卡片、面板、输入框背景 |
| Surface Muted | `bg-zinc-100` | 次要背景、骨架屏、禁用态 |
| Border | `border-zinc-200` | 默认边框 |
| Border Light | `border-zinc-100` | 轻量分割线 |
| Text Primary | `text-zinc-900` | 主文字 |
| Text Secondary | `text-zinc-700` | 次要文字 |
| Text Tertiary | `text-zinc-500` | 辅助文字 |
| Text Disabled | `text-zinc-300` / `text-zinc-400` | 禁用/占位文字 |

### 2.3 语义色

| 用途 | 颜色 | Tailwind |
|------|------|----------|
| 成功 | 翠绿 | `text-emerald-600`, `bg-emerald-50` |
| 错误 | 红色 | `text-red-600`, `bg-red-50` |
| 错误图标 | 红色填充 | `text-red-400` (fill) |

### 2.4 CSS 自定义属性（globals.css）

```css
:root {
  --color-accent: #d97706;
  --color-accent-hover: #b45309;
  --color-accent-light: #fef3c7;
  --color-surface: #ffffff;
  --color-surface-muted: #f4f4f5;
}
```

### 2.5 禁止使用的颜色
- AI Purple/Blue (`indigo-*`, `blue-*`, `violet-*`) — 仅允许 amber 作为 accent
- 纯黑 `#000000`
- 过饱和色（saturation > 80%）
- Neon / Outer Glow 效果

---

## 3. Typography

### 3.1 字体

| 用途 | 字体 | Weight | Tailwind |
|------|------|--------|----------|
| 全局正文 | Geist Sans | 400 | `font-sans` (默认) |
| 等宽/代码 | Geist Mono | 400 | `font-mono` |
| 标题 | Geist Sans | 600 | `font-semibold` |

**禁止使用**：Inter、Serif 字体（在 dashboard 类页面中）

### 3.2 字号阶梯

| 层级 | 字号 | Tailwind | 用途 |
|------|------|----------|------|
| H1 | 30px | `text-3xl` | 页面主标题 |
| H2 | 24px | `text-2xl` | 区块标题 |
| H3 | 16px | `text-base` | 卡片标题 |
| Body | 14px | `text-sm` | 正文、表单标签、按钮文字 |
| Caption | 12px | `text-xs` | 辅助信息、时间戳 |
| Micro | 10px | `text-[10px]` | 极小程序文字 |

### 3.3 排版规则
- 标题始终使用 `tracking-tight`（紧凑字间距）
- 正文行高使用 `leading-relaxed`
- 页面标题不使用居中布局（VARIANCE > 4 规则）
- 禁止使用 `text-4xl` 以上的超大字号（非营销页）

---

## 4. Spacing System

### 4.1 页面级间距
- 页面容器最大宽度：`max-w-5xl`（工作台）/ `max-w-2xl`（表单页）/ `max-w-lg`（生成等待）
- 页面水平内边距：`px-6`
- 页面顶部间距：`py-12`
- 区块间距：`space-y-10`（表单页各 section 之间）
- 组件间距：`gap-3`（按钮组）、`gap-2`（表单元素）

### 4.2 组件级间距
- 标签与输入框之间：`mb-2.5`
- 输入框内部：`px-4 py-3`（输入框）/ `px-4 py-2.5`（文本域）
- 卡片内部：`px-5 py-4`
- 按钮内部：`px-5 py-3`（主按钮）/ `px-3 py-1.5`（小按钮）

---

## 5. Component Patterns

### 5.1 主按钮（Primary）

```tsx
// 可用态
className="rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white
           shadow-sm shadow-amber-200 transition hover:bg-amber-600
           active:scale-[0.98]"

// 禁用态
className="cursor-not-allowed bg-zinc-100 text-zinc-300"
```

规则：所有交互按钮必须包含 `active:scale-[0.98]` 提供触觉反馈。

### 5.2 次按钮（Secondary / Ghost）

```tsx
className="rounded-xl bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-600
           transition hover:bg-zinc-200 active:scale-[0.98]"
```

### 5.3 输入框（Text Input）

```tsx
className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3
           text-sm outline-none transition
           focus:border-amber-400 focus:ring-2 focus:ring-amber-100
           placeholder:text-zinc-300"
```

规则：Label 必须位于 Input 上方（不在内部或侧边），使用 `mb-2.5` 间距。

### 5.4 文本域（Textarea）

```tsx
className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50
           px-4 py-2.5 text-sm outline-none transition
           focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100
           disabled:opacity-50"
```

### 5.5 选择卡片（Select Card）

```tsx
// 默认态
className="flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-5
           transition active:scale-[0.98]
           border-zinc-200 bg-white text-zinc-500
           hover:border-zinc-300 hover:bg-zinc-50"

// 选中态
className="... border-amber-400 bg-amber-50 text-amber-600
           shadow-[0_0_0_3px_rgba(217,119,6,.12)]"
```

规则：图标 + 标签纵向排列，图标使用 `weight="duotone"`。

### 5.6 文件上传区（Drop Zone）

```tsx
className="cursor-pointer rounded-2xl border-2 border-dashed border-zinc-300
           bg-zinc-50/80 px-8 py-14 text-center transition
           hover:border-amber-300 hover:bg-amber-50/50"
```

### 5.7 进度条

```tsx
// 轨道
className="h-1.5 w-80 overflow-hidden rounded-full bg-zinc-200"

// 填充
className="h-full rounded-full bg-amber-500 transition-all duration-500 ease-out"
```

### 5.8 卡片（Card）

```tsx
className="rounded-2xl border border-zinc-200/60 bg-white px-5 py-4
           transition hover:border-zinc-300 hover:shadow-sm"
```

规则：
- 仅在需要表达层级时使用卡片
- 高密度场景优先使用 `border-t` 分割线替代卡片
- 不使用 `border-zinc-200/60` 透明度边框（保持 100% 不透明边框）

### 5.9 状态徽章（Badge）

```tsx
// 成功/已导出
className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5
           text-[10px] font-semibold text-emerald-600"

// 中性/草稿
className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-500"
```

### 5.10 Toast 通知

```tsx
className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3
           rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-2xl"
```

### 5.11 对话气泡（Chat Bubble）

```tsx
// 用户消息（右侧，琥珀色）
className="rounded-2xl rounded-br-md bg-amber-500 px-4 py-2.5
           text-sm leading-relaxed text-white"

// 助手消息（左侧，灰色）
className="rounded-2xl rounded-bl-md bg-zinc-100 px-4 py-2.5
           text-sm leading-relaxed text-zinc-700"
```

### 5.12 版本指示点（Version Dot）

```tsx
// 当前版本
className="h-2.5 w-2.5 rounded-full bg-amber-500
           shadow-[0_0_0_3px_rgba(217,119,6,.25)]"

// 非当前版本
className="h-2.5 w-2.5 rounded-full bg-zinc-300 hover:bg-zinc-400"
```

---

## 6. State Patterns

### 6.1 加载态（Loading）
- **骨架屏**：使用 `animate-pulse` 灰色占位块，数量与实际内容行数匹配
- **旋转器**：`animate-spin rounded-full border-[3px] border-white border-t-transparent`
- **跳动点**（对话加载）：三个 `animate-bounce` 圆点，分别延迟 0ms / 150ms / 300ms
- **进度条**：伪进度 0→95%，每秒更新

### 6.2 空态（Empty）
- 大号 duotone 图标（Phosphor ImageIcon / Package 等）+ 居中文字说明
- 图标容器：`h-16 w-16 rounded-2xl bg-zinc-100`
- 图标颜色：`text-zinc-300`
- 文字：主文字 `text-sm font-medium text-zinc-400` + 辅助 `text-xs text-zinc-300`

### 6.3 错误态（Error）
- 错误图标：Phosphor XCircle / WarningCircle，`weight="fill"`，`text-red-400`
- 图标容器：`h-12 w-12 rounded-2xl bg-red-50`
- 标题：`text-sm font-medium text-red-600`
- 详情：`text-xs text-zinc-400`
- 操作按钮：重试 + 返回

### 6.4 成功态（Success）
- 文字颜色：`text-emerald-600`
- 自动跳转（1-2 秒延迟）

---

## 7. Iconography

### 7.1 图标库
**唯一图标来源**：[@phosphor-icons/react](https://www.npmjs.com/package/@phosphor-icons/react)

### 7.2 使用规则
| 场景 | Weight | Size |
|------|--------|------|
| 按钮内图标 | `bold` / `fill` | 12-16px |
| 空态图标 | `duotone` | 28px |
| 平台/风格选择 | `duotone` | 28px |
| 导航图标 | `regular` / `bold` | 14-16px |
| 状态图标 | `fill` | 16-24px |

### 7.3 图标映射表（当前使用）

| 用途 | 图标 | Weight |
|------|------|--------|
| 新建 | `Plus` | bold |
| 复用 | `ArrowCounterClockwise` | bold |
| 返回 | `ArrowLeft` | bold |
| 图片占位 | `Image` | duotone |
| 关闭/清除 | `X` | bold |
| 用户头像 | `User` | fill |
| 亚马逊 | `AmazonLogo` | duotone |
| 淘宝 | `ShoppingCart` | duotone |
| Shopee | `Storefront` | duotone |
| 通用 | `Globe` | duotone |
| 简约白底 | `Palette` | duotone |
| 场景化 | `Sparkle` | duotone |
| 促销感 | `Fire` | duotone |
| 生成按钮 | `Lightning` | fill |
| 已导出 | `Sparkle` | fill |
| 错误 | `XCircle` | fill |
| 发送 | `PaperPlaneTilt` | fill |
| 下载/导出 | `DownloadSimple` | bold |
| 上一版 | `CaretLeft` | bold |
| 下一版 | `CaretRight` | bold |
| 对话面板 | `ChatCenteredText` | duotone |
| 预览脉冲 | CSS `animate-pulse` 方块（无图标） | — |

### 7.4 禁止使用
- Emoji（任何形式）
- 内联 SVG（必须通过 Phosphor 组件）
- 其他图标库混用

---

## 8. Layout Principles

### 8.1 整体布局
- 使用 `flex min-h-dvh flex-col` 确保页面至少占满视口
- Header 固定顶部：`sticky top-0 z-50`
- 主内容区：`flex-1`

### 8.2 页面布局规则
- **工作台**：左对齐标题 + 右上角 CTA（不对称布局，非居中 Hero）
- **表单页**：垂直排列，单列居中（max-w-2xl）
- **生成等待**：最小化页面，全内容居中
- **结果页**：左侧图片预览 + 右侧对话面板，固定高度 `h-[calc(100dvh-56px)]`

### 8.3 网格规则
- 优先使用 CSS Grid（`grid grid-cols-n`）
- 禁止复杂 flexbox 百分比计算
- 平台选择：`grid-cols-2 sm:grid-cols-4`
- 风格选择：`grid-cols-3`

### 8.4 响应式
- 使用 `max-w-*` 限制宽度 + `px-6` 移动端边距
- 全高区域使用 `min-h-[100dvh]`（非 `h-screen`）
- 移动端按钮保持可点击尺寸（最小 44px 触摸目标）
- 结果页对话面板：固定 `w-[380px]`（桌面端），移动端折叠

---

## 9. Interaction Patterns

### 9.1 触觉反馈
- 所有可点击元素：`active:scale-[0.98]`
- 按钮悬停：颜色加深（`hover:bg-amber-600`）
- 卡片悬停：边框加深 + 阴影出现

### 9.2 焦点指示
- 输入框焦点：`focus:border-amber-400 focus:ring-2 focus:ring-amber-100`
- 键盘导航可见焦点环
- 不要移除默认 outline（仅替换样式）

### 9.3 过渡动画
- 默认过渡时长：`transition`（150ms）
- 进度条：`transition-all duration-500 ease-out`
- 加载动画：CSS `animate-pulse` / `animate-spin` / `animate-bounce`
- 禁止使用：linear 缓动（应使用 ease-out / spring）

### 9.4 页面过渡
- 生成完成 → 结果页：`setTimeout 1200ms` 延迟跳转
- Toast：出现后 `3500ms` 自动消失

---

## 10. Content Rules

### 10.1 文案风格
- 中文为主，简洁直接
- 按钮文案：动词开头（"新建生成任务"、"导出此版本"、"返回工作台"）
- 状态描述：名词 + 状态（"生成中..."、"生成完成，即将跳转"、"生成失败"）
- 占位符：示例引导（如"限时五折抢购"、"把背景换成蓝色"）

### 10.2 禁止使用的文案
- 营销陈词滥调（"释放潜能"、"无缝体验"、"颠覆性"）
- 虚假人名（"John Doe"、张三）
- 虚假公司名（"Acme"、"Nexus"）
- 虚假整数数据

---

## 11. Forbidden Patterns（AI Tells）

以下模式在任何情况下均**禁止使用**：

| 类别 | 禁止项 |
|------|--------|
| 颜色 | AI Purple/Blue (`indigo`, `blue`, `violet`)、纯黑 `#000`、过饱和色、Neon/Outer Glow |
| 字体 | Inter、Serif 字体 |
| 布局 | 居中 Hero 区域、3 列卡片排列（通用功能行） |
| 图标 | Emoji、自定义 SVG（非 Phosphor） |
| 动效 | 自定义鼠标光标、线性缓动、无清理函数的 useEffect 动画 |
| 内容 | 虚假数据、营销陈词滥调、破损 Unsplash 链接 |
| 阴影 | 深色投影（应用底色 tint 投影） |

---

## 12. Implementation Checklist

新页面或组件开发完成后，逐项验证：

- [ ] 无 Emoji，全部使用 Phosphor 图标
- [ ] 无 indigo/blue/violet 颜色，accent 仅使用 amber
- [ ] 页面标题非居中布局（工作台类页面）
- [ ] 全高区域使用 `min-h-[100dvh]` 而非 `h-screen`
- [ ] 所有交互按钮包含 `active:scale-[0.98]`
- [ ] Label 位于 Input 上方
- [ ] 已实现 Loading / Empty / Error 三态
- [ ] 输入框焦点样式：`focus:border-amber-400 focus:ring-2 focus:ring-amber-100`
- [ ] 移动端 `px-` 边距充足，按钮可点击
- [ ] CSS 动画仅使用 transform + opacity
- [ ] 无虚假示例数据或陈词滥调文案
- [ ] 文件路径使用 `@/` alias
- [ ] `'use client'` 指令仅标记交互组件
- [ ] localStorage 操作包含 try-catch 保护

---

## 附录 A：globals.css 完整参考

```css
@import "tailwindcss";

@theme inline {
  --color-accent: #d97706;
  --color-accent-light: #fef3c7;
  --color-accent-hover: #b45309;
}

body {
  font-family: var(--font-geist-sans), system-ui, -apple-system, sans-serif;
}

/* 自定义滚动条 */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #d4d4d8; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #a1a1aa; }
```

## 附录 B：Tailwind v4 注意事项

- 使用 `@theme inline` 语法（非 `@layer base` 中的 CSS 变量）
- `!` important 修饰符语法与 v3 相同
- 自定义颜色值直接写 `text-[#d97706]` 形式
- `@apply` 仍然可用但建议减少使用
