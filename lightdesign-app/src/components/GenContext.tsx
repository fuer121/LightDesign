// 生成上下文 — 跨页面共享生成参数和结果
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { GenerationInput, GenerationResult } from '@/lib/types';

interface GenContextType {
  input: GenerationInput | null;
  result: GenerationResult | null;
  uploadedFile: File | null;
  previewUrl: string | null;
  setInput: (v: GenerationInput) => void;
  setResult: (v: GenerationResult) => void;
  setUploadedFile: (f: File | null) => void;
  setPreviewUrl: (u: string | null) => void;
  reset: () => void;
}

const GenContext = createContext<GenContextType>(null!);

export function GenProvider({ children }: { children: ReactNode }) {
  const [input, setInput] = useState<GenerationInput | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const reset = () => {
    setInput(null);
    setResult(null);
    setUploadedFile(null);
    setPreviewUrl(null);
  };

  return (
    <GenContext.Provider value={{ input, result, uploadedFile, previewUrl, setInput, setResult, setUploadedFile, setPreviewUrl, reset }}>
      {children}
    </GenContext.Provider>
  );
}

export function useGen() {
  return useContext(GenContext);
}
