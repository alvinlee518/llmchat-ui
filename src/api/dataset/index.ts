import { Alova } from '@/utils/http/alova/index';
import { useRequest } from 'alova/client';
import { objectToFormData } from '@octetstream/object-to-form-data';
export function queryPage(params) {
  return Alova.Get<any>(`/dataset/list`, { params });
}

export function remove(params) {
  return Alova.Delete<any>(`/dataset/${params}`);
}

export async function create(data: any, fileList: File[]) {
  const { send } = useRequest(
    (files) => {
      const formData = objectToFormData(data);
      for (let index = 0; index < files.length; index++) {
        const element = files[index];
        formData.append(`files`, element);
      }
      return Alova.Post<InResult>('/dataset/create', formData);
    },
    { immediate: false }
  );
  return await send(fileList);
}

export function modify(data) {
  return Alova.Put<any>('/dataset/modify', data);
}

export function detail(id) {
  return Alova.Get<any>(`/dataset/${id}`);
}

export function hitTesting(data) {
  return Alova.Post<InResult>('/dataset/hit-testing', data);
}
