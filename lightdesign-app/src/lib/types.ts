// 核心类型定义

export interface GenerationInput {
  selling1: string;
  selling2: string;
  selling3?: string;
  platform: 'amazon' | 'taobao' | 'shopee' | 'general';
  style: 'clean' | 'lifestyle' | 'promo';
}

export interface GenerationResult {
  imageUrl: string;
  platform: string;
  style: string;
  generatedAt: string;
  prompt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  imageUrl?: string; // assistant 消息可附带生成的图
}

export interface ImageVersion {
  id: string;
  imageUrl: string;
  prompt: string;
  instruction: string; // 触发这次生成的用户指令
  createdAt: string;
}

export interface AdjustInput {
  imageUrl: string;       // 当前图像
  instruction: string;    // 用户的自然语言调整指令
  history: { role: string; content: string }[]; // 对话历史
  baseInput: GenerationInput; // 初始生成参数
}

export interface AdjustResult extends GenerationResult {
  instruction: string;
  versionId: string;
}

export interface Task {
  id: string;
  title: string;
  platform: string;
  style: string;
  date: string;
  status: 'exported' | 'draft' | 'failed';
  input?: GenerationInput;
  result?: GenerationResult;
}

export const PLATFORM_SPECS: Record<string, { label: string; width: number; height: number }> = {
  amazon:  { label: '亚马逊',   width: 2000, height: 2000 },
  taobao:  { label: '淘宝',    width: 800,  height: 800 },
  shopee:  { label: 'Shopee',  width: 1024, height: 1024 },
  general: { label: '通用',    width: 1200, height: 1200 },
};

export const STYLE_LABELS: Record<string, string> = {
  clean:     '简约白底',
  lifestyle: '场景化',
  promo:     '促销感',
};
