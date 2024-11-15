import { Alova } from '@/utils/http/alova/index';

export function queryPage(params) {
  return Alova.Get<any>(`/role/list`, { params });
}

export function remove(params) {
  return Alova.Delete<any>(`/role/${params}`);
}

export function create(data) {
  return Alova.Post<any>('/role/create', data);
}

export function modify(data) {
  return Alova.Put<any>('/role/modify', data);
}

export function detail(id) {
  return Alova.Get<any>(`/role/${id}`);
}

export function getDataScope(id) {
  return Alova.Get<any>(`/role/data_scope/${id}`);
}

export function saveDataScope(data) {
  return Alova.Post<any>(`/role/data_scope`, data);
}

export function getMenuScope(id) {
  return Alova.Get<any>(`/role/menu_scope/${id}`);
}

export function saveMenuScope(data) {
  return Alova.Post<any>(`/role/menu_scope`, data);
}

export function getUserScope(params) {
  return Alova.Get<any>(`/role/user_scope`, { params });
}

export function allocated(data) {
  return Alova.Post<any>(`/role/allocated`, data);
}

export function unallocated(data) {
  return Alova.Post<any>(`/role/unallocated`, data);
}

export function selectOptions() {
  return Alova.Get<any>(`/role/select_options`);
}
