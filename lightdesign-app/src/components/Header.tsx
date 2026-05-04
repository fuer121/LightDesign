'use client';

import Link from 'next/link';
import { User } from '@phosphor-icons/react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-zinc-200/70 bg-white/80 px-6 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-2 text-base font-semibold tracking-tight text-zinc-900">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-xs font-bold text-white">
          L
        </span>
        LightDesign
      </Link>

      <div className="flex items-center gap-3">
        <span className="text-xs text-zinc-400">MVP</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 transition hover:bg-zinc-200">
          <User weight="fill" size={16} />
        </div>
      </div>
    </header>
  );
}
