import { Alova } from '@/utils/http/alova/index';

export function queryPage(params) {
  return Alova.Get<any>(`/dept/list`, { params });
}

export function remove(params) {
  return Alova.Delete<any>(`/dept/${params}`);
}

export function create(data) {
  return Alova.Post<any>('/dept/create', data);
}

export function modify(data) {
  return Alova.Put<any>('/dept/modify', data);
}

export function detail(id) {
  return Alova.Get<any>(`/dept/${id}`);
}

export function getDeptTree(pid) {
  return Alova.Get<any>(`/dept/tree/${pid}`);
}
