import { Alova } from '@/utils/http/alova';
import { useRequest } from 'alova/client';

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return Alova.Get<InResult>('/account/user_detail', {});
}

/**
 * @description: 根据用户id获取用户菜单
 */
export function adminMenus() {
  return Alova.Get<any>('/account/route_list');
}

/**
 * @description: 用户登录
 */
export async function login(param) {
  const { send } = useRequest(
    (data) => {
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('password', data.password);
      return Alova.Post<InResult>('/security/login', formData);
    },
    { immediate: false }
  );
  return await send(param);
}

/**
 * @description: 用户登出
 */
export function logout() {
  return Alova.Get('/security/logout');
}

/**
 * @description: 用户修改密码
 */
export async function changePassword(param) {
  const { send } = useRequest(
    (data) => {
      const formData = new FormData();
      formData.append('newPassword', data.newPassword);
      formData.append('password', data.password);
      return Alova.Post<InResult>('/account/change_password', formData);
    },
    { immediate: false }
  );
  return await send(param);
}

export function changeInfo(data) {
  return Alova.Post(`/account/change_info`, data);
}
