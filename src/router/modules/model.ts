import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { GridSharp } from '@vicons/ionicons5';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/model',
    name: 'model',
    component: Layout,
    meta: {
      sort: 12,
      isRoot: true,
      activeMenu: 'model_index',
      icon: renderIcon(GridSharp),
    },
    children: [
      {
        path: 'index',
        name: `model_index`,
        meta: {
          title: '模型管理',
          activeMenu: 'model_index',
        },
        component: () => import('@/views/model/index.vue'),
      },
    ],
  },
];

export default routes;
