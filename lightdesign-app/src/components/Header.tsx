'use client';

import Link from 'next/link';
import { ArrowRight, SquaresFour, User } from '@phosphor-icons/react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-zinc-200/70 bg-white/82 px-6 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-2 text-base font-semibold tracking-tight text-zinc-900">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-xs font-bold text-white">
          L
        </span>
        LightDesign
      </Link>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-none sm:inline-flex"
        >
          <SquaresFour size={14} weight="bold" />
          工作台
        </Link>
        <Link
          href="/dashboard"
          className="hidden items-center gap-1.5 rounded-full bg-zinc-950 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-700 focus-visible:outline-none sm:inline-flex"
        >
          开始
          <ArrowRight size={13} weight="bold" />
        </Link>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 transition hover:bg-zinc-200">
          <User weight="fill" size={16} />
        </div>
      </div>
    </header>
  );
}
