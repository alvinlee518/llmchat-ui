import { Alova } from '@/utils/http/alova/index';

export function queryPage(params) {
  return Alova.Get<any>(`/app/list`, { params });
}

export function remove(params) {
  return Alova.Delete<any>(`/app/${params}`);
}

export function create(data) {
  return Alova.Post<any>('/app/create', data);
}

export function modify(data) {
  return Alova.Put<any>('/app/modify', data);
}

export function detail(id) {
  return Alova.Get<any>(`/app/${id}`);
}
