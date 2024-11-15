import { Alova } from '@/utils/http/alova/index';

export function queryPage(params) {
  return Alova.Get<any>(`/post/list`, { params });
}

export function remove(params) {
  return Alova.Delete<any>(`/post/${params}`);
}

export function create(data) {
  return Alova.Post<any>('/post/create', data);
}

export function modify(data) {
  return Alova.Put<any>('/post/modify', data);
}

export function detail(id) {
  return Alova.Get<any>(`/post/${id}`);
}

export function selectOptions() {
  return Alova.Get<any>(`/post/select_options`);
}
