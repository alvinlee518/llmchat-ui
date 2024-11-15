import { Alova } from '@/utils/http/alova/index';

export function queryPage(params) {
  return Alova.Get<any>(`/user/list`, { params });
}

export function remove(params) {
  return Alova.Delete<any>(`/user/${params}`);
}

export function create(data) {
  return Alova.Post<any>('/user/create', data);
}

export function modify(data) {
  return Alova.Put<any>('/user/modify', data);
}

export function detail(id) {
  return Alova.Get<any>(`/user/${id}`);
}
