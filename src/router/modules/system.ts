import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { OptionsSharp } from '@vicons/ionicons5';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/system',
    name: 'System',
    redirect: '/system/menu',
    component: Layout,
    meta: {
      title: '系统设置',
      icon: renderIcon(OptionsSharp),
      sort: 20,
    },
    children: [
      {
        path: 'dict',
        name: 'system_dict',
        meta: {
          title: '字典管理',
        },
        component: () => import('@/views/system/dict/index.vue'),
      },
      {
        path: 'dict_list',
        name: 'dict_list',
        meta: {
          title: '字典数据',
          hidden: true,
        },
        component: () => import('@/views/system/dict/list.vue'),
      },
      {
        path: 'position',
        name: 'system_position',
        meta: {
          title: '岗位管理',
        },
        component: () => import('@/views/system/position/index.vue'),
      },
      {
        path: 'dept',
        name: 'system_dept',
        meta: {
          title: '部门管理',
        },
        component: () => import('@/views/system/dept/index.vue'),
      },
      {
        path: 'user',
        name: 'system_user',
        meta: {
          title: '用户管理',
        },
        component: () => import('@/views/system/user/index.vue'),
      },
      {
        path: 'role',
        name: 'system_role',
        meta: {
          title: '角色管理',
        },
        component: () => import('@/views/system/role/index.vue'),
      },
      {
        path: 'menu',
        name: 'system_menu',
        meta: {
          title: '菜单管理',
        },
        component: () => import('@/views/system/menu/index.vue'),
      },
    ],
  },
];

export default routes;
