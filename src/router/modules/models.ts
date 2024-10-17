import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { GridSharp } from '@vicons/ionicons5';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/models',
    name: 'models',
    component: Layout,
    meta: {
      sort: 10,
      isRoot: true,
      activeMenu: 'models_index',
      icon: renderIcon(GridSharp),
    },
    children: [
      {
        path: 'index',
        name: `models_index`,
        meta: {
          title: '模型管理',
          activeMenu: 'models_index',
        },
        component: () => import('@/views/models/index.vue'),
      },
    ],
  },
];

export default routes;
