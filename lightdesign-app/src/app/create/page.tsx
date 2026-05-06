'use client';

import { useState, useRef } from 'react';
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

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const COMPRESS_THRESHOLD_BYTES = 2 * 1024 * 1024;
const MAX_IMAGE_EDGE = 1024;
const JPEG_QUALITY = 0.85;

type ImageDimensions = {
  width: number;
  height: number;
};

function loadImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: image.naturalWidth || image.width, height: image.naturalHeight || image.height });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('图片读取失败'));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('图片压缩失败'));
          return;
        }
        resolve(blob);
      },
      type,
      type === 'image/jpeg' ? JPEG_QUALITY : undefined,
    );
  });
}

async function downsampleImage(file: File, dimensions: ImageDimensions): Promise<File> {
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(dimensions.width, dimensions.height));
  const targetWidth = Math.max(1, Math.round(dimensions.width * scale));
  const targetHeight = Math.max(1, Math.round(dimensions.height * scale));
  const url = URL.createObjectURL(file);
  const image = new Image();

  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('图片读取失败'));
      image.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext('2d');
    if (!context) throw new Error('当前浏览器不支持图片压缩');

    context.drawImage(image, 0, 0, targetWidth, targetHeight);
    const blob = await canvasToBlob(canvas, file.type);

    return new File([blob], file.name, {
      type: file.type,
      lastModified: file.lastModified,
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function prepareImageFile(file: File): Promise<File> {
  const dimensions = await loadImageDimensions(file);
  const longEdge = Math.max(dimensions.width, dimensions.height);
  const shouldDownsample = file.size > COMPRESS_THRESHOLD_BYTES || longEdge > MAX_IMAGE_EDGE;

  if (!shouldDownsample) return file;

  return downsampleImage(file, dimensions);
}

function getReusePreferences(): Pick<GenerationInput, 'platform' | 'style'> | null {
  if (typeof window === 'undefined') return null;

  try {
    const reuse = localStorage.getItem('lightdesign_reuse');
    if (!reuse) return null;

    const parsed = JSON.parse(reuse) as Partial<Pick<GenerationInput, 'platform' | 'style'>>;
    localStorage.removeItem('lightdesign_reuse');

    if (!parsed.platform || !parsed.style) return null;
    return {
      platform: parsed.platform,
      style: parsed.style,
    };
  } catch {
    return null;
  }
}

export default function CreatePage() {
  const router = useRouter();
  const { setInput, setUploadedFile, setPreviewUrl, previewUrl } = useGen();
  const fileRef = useRef<HTMLInputElement>(null);
  const [reusePreferences] = useState(() => getReusePreferences());

  const [selling1, setSelling1] = useState('');
  const [selling2, setSelling2] = useState('');
  const [selling3, setSelling3] = useState('');
  const [platform, setPlatform] = useState<GenerationInput['platform'] | null>(reusePreferences?.platform ?? null);
  const [style, setStyle] = useState<GenerationInput['style'] | null>(reusePreferences?.style ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setUploadError(null);
    if (!file.type.match(/image\/(jpeg|png)/)) { setUploadError('仅支持 JPG 和 PNG 格式'); return; }
    if (file.size > MAX_UPLOAD_BYTES) { setUploadError('文件大小不能超过 10MB'); return; }

    try {
      const preparedFile = await prepareImageFile(file);
      setUploadedFile(preparedFile);
      setPreviewUrl(URL.createObjectURL(preparedFile));
    } catch {
      setUploadError('图片处理失败，请更换图片后重试');
    }
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
          {uploadError ? <p className="mt-3 text-sm font-medium text-red-500">{uploadError}</p> : null}
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
