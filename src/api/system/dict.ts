import { Alova } from '@/utils/http/alova/index';

export function queryPage(params) {
  return Alova.Get<any>(`/dict/list`, { params });
}

export function remove(params) {
  return Alova.Delete<any>(`/dict/${params}`);
}

export function create(data) {
  return Alova.Post<any>('/dict/create', data);
}

export function modify(data) {
  return Alova.Put<any>('/dict/modify', data);
}

export function detail(id) {
  return Alova.Get<any>(`/dict/${id}`);
}
