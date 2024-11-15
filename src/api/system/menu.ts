import { Alova } from '@/utils/http/alova/index';

export function queryPage(params) {
  return Alova.Get<any>(`/menu/list`, { params });
}

export function remove(params) {
  return Alova.Delete<any>(`/menu/${params}`);
}

export function create(data) {
  return Alova.Post<any>('/menu/create', data);
}

export function modify(data) {
  return Alova.Put<any>('/menu/modify', data);
}

export function detail(id) {
  return Alova.Get<any>(`/menu/${id}`);
}

export function getMenuTree(pid) {
  return Alova.Get<any>(`/menu/tree/${pid}`);
}
