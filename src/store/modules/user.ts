import { defineStore } from 'pinia';
import { store } from '@/store';
import { ACCESS_TOKEN, CURRENT_USER, IS_SCREENLOCKED } from '@/store/mutation-types';
import { ResultEnum } from '@/enums/httpEnum';

import { getUserInfo as getUserInfoApi, login, logout as logoutApi } from '@/api/system/account';
import { storage } from '@/utils/Storage';

export interface IUserState {
  token: string;
  username: string;
  welcome: string;
  avatar: string;
  permissions: any[];
  info: any;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: storage.get(ACCESS_TOKEN, ''),
    username: '',
    welcome: '',
    avatar: '',
    permissions: [],
    info: storage.get(CURRENT_USER, {}),
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getNickname(): string {
      return this.username;
    },
    getPermissions(): [any][] {
      return this.permissions;
    },
    getUserInfo(): any {
      return this.info;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setAvatar(avatar: string) {
      this.avatar = avatar;
    },
    setPermissions(permissions) {
      this.permissions = permissions;
    },
    setUserInfo(info: any) {
      this.info = info;
    },
    // 登录
    async login(params: any) {
      this.setToken('');
      const response = await login(params);
      const { data, code } = response;
      if (code === ResultEnum.SUCCESS) {
        const ex = 7 * 24 * 60 * 60;
        storage.set(ACCESS_TOKEN, data, ex);
        storage.set(IS_SCREENLOCKED, false);
        this.setToken(data);
      }
      return response;
    },

    // 获取用户信息
    async getInfo() {
      const { data } = await getUserInfoApi();
      if (data.permissions && data.permissions.length) {
        const permissionsList = data.permissions;
        this.setPermissions(permissionsList);
      }
      this.setUserInfo(data.user);
      // this.setAvatar(result.avatar);
      return data;
    },

    // 登出
    async logout() {
      this.setPermissions([]);
      this.setUserInfo({ username: '', email: '' });
      storage.remove(ACCESS_TOKEN);
      storage.remove(CURRENT_USER);
      await logoutApi();
    },
  },
});

// Need to be used outside the setup
export function useUser() {
  return useUserStore(store);
}
