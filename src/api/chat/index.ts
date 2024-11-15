import { Alova } from '@/utils/http/alova';
import { useEventStream } from '@/utils/http/event-stream';
export function prompt_optimize(data) {
  return Alova.Post<any>('/chat/prompt_optimize', data);
}

export async function debugChat(
  formData: any,
  callback: (message: any) => void,
  ctrl: AbortController
) {
  await useEventStream(
    '/chat/debug',
    formData,
    (data) => {
      const msg = JSON.parse(data) ?? {};
      callback(msg);
    },
    ctrl
  );
  return;
}

export async function streamingChat(
  formData: any,
  callback: (message: any) => void,
  ctrl: AbortController
) {
  await useEventStream(
    '/chat/streaming',
    formData,
    (data) => {
      const msg = JSON.parse(data) ?? {};
      callback(msg);
    },
    ctrl
  );
  return;
}

export function chatMessageList(chatId) {
  return Alova.Get<any>(`/chat/messages/${chatId}`);
}

export function remove(chatId) {
  return Alova.Delete<any>(`/chat/${chatId}`);
}

export function chatHistoryList(appId) {
  return Alova.Get<any>(`/chat/histories/${appId}`);
}

export function openChat(data) {
  return Alova.Post<any>('/chat/open', data);
}

export function modifyChat(data) {
  return Alova.Post<any>('/chat/modify', data);
}

export function chatRating(data) {
  return Alova.Post<any>('/chat/rating', data);
}

export function suggestedQuestions(chatId) {
  return Alova.Get<any>(`/chat/suggested/${chatId}`);
}
