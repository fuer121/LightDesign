'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGen } from '@/components/GenContext';
import { Image as ImageIcon, XCircle } from '@phosphor-icons/react';
import type { GenerationResult } from '@/lib/types';

export default function GeneratingPage() {
  const router = useRouter();
  const { input, previewUrl, setResult, uploadedFile } = useGen();
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const doneRef = useRef(false);

  useEffect(() => {
    if (!input || doneRef.current) { if (!input) router.replace('/create'); return; }
    doneRef.current = true;

    const startTime = Date.now();
    const total = 30000;

    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min(95, (elapsed / total) * 100));
      setTimeLeft(Math.max(1, Math.round((total - elapsed) / 1000)));
    }, 400);

    const formData = new FormData();
    formData.append('selling1', input.selling1);
    formData.append('selling2', input.selling2);
    if (input.selling3) formData.append('selling3', input.selling3);
    formData.append('platform', input.platform);
    formData.append('style', input.style);
    if (uploadedFile) formData.append('image', uploadedFile);

    fetch('/api/generate', { method: 'POST', body: formData })
      .then(async res => {
        clearInterval(progressTimer);
        if (!res.ok) { const d = await res.json(); throw new Error(d.error || '生成失败'); }
        const data: GenerationResult = await res.json();
        setProgress(100); setStatus('done'); setResult(data);
        setTimeout(() => router.push('/result'), 1200);
      })
      .catch(e => {
        clearInterval(progressTimer);
        setStatus('error');
        setErrorMsg(e instanceof Error ? e.message : '未知错误');
      });

    return () => clearInterval(progressTimer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-24">
      {/* Image preview skeleton */}
      <div className="surface-grain relative mb-10 flex h-80 w-80 items-center justify-center overflow-hidden rounded-[2rem] border border-zinc-200/70 bg-white shadow-[0_24px_50px_-36px_rgba(24,24,27,0.45)]">
        {previewUrl ? (
          <img src={previewUrl} alt="当前待生成的商品照片预览" className="h-full w-full object-cover opacity-70" />
        ) : (
          <ImageIcon size={56} weight="duotone" className="text-zinc-300" />
        )}
        {/* Pulse overlay */}
        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 animate-pulse rounded-2xl bg-zinc-200/80" />
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-5 h-1.5 w-80 overflow-hidden rounded-full bg-zinc-200">
        <div
          className="h-full rounded-full bg-amber-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status */}
      {status === 'loading' && (
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-600">
            生成中<span className="animate-pulse">...</span>
          </p>
          <p className="mt-1 text-xs text-zinc-400">预计还需 {timeLeft} 秒</p>
        </div>
      )}

      {status === 'done' && (
        <p className="text-sm font-medium text-emerald-600">生成完成，即将跳转</p>
      )}

      {status === 'error' && (
        <div className="text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
            <XCircle size={24} weight="fill" className="text-red-400" />
          </div>
          <p className="text-sm font-medium text-red-600">生成失败</p>
          <p className="mt-1 text-xs text-zinc-400">{errorMsg}</p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => { doneRef.current = false; router.refresh(); }}
            className="rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-amber-700 focus-visible:outline-none active:scale-[0.98]"
            >
              重试
            </button>
            <button
              onClick={() => router.push('/create')}
              className="rounded-xl bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-200 focus-visible:outline-none active:scale-[0.98]"
            >
              返回编辑
            </button>
          </div>
        </div>
      )}

      {status === 'loading' && (
        <button
          onClick={() => router.push('/create')}
          className="mt-10 rounded-xl bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-500 transition hover:bg-zinc-200 focus-visible:outline-none active:scale-[0.98]"
        >
          取消生成
        </button>
      )}
    </div>
  );
}
