'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGen } from '@/components/GenContext';
import {
  ArrowLeft, Image as ImageIcon, X, AmazonLogo, ShoppingCart,
  Storefront, Globe, Palette, Sparkle, Lightning, Fire
} from '@phosphor-icons/react';
import type { GenerationInput } from '@/lib/types';
import { PLATFORM_SPECS } from '@/lib/types';

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  amazon:  <AmazonLogo size={28} weight="duotone" />,
  taobao:  <ShoppingCart size={28} weight="duotone" />,
  shopee:  <Storefront size={28} weight="duotone" />,
  general: <Globe size={28} weight="duotone" />,
};

const STYLE_ICONS: Record<string, React.ReactNode> = {
  clean:     <Palette size={28} weight="duotone" />,
  lifestyle: <Sparkle size={28} weight="duotone" />,
  promo:     <Fire size={28} weight="duotone" />,
};

const STYLE_LABELS: Record<string, string> = {
  clean: '简约白底', lifestyle: '场景化', promo: '促销感',
};

export default function CreatePage() {
  const router = useRouter();
  const { setInput, setUploadedFile, setPreviewUrl, previewUrl } = useGen();
  const fileRef = useRef<HTMLInputElement>(null);

  const [selling1, setSelling1] = useState('');
  const [selling2, setSelling2] = useState('');
  const [selling3, setSelling3] = useState('');
  const [platform, setPlatform] = useState<GenerationInput['platform'] | null>(null);
  const [style, setStyle] = useState<GenerationInput['style'] | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      const reuse = localStorage.getItem('lightdesign_reuse');
      if (reuse) { const d = JSON.parse(reuse); if (d.platform) setPlatform(d.platform); if (d.style) setStyle(d.style); localStorage.removeItem('lightdesign_reuse'); }
    } catch {}
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.match(/image\/(jpeg|png)/)) { alert('仅支持 JPG 和 PNG 格式'); return; }
    if (file.size > 10 * 1024 * 1024) { alert('文件大小不能超过 10MB'); return; }
    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const canSubmit = selling1.trim() && selling2.trim() && previewUrl && platform && style && !submitting;

  const handleSubmit = () => {
    if (!canSubmit || !platform || !style) return;
    setSubmitting(true);
    setInput({ selling1: selling1.trim(), selling2: selling2.trim(), selling3: selling3.trim() || undefined, platform, style });
    router.push('/generating');
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {/* Back + Title */}
      <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 transition hover:text-zinc-600">
        <ArrowLeft size={14} weight="bold" /> 返回工作台
      </Link>
      <h1 className="mb-10 text-2xl font-semibold tracking-tight text-zinc-900">新建生成任务</h1>

      {/* ====== Grid Form ====== */}
      <div className="space-y-10">
        {/* 1. Upload */}
        <section>
          <label className="mb-2.5 block text-sm font-semibold text-zinc-700">商品照片</label>
          {previewUrl ? (
            <div className="relative inline-block">
              <img src={previewUrl} alt="" className="max-h-52 rounded-2xl border border-zinc-200" />
              <button
                onClick={() => { setPreviewUrl(null); setUploadedFile(null); }}
                className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-white transition hover:bg-zinc-900 active:scale-90"
              >
                <X size={12} weight="bold" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              className="cursor-pointer rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/80 px-8 py-14 text-center transition hover:border-amber-300 hover:bg-amber-50/50"
            >
              <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100">
                <ImageIcon size={26} weight="duotone" className="text-zinc-400" />
              </div>
              <p className="text-sm font-medium text-zinc-500">点击或拖拽上传商品照片</p>
              <p className="mt-1.5 text-xs text-zinc-400">JPG / PNG，最大 10MB，最小 400×400px</p>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>
          )}
        </section>

        {/* 2. Selling points */}
        <section>
          <label className="mb-2.5 block text-sm font-semibold text-zinc-700">卖点文案</label>
          <p className="mb-3 text-xs text-zinc-400">每条最多 15 个字</p>
          <div className="grid gap-3">
            {[
              { value: selling1, set: setSelling1, placeholder: '卖点 1（必填），如：限时五折抢购', required: true },
              { value: selling2, set: setSelling2, placeholder: '卖点 2（必填），如：买二送一', required: true },
              { value: selling3, set: setSelling3, placeholder: '卖点 3（选填），如：全国包邮', required: false },
            ].map((f, i) => (
              <div key={i}>
                <input
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 placeholder:text-zinc-300"
                  value={f.value}
                  maxLength={15}
                  placeholder={f.placeholder}
                  onChange={e => f.set(e.target.value)}
                />
                <div className="mt-1 text-right text-xs text-zinc-300">{f.value.length}/15</div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Platform */}
        <section>
          <label className="mb-2.5 block text-sm font-semibold text-zinc-700">目标平台</label>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {Object.entries(PLATFORM_SPECS).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setPlatform(k as GenerationInput['platform'])}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-5 transition active:scale-[0.98] ${
                  platform === k
                    ? 'border-amber-400 bg-amber-50 text-amber-600 shadow-[0_0_0_3px_rgba(217,119,6,.12)]'
                    : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                {PLATFORM_ICONS[k]}
                <span className="text-xs font-semibold">{v.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 4. Style */}
        <section>
          <label className="mb-2.5 block text-sm font-semibold text-zinc-700">风格方向</label>
          <div className="grid grid-cols-3 gap-2.5">
            {(['clean', 'lifestyle', 'promo'] as const).map(k => (
              <button
                key={k}
                onClick={() => setStyle(k)}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-5 transition active:scale-[0.98] ${
                  style === k
                    ? 'border-amber-400 bg-amber-50 text-amber-600 shadow-[0_0_0_3px_rgba(217,119,6,.12)]'
                    : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                {STYLE_ICONS[k]}
                <span className="text-xs font-semibold">{STYLE_LABELS[k]}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Actions */}
      <div className="mt-12 flex gap-3 border-t border-zinc-200 pt-8">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`inline-flex items-center gap-2 rounded-xl px-7 py-3 text-sm font-semibold transition active:scale-[0.98] ${
            canSubmit
              ? 'bg-amber-500 text-white shadow-sm shadow-amber-200 hover:bg-amber-600'
              : 'cursor-not-allowed bg-zinc-100 text-zinc-300'
          }`}
        >
          <Lightning size={16} weight="fill" />
          {submitting ? '生成中...' : '生成产品主图'}
        </button>
        <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-6 py-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-200 active:scale-[0.98]">
          取消
        </Link>
      </div>
    </div>
  );
}
