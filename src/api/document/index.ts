import { Alova } from '@/utils/http/alova/index';
import { objectToFormData } from '@octetstream/object-to-form-data';
import { useRequest } from 'alova/client';

export function queryPage(params) {
  return Alova.Get<any>(`/document/list`, { params });
}

export async function exportAll(id) {
  await Alova.Get<any>(`/document/export/${id}`, {
    meta: {
      dataType: 'blob',
      isReturnNativeResponse: true,
    },
    transform: (blob: Blob, headers) => {
      const contentDisposition = headers.get('content-disposition');
      const match = contentDisposition?.match(/filename\*?=(?:UTF-8'')?["']?([^"';\n]+)/i);
      const filename = match ? decodeURIComponent(match[1]) : 'downloaded-file';
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    },
  });
}

export function remove(params) {
  return Alova.Delete<any>(`/document/${params}`);
}

export async function create(data: any, fileList: File[]) {
  const { send } = useRequest(
    (files) => {
      const formData = objectToFormData(data);
      for (let index = 0; index < files.length; index++) {
        const element = files[index];
        formData.append(`files`, element);
      }
      return Alova.Post<InResult>('/document/create', formData);
    },
    { immediate: false }
  );
  return await send(fileList);
}

export function modify(data) {
  return Alova.Post<any>('/document/modify', data);
}

export function detail(id) {
  return Alova.Get<any>(`/document/${id}`);
}

export function reindex(id) {
  return Alova.Put<any>(`/document/reindex/${id}`);
}
