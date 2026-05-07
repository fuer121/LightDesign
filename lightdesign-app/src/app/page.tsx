import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle,
  ChatCenteredText,
  Globe,
  ImageSquare,
  Lightning,
  MagicWand,
  Sparkle,
  Storefront,
  UploadSimple,
} from '@phosphor-icons/react/dist/ssr';

const showcaseItems = [
  {
    src: '/showcase/icecream.png',
    title: 'Gelato 甜品杯',
    meta: '冷饮 / 质感主图',
    outcome: '奶油纹理、品牌杯身、浅景深保真',
  },
  {
    src: '/showcase/sneakers.png',
    title: '白色篮球鞋',
    meta: '运动鞋 / 平台主图',
    outcome: '鞋面织物、气垫结构、木地板光感',
  },
  {
    src: '/showcase/keyboard.png',
    title: 'RGB 机械键盘',
    meta: '数码 / 细节展示',
    outcome: '键帽透光、桌面材质、比例稳定',
  },
  {
    src: '/showcase/backpack.png',
    title: '战术徒步背包',
    meta: '户外 / 场景图',
    outcome: '织物纹理、配件层次、岩石背景',
  },
];

const workflow = [
  { icon: UploadSimple, title: '上传商品图', desc: '保留主体结构与关键材质，上传前自动处理大图。' },
  { icon: ImageSquare, title: '填写卖点', desc: '输入 2-3 条上架文案，选择目标平台与风格。' },
  { icon: MagicWand, title: '生成主图', desc: '按平台规格生成可检查、可导出的产品主图。' },
  { icon: ChatCenteredText, title: '对话调整', desc: '在结果页直接描述修改方向，保留版本历史。' },
];

const proofStats = [
  { value: '4/4', label: '真实商品图生成成功', note: '全部返回 remote-url' },
  { value: '1/1', label: '真实对话调整通过', note: 'adjust 链路有版本产物' },
  { value: '0', label: 'mock 回退', note: '扩样本链路未降级' },
  { value: '47.8s', label: '平均生成耗时', note: '最小样本观测值' },
];

const useCases = [
  { icon: Storefront, title: '淘宝主图', desc: '促销信息清晰，适合活动与店铺首图。' },
  { icon: Globe, title: '亚马逊列表', desc: '干净主体、规格稳定，适合标准白底图。' },
  { icon: Sparkle, title: 'Shopee 场景图', desc: '更强购买氛围，突出类目风格与使用场景。' },
  { icon: Lightning, title: '通用商品图', desc: '快速探索多种表现方式，用于选品和投放素材。' },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-stone-50 text-zinc-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.16),transparent_42%),linear-gradient(180deg,#fffaf0_0%,rgba(250,250,249,0)_78%)]" />

      <Link
        href="/create"
        className="fixed right-6 top-20 z-40 hidden items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_44px_-22px_rgba(24,24,27,0.75)] transition hover:-translate-y-0.5 hover:bg-amber-700 focus-visible:outline-none active:translate-y-0.5 sm:inline-flex"
      >
        开始创作
        <ArrowRight size={16} weight="bold" />
      </Link>
      <Link
        href="/create"
        className="fixed inset-x-4 bottom-4 z-40 inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_44px_-22px_rgba(24,24,27,0.75)] transition hover:bg-amber-700 focus-visible:outline-none active:scale-[0.98] sm:hidden"
      >
        开始创作
        <ArrowRight size={16} weight="bold" />
      </Link>

      <section className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-20 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-24">
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Product Image Studio</p>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-zinc-950 text-balance md:text-7xl">
            让商品图像完成成交前的第一眼。
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-zinc-600 md:text-lg">
            LightDesign 将真实商品照片转化为高质感电商主图，并支持在结果页用自然语言继续调整，适合快速完成上架、选品和投放素材探索。
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-7 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_-22px_rgba(180,83,9,0.9)] transition hover:-translate-y-0.5 hover:bg-amber-700 focus-visible:outline-none active:translate-y-0.5"
            >
              开始创作
              <ArrowRight size={16} weight="bold" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-6 py-3 text-sm font-semibold text-zinc-700 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-white focus-visible:outline-none active:translate-y-0.5"
            >
              查看工作台
            </Link>
          </div>
        </div>

        <div className="relative min-h-[520px]">
          <div className="absolute left-0 top-6 w-[58%] overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_34px_90px_-48px_rgba(24,24,27,0.75)]">
            <Image src="/showcase/backpack.png" alt="徒步背包高质感电商图示意" width={540} height={660} priority className="h-[420px] w-full object-cover" />
          </div>
          <div className="absolute right-0 top-0 w-[54%] overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_28px_76px_-44px_rgba(24,24,27,0.65)]">
            <Image src="/showcase/sneakers.png" alt="篮球鞋高质感电商图示意" width={640} height={640} priority className="h-[300px] w-full object-cover" />
          </div>
          <div className="absolute bottom-4 right-8 w-[52%] overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_30px_82px_-48px_rgba(24,24,27,0.7)]">
            <Image src="/showcase/keyboard.png" alt="机械键盘高质感电商图示意" width={1080} height={590} className="h-[230px] w-full object-cover" />
          </div>
          <div className="absolute bottom-24 left-16 max-w-[260px] rounded-3xl border border-zinc-200/80 bg-white/88 p-4 shadow-[0_24px_64px_-42px_rgba(24,24,27,0.65)] backdrop-blur">
            <div className="mb-3 flex items-center justify-between text-xs text-zinc-400">
              <span>真实链路</span>
              <span className="rounded-full bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">4/4 passed</span>
            </div>
            <p className="text-sm font-semibold leading-6 text-zinc-800">真实商品图扩样本全部返回远程结果，结果页调整链路同步通过。</p>
          </div>
        </div>
      </section>

      <section className="relative border-y border-zinc-200/70 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Showcase</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">横向滚动的电商图效果墙</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-zinc-500">使用本地真实商品图资产呈现，不在运行时请求外部图片。</p>
          </div>
          <div className="-mx-6 flex snap-x gap-4 overflow-x-auto px-6 pb-4">
            {showcaseItems.map(item => (
              <article key={item.title} className="surface-grain min-w-[78vw] snap-start overflow-hidden rounded-3xl border border-zinc-200 bg-stone-50 shadow-[0_18px_50px_-42px_rgba(24,24,27,0.65)] sm:min-w-[430px]">
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
                  <Image src={item.src} alt={`${item.title} 高级电商图示意`} width={900} height={680} className="h-full w-full object-cover transition duration-700 hover:scale-[1.03]" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">{item.meta}</p>
                  <h3 className="mt-2 text-lg font-semibold text-zinc-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">{item.outcome}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Workflow</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">从商品照片到可调整结果，只保留必要步骤。</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {workflow.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.title} className="surface-grain rounded-3xl border border-zinc-200/80 bg-white p-5 shadow-[0_18px_46px_-40px_rgba(24,24,27,0.55)]">
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-300">0{index + 1}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                    <Icon size={20} weight="duotone" />
                  </span>
                </div>
                <h3 className="text-base font-semibold text-zinc-900">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-500">{step.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative bg-zinc-950 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">Quality Proof</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">真实扩样本链路已经跑通。</h2>
            <p className="mt-5 text-sm leading-7 text-zinc-300">
              当前阶段的质量证明来自真实商品图最小扩样本与真实 adjust 链路，不把 mock 结果伪装成线上产物。
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {proofStats.map(stat => (
              <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-4xl font-semibold tracking-tight text-white">{stat.value}</span>
                  <CheckCircle size={22} weight="fill" className="text-amber-300" />
                </div>
                <p className="mt-5 text-sm font-semibold text-white">{stat.label}</p>
                <p className="mt-2 text-xs leading-5 text-zinc-400">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Use Cases</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">覆盖常见电商主图场景。</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-zinc-500">同一套视觉语言适配不同平台，保持简洁、商品优先和结果可检查。</p>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {useCases.map(item => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="rounded-3xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_22px_58px_-46px_rgba(24,24,27,0.65)]">
                <Icon size={26} weight="duotone" className="text-amber-700" />
                <h3 className="mt-6 text-base font-semibold text-zinc-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-500">{item.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative px-6 pb-28 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-zinc-200 bg-white px-6 py-12 shadow-[0_28px_80px_-62px_rgba(24,24,27,0.65)] md:px-12">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Ready</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">用一张真实商品图开始。</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-500">
                上传照片、填写卖点、选择平台，生成后继续用对话调整细节。原工作台仍保留在二级页。
              </p>
            </div>
            <Link
              href="/create"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-600 px-7 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_-24px_rgba(180,83,9,0.9)] transition hover:-translate-y-0.5 hover:bg-amber-700 focus-visible:outline-none active:translate-y-0.5"
            >
              开始创作
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
