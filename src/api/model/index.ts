import { Alova } from '@/utils/http/alova/index';

export function queryPage(params) {
  return Alova.Get<any>(`/model/list`, { params });
}

export function remove(params) {
  return Alova.Delete<any>(`/model/${params}`);
}

export function create(data) {
  return Alova.Post<any>('/model/create', data);
}

export function modify(data) {
  return Alova.Put<any>('/model/modify', data);
}

export function detail(id) {
  return Alova.Get<any>(`/model/${id}`);
}

export function selectGroupOptions(modelType) {
  return Alova.Get<any>(`/model/select_group/${modelType}`);
}

export function modelProviders() {
  return Alova.Get<any>(`/model/providers`);
}
