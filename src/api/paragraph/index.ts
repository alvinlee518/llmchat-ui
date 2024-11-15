import { Alova } from '@/utils/http/alova/index';

export function queryPage(params) {
  return Alova.Get<any>(`/paragraph/list`, { params });
}

export function remove(params) {
  return Alova.Delete<any>(`/paragraph/${params}`);
}

export function create(data) {
  return Alova.Post<any>('/paragraph/create', data);
}

export function modify(data) {
  return Alova.Put<any>('/paragraph/modify', data);
}

export function detail(id) {
  return Alova.Get<any>(`/paragraph/${id}`);
}

export function enabled(data) {
  return Alova.Put<any>(`/paragraph/enabled`, data);
}
