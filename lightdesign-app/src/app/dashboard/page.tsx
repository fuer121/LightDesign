'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowCounterClockwise, Image as ImageIcon, Sparkle } from '@phosphor-icons/react';
import CreateStudio from '@/components/CreateStudio';
import type { Task } from '@/lib/types';
import { PLATFORM_SPECS, STYLE_LABELS } from '@/lib/types';

function loadTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  try { const s = localStorage.getItem('lightdesign_tasks'); return s ? JSON.parse(s) : []; }
  catch { return []; }
}

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setTasks(loadTasks());
      setLoaded(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const isEmpty = loaded && tasks.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 pt-10">
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Workspace</p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 text-balance">工作台</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <CreateStudio
          showBack={false}
          eyebrow="Create"
          title="上传商品图，填写卖点"
          className="min-w-0"
        />

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">最近任务</h2>
            {!isEmpty && loaded && (
              <span className="text-xs text-zinc-300">{tasks.length} 条记录</span>
            )}
          </div>

          {!loaded && (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="surface-grain flex items-center gap-4 rounded-2xl border border-zinc-200/70 bg-white px-5 py-4 shadow-[0_10px_28px_-20px_rgba(24,24,27,0.35)]">
                  <div className="h-12 w-12 animate-pulse rounded-xl bg-zinc-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 animate-pulse rounded-md bg-zinc-100" />
                    <div className="h-3 w-32 animate-pulse rounded-md bg-zinc-50" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {isEmpty && (
            <div className="surface-grain flex flex-col items-center rounded-3xl border border-zinc-200/70 bg-white py-16 text-center shadow-[0_16px_42px_-30px_rgba(24,24,27,0.35)]">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
                <ImageIcon size={28} weight="duotone" className="text-zinc-300" />
              </div>
              <p className="text-sm font-medium text-zinc-500">还没有生成任务</p>
            </div>
          )}

          {loaded && !isEmpty && (
            <div className="space-y-2">
              {tasks.slice(0, 20).map(t => {
                const spec = PLATFORM_SPECS[t.platform];
                const isExported = t.status === 'exported';
                const isDraft = t.status === 'draft';

                return (
                  <div
                    key={t.id}
                    className="group surface-grain flex items-center gap-4 rounded-2xl border border-zinc-200/70 bg-white px-5 py-4 shadow-[0_8px_26px_-22px_rgba(24,24,27,0.5)] transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_18px_30px_-24px_rgba(24,24,27,0.35)]"
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-50">
                      <ImageIcon size={22} weight="duotone" className="text-zinc-300" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-zinc-800">{t.title}</span>
                        {isExported && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600">
                            <Sparkle size={10} weight="fill" /> 已导出
                          </span>
                        )}
                        {isDraft && (
                          <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-500">草稿</span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-zinc-400">
                        {spec?.label || t.platform} · {STYLE_LABELS[t.style] || t.style} · {t.date}
                      </p>
                    </div>

                    <div className="flex-shrink-0 opacity-0 transition group-hover:opacity-100">
                      {isExported && (
                        <button
                          onClick={() => {
                            localStorage.setItem('lightdesign_reuse', JSON.stringify({ platform: t.platform, style: t.style }));
                            router.push('/dashboard');
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-none active:scale-[0.98]"
                        >
                          <ArrowCounterClockwise size={12} weight="bold" />
                          复用
                        </button>
                      )}
                      {isDraft && (
                        <Link
                          href="/dashboard"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-200 focus-visible:outline-none active:scale-[0.98]"
                        >
                          继续
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
