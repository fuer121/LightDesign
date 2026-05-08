import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ChatCenteredText,
  ImageSquare,
  MagicWand,
  UploadSimple,
} from '@phosphor-icons/react/dist/ssr';

const showcaseItems = [
  { src: '/showcase/icecream.png', title: '甜品杯', tag: '食品' },
  { src: '/showcase/sneakers.png', title: '篮球鞋', tag: '运动' },
  { src: '/showcase/keyboard.png', title: '机械键盘', tag: '数码' },
  { src: '/showcase/backpack.png', title: '徒步背包', tag: '户外' },
];

const steps = [
  { icon: UploadSimple, title: '上传', desc: '商品图' },
  { icon: ImageSquare, title: '填写', desc: '卖点与平台' },
  { icon: MagicWand, title: '生成', desc: '主图结果' },
  { icon: ChatCenteredText, title: '调整', desc: '对话改图' },
];

export default function HomePage() {
  return (
    <div className="min-h-[calc(100dvh-56px)] overflow-hidden bg-[#f8f6f0] text-zinc-950">
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[0.86fr_1.14fr] lg:px-8 lg:py-16">
        <div className="flex flex-col justify-center">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">LightDesign</p>
          <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-balance md:text-7xl">
            GPT image 2 电商图工作台
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-zinc-600">
            上传真实商品图，填写卖点，生成可继续对话调整的电商主图。
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-7 py-3 text-sm font-semibold text-white shadow-[0_18px_46px_-28px_rgba(24,24,27,0.8)] transition hover:-translate-y-0.5 hover:bg-amber-700 focus-visible:outline-none active:translate-y-0"
            >
              进入工作台
              <ArrowRight size={16} weight="bold" />
            </Link>
            <a
              href="#showcase"
              className="inline-flex items-center rounded-full border border-zinc-200 bg-white/70 px-6 py-3 text-sm font-semibold text-zinc-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none"
            >
              查看效果
            </a>
          </div>
        </div>

        <div className="relative min-h-[560px]">
          <div className="absolute inset-0 rounded-[2.4rem] border border-white/80 bg-white/55 shadow-[0_40px_120px_-70px_rgba(24,24,27,0.8)] backdrop-blur" />
          <div className="absolute left-5 top-5 w-[52%] overflow-hidden rounded-[2rem] bg-white shadow-[0_26px_80px_-48px_rgba(24,24,27,0.7)]">
            <Image src="/showcase/backpack.png" alt="徒步背包商品图示意" width={640} height={780} priority className="h-[410px] w-full object-cover" />
          </div>
          <div className="absolute right-5 top-12 w-[52%] overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_72px_-48px_rgba(24,24,27,0.65)]">
            <Image src="/showcase/sneakers.png" alt="篮球鞋商品图示意" width={640} height={640} priority className="h-[300px] w-full object-cover" />
          </div>
          <div className="absolute bottom-7 right-10 w-[58%] overflow-hidden rounded-[2rem] bg-white shadow-[0_26px_80px_-50px_rgba(24,24,27,0.68)]">
            <Image src="/showcase/keyboard.png" alt="机械键盘商品图示意" width={900} height={520} className="h-[230px] w-full object-cover" />
          </div>
          <div className="absolute bottom-20 left-12 rounded-3xl border border-zinc-200 bg-white/90 p-4 shadow-[0_22px_66px_-42px_rgba(24,24,27,0.65)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Flow</p>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {steps.map(step => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="w-16 rounded-2xl bg-zinc-50 p-2 text-center">
                    <Icon size={18} weight="duotone" className="mx-auto text-amber-700" />
                    <p className="mt-1 text-xs font-semibold text-zinc-800">{step.title}</p>
                    <p className="text-[10px] text-zinc-400">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="showcase" className="border-y border-zinc-200/70 bg-white py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">商品图示意</h2>
            <Link href="/dashboard" className="hidden text-sm font-semibold text-amber-700 hover:text-amber-800 sm:inline">
              去生成
            </Link>
          </div>
          <div className="-mx-6 flex snap-x gap-4 overflow-x-auto px-6 pb-3">
            {showcaseItems.map(item => (
              <article key={item.title} className="min-w-[76vw] snap-start overflow-hidden rounded-3xl border border-zinc-200 bg-stone-50 sm:min-w-[330px]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={item.src} alt={`${item.title} 商品图示意`} width={720} height={540} className="h-full w-full object-cover" />
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <h3 className="text-sm font-semibold text-zinc-900">{item.title}</h3>
                  <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">{item.tag}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
