export enum RoleProps {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
}

export interface MessageProps {
  role: RoleProps;
  content: string;
  createAt: number;
  error?: boolean;
  loading?: boolean;
  liked?: boolean;
  disliked?: boolean;
  usage?: UsageProps;
  resources?: ResourceProps[];
}

export interface UsageProps {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  elapsedTime: number;
}

export interface ResourceProps {
  datasetId: number;
  datasetName: string;
  documentId: number;
  documentName: string;
  segmentId: number;
  segmentPosition: number;
}

export interface ChatProps {
  id: number;
  name: string;
}
