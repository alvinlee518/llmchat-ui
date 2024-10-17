import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { AppsSharp } from '@vicons/ionicons5';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/apps',
    name: 'apps',
    component: Layout,
    meta: {
      title: '应用管理',
      icon: renderIcon(AppsSharp),
      sort: 12,
    },
    children: [
      {
        path: 'index',
        name: `apps_index`,
        meta: {
          title: '应用管理',
          activeMenu: 'apps_index',
        },
        component: () => import('@/views/apps/index.vue'),
      },
      {
        path: 'modify/:id?',
        name: `apps_modify`,
        meta: {
          title: '编辑应用',
          activeMenu: 'apps_modify',
          hidden: true,
        },
        component: () => import('@/views/apps/modify.vue'),
      },
      {
        path: 'overview/:id?',
        name: `apps_`,
        meta: {
          title: '监测应用',
          activeMenu: 'apps_overview',
          hidden: true,
        },
        component: () => import('@/views/apps/overview.vue'),
      },
      {
        path: 'preview/:id?',
        name: `apps_preview`,
        meta: {
          title: '预览应用',
          activeMenu: 'apps_preview',
          hidden: true,
        },
        component: () => import('@/views/apps/preview.vue'),
      },
    ],
  },
];

export default routes;
