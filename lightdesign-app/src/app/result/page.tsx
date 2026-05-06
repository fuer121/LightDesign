'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGen } from '@/components/GenContext';
import {
  PaperPlaneTilt, DownloadSimple, Plus,
  CaretLeft, CaretRight, ArrowLeft, ChatCenteredText, Image as ImageIcon,
} from '@phosphor-icons/react';
import type { ChatMessage, ImageVersion, AdjustResult } from '@/lib/types';
import { PLATFORM_SPECS, STYLE_LABELS } from '@/lib/types';

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

export default function ResultPage() {
  const router = useRouter();
  const { result, input } = useGen();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [versions, setVersions] = useState<ImageVersion[]>([]);
  const [currentVersion, setCurrentVersion] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  // 初始化：把首次生成结果作为 v0
  useEffect(() => {
    if (!result || !input) { router.replace('/create'); return; }

    const v0: ImageVersion = {
      id: 'v0',
      imageUrl: result.imageUrl,
      prompt: result.prompt || '',
      instruction: '初始生成',
      createdAt: result.generatedAt,
    };
    const frame = window.requestAnimationFrame(() => {
      setVersions([v0]);
      setCurrentVersion(0);
      setMessages([
        {
          id: uid(),
          role: 'assistant',
          content: `已根据你的商品信息和"${STYLE_LABELS[result.style] || result.style}"风格生成了${PLATFORM_SPECS[result.platform]?.label || result.platform}平台主图。你可以用自然语言告诉我如何调整，比如"把背景换成蓝色"、"文字放大一些"、"商品往左移"。`,
          timestamp: new Date().toISOString(),
          imageUrl: result.imageUrl,
        },
      ]);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 自动滚动
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const showToast = (msg: string) => {
    setToast(msg); setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3500);
  };

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || loading || !input) return;
    setDraft('');

    const userMsg: ChatMessage = {
      id: uid(), role: 'user', content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const history = messages
        .filter(m => m.role === 'user' || (m.role === 'assistant' && m.content))
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: versions[currentVersion]?.imageUrl || result?.imageUrl,
          instruction: text,
          history,
          baseInput: input,
        }),
      });

      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || '调整失败');
      }

      const data: AdjustResult = await res.json();

      const newVersion: ImageVersion = {
        id: data.versionId,
        imageUrl: data.imageUrl,
        prompt: data.prompt,
        instruction: data.instruction,
        createdAt: data.generatedAt,
      };

      setVersions(prev => {
        const updated = [...prev];
        // 如果当前不在最新版本，截断后面的历史
        if (currentVersion < prev.length - 1) {
          updated.splice(currentVersion + 1);
        }
        updated.push(newVersion);
        return updated;
      });
      setCurrentVersion(prev => {
        const idx = prev + 1;
        return idx;
      });

      const assistantMsg: ChatMessage = {
        id: uid(), role: 'assistant',
        content: `已根据"${text}"重新生成。${adjustmentFeedback(text)}`,
        timestamp: new Date().toISOString(),
        imageUrl: data.imageUrl,
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e: unknown) {
      const errMsg: ChatMessage = {
        id: uid(), role: 'assistant',
        content: `抱歉，调整失败: ${e instanceof Error ? e.message : '未知错误'}。请重试。`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const switchVersion = (idx: number) => {
    setCurrentVersion(idx);
  };

  const handleExport = () => {
    const v = versions[currentVersion];
    if (!v) return;
    showToast('图片已导出（PNG）');

    const tasks = (() => {
      try { return JSON.parse(localStorage.getItem('lightdesign_tasks') || '[]'); } catch { return []; }
    })();
    tasks.unshift({
      id: Date.now().toString(),
      title: `商品主图 · ${result ? STYLE_LABELS[result.style] : ''}`,
      platform: result?.platform || '',
      style: result?.style || '',
      date: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      status: 'exported',
      input,
    });
    if (tasks.length > 20) tasks.splice(20);
    localStorage.setItem('lightdesign_tasks', JSON.stringify(tasks));

    const a = document.createElement('a');
    a.href = v.imageUrl;
    a.download = `lightdesign_${Date.now()}.png`;
    a.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const activeImage = versions[currentVersion]?.imageUrl || result?.imageUrl || null;
  const spec = result ? PLATFORM_SPECS[result.platform] : null;

  // 无数据时等待重定向，不渲染
  if (!result || !input) {
    return (
      <div className="flex h-[calc(100dvh-56px)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-amber-200 border-t-amber-500" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-56px)]">
      {/* ====== 左侧：图片预览区 ====== */}
      <div className="flex flex-1 flex-col items-center justify-center bg-zinc-100 p-6">
        {/* 图片 */}
        <div className="relative flex max-h-full max-w-full items-center justify-center">
          {activeImage ? (
            <img
              src={activeImage}
              alt="产品主图"
              className="max-h-[70dvh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
          ) : (
            <div className="flex h-80 w-80 items-center justify-center rounded-2xl bg-zinc-200">
              <ImageIcon size={48} weight="duotone" className="text-zinc-400" />
            </div>
          )}
          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/20 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-white border-t-transparent" />
                <span className="text-sm font-medium text-white">调整中...</span>
              </div>
            </div>
          )}
        </div>

        {/* 版本指示器 */}
        {versions.length > 1 && (
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => switchVersion(Math.max(0, currentVersion - 1))}
              disabled={currentVersion === 0}
              className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-zinc-500 transition hover:bg-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <CaretLeft size={12} weight="bold" />
              上一版
            </button>
            <div className="flex gap-1.5">
              {versions.map((_v, i) => (
                <button
                  key={i}
                  onClick={() => switchVersion(i)}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    i === currentVersion
                      ? 'bg-amber-500 shadow-[0_0_0_3px_rgba(217,119,6,.25)]'
                      : 'bg-zinc-300 hover:bg-zinc-400'
                  }`}
                  title={`版本 ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => switchVersion(Math.min(versions.length - 1, currentVersion + 1))}
              disabled={currentVersion === versions.length - 1}
              className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-zinc-500 transition hover:bg-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30"
            >
              下一版
              <CaretRight size={12} weight="bold" />
            </button>
            <span className="text-xs text-zinc-400">
              v{currentVersion + 1}/{versions.length}
            </span>
          </div>
        )}

        {/* 底部信息 & 操作 */}
        {spec && (
          <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
            <span>{spec.label} · {STYLE_LABELS[result!.style]}</span>
            <span>·</span>
            <span>{spec.width}×{spec.height}px</span>
            <button
              onClick={handleExport}
              className="ml-3 inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-amber-200 transition hover:bg-amber-600 active:scale-[0.98]"
            >
              <DownloadSimple size={12} weight="bold" />
              导出此版本
            </button>
            <Link
              href="/create"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/80 px-3 py-1.5 text-xs font-medium text-zinc-500 transition hover:bg-white active:scale-[0.98]"
            >
              <Plus size={12} weight="bold" />
              新建任务
            </Link>
          </div>
        )}
      </div>

      {/* ====== 右侧：对话面板 ====== */}
      <div className="flex w-[380px] flex-shrink-0 flex-col border-l border-zinc-200 bg-white">
        {/* 标题 */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <ChatCenteredText size={16} weight="duotone" className="text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-700">对话调整</h2>
          </div>
          <span className="text-[11px] text-zinc-300">
            {versions.length} 个版本
          </span>
        </div>

        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${m.role === 'user' ? 'order-1' : ''}`}>
                {/* 气泡 */}
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-amber-500 text-white rounded-br-md'
                      : 'bg-zinc-100 text-zinc-700 rounded-bl-md'
                  }`}
                >
                  {m.content}
                </div>

                {/* 附带的小缩略图 */}
                {m.imageUrl && (
                  <div className="mt-2 overflow-hidden rounded-lg border border-zinc-100 shadow-sm">
                    <img src={m.imageUrl} alt="" className="w-full" />
                  </div>
                )}

                {/* 时间 */}
                <div
                  className={`mt-1 text-[10px] text-zinc-300 ${
                    m.role === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  {new Date(m.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {/* 加载中 — 跳动点 */}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md bg-zinc-100 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* 输入区 */}
        <div className="border-t border-zinc-100 px-4 py-3">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={'描述你想怎么调整，如「把背景换成蓝色」'}
              rows={2}
              maxLength={200}
              disabled={loading}
              className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 pr-12 text-sm outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!draft.trim() || loading}
              className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white transition hover:bg-amber-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-300"
            >
              <PaperPlaneTilt size={14} weight="fill" />
            </button>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-zinc-300">
            <span>Enter 发送，Shift+Enter 换行</span>
            <span>{draft.length}/200</span>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastVisible && (
        <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-2xl">
          {toast}
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-amber-600 active:scale-[0.98]"
          >
            <ArrowLeft size={12} weight="bold" />
            返回工作台
          </button>
        </div>
      )}
    </div>
  );
}

// 给调整结果加一句人性化反馈
function adjustmentFeedback(instruction: string): string {
  const lower = instruction.toLowerCase();
  if (lower.includes('背景') || lower.includes('底色')) return '看看新的背景效果如何？';
  if (lower.includes('文字') || lower.includes('字号') || lower.includes('字体')) return '文字样式已更新。';
  if (lower.includes('商品') || lower.includes('主体') || lower.includes('产品')) return '商品位置/大小已调整。';
  if (lower.includes('颜色') || lower.includes('色调')) return '配色已调整。';
  return '看看效果是否满意？可以继续调整。';
}
