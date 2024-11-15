export enum ChatMessageType {
  SYSTEM = 'SYSTEM',
  USER = 'USER',
  AI = 'AI',
}

export interface ChatProps {
  chatId: string;
  appId: string;
  title: string;
}

export interface ChatMessage {
  id?: string;
  chatId?: string;
  role: ChatMessageType;
  content: string;
  error?: boolean;
  usage?: ChatUsage;
  citations?: ChatCitation[];
  createAt: string;
  loading?: boolean;
  rating?: number;
}

export interface ChatUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  duration: number;
}

export interface ChatCitation {
  id: string;
  name: string;
  url: string;
  segments: CitationSegment[];
}

export interface CitationSegment {
  id: string;
  index: number;
  text: string;
}

export interface TestingChatProps {
  chatId?: string;
  appId: string;
  prompt?: string;
  prologue?: string;
  modelId?: string;
  temperature?: number;
  maxTokens?: number;
  maxMemory?: number;
  sourceEnabled?: number;
  rerankId?: string;
  rewriteEnabled?: number;
  suggestEnabled?: number;
  topK?: number;
  score?: number;
  datasets?: number[];
}
