import { Alova } from '@/utils/http/alova/index';
import { objectToFormData } from '@octetstream/object-to-form-data';
import { useRequest } from 'alova/client';

export function queryPage(params) {
  return Alova.Get<any>(`/document/list`, { params });
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

export function detail(id) {
  return Alova.Get<any>(`/document/${id}`);
}

export function reindex(id) {
  return Alova.Put<any>(`/document/${id}`);
}
