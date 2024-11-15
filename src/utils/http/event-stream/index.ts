import { useGlobSetting } from '@/hooks/setting';
import { isString } from 'lodash-es';
import { useUser } from '@/store/modules/user';
import { isUrl } from '@/utils';
import { ContentTypeEnum } from '@/enums/httpEnum';

const { apiUrl, urlPrefix } = useGlobSetting();
export const useEventStream = async (
  url: string,
  data: any,
  callback: (message: any) => void,
  ctrl: AbortController
) => {
  const userStore = useUser();
  // 处理 api 请求前缀
  const isUrlStr = isUrl(url as string);
  if (!isUrlStr && urlPrefix) {
    url = `${urlPrefix}${url}`;
  }
  if (!isUrlStr && apiUrl && isString(apiUrl)) {
    url = `${apiUrl}${url}`;
  }
  const token = userStore.getToken;

  // @ts-ignore
  const Message = window.$message;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypeEnum.JSON,
        Authorization: token,
      } as HeadersInit,
      body: JSON.stringify(data),
      signal: ctrl.signal,
    } as RequestInit);

    if (!response.ok) {
      Message?.error('请求失败:' + response.statusText);
      console.error('request failed with status', response.status, response.statusText);
      return;
    }
    if (!response.headers.get('Content-Type')?.startsWith('text/event-stream')) {
      const { message } = response.json && (await response.json());
      Message?.error('请求失败:' + message);
      console.error(message);
      return;
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    async function readStream() {
      const { done, value } = await reader.read();
      if (done) return;
      let str = decoder.decode(value, { stream: true });
      buffer += str;
      const split = buffer.match(/data:.*}\n\n/g);
      if (split) {
        str = split.join('');
        buffer = buffer.replace(str, '');
      } else {
        return await readStream();
      }
      if (str && str.startsWith('data:')) {
        if (split) {
          for (const index in split) {
            callback(split[index].replace('data:', ''));
          }
        }
      }
      await readStream();
    }
    await readStream();
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      Message?.warning('请求已中止');
    } else {
      Message?.error('请求失败:' + err);
    }
  }
};
