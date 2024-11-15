import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { AppsSharp } from '@vicons/ionicons5';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/app',
    name: 'app',
    component: Layout,
    meta: {
      title: '应用管理',
      icon: renderIcon(AppsSharp),
      sort: 10,
    },
    children: [
      {
        path: 'index',
        name: `app_index`,
        meta: {
          title: '应用管理',
          activeMenu: 'app_index',
        },
        component: () => import('@/views/app/index.vue'),
      },
      {
        path: 'modify/:id?',
        name: `app_modify`,
        meta: {
          title: '编辑应用',
          activeMenu: 'app_modify',
          hidden: true,
        },
        component: () => import('@/views/app/modify.vue'),
      },
      {
        path: 'overview/:id?',
        name: `app_`,
        meta: {
          title: '监测应用',
          activeMenu: 'app_overview',
          hidden: true,
        },
        component: () => import('@/views/app/overview.vue'),
      },
      {
        path: 'preview/:id?',
        name: `app_preview`,
        meta: {
          title: '预览应用',
          activeMenu: 'app_preview',
          hidden: true,
        },
        component: () => import('@/views/app/preview.vue'),
      },
    ],
  },
];

export default routes;
