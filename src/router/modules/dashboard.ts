import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { DashboardOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routeName = 'dashboard';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/dashboard',
    name: routeName,
    redirect: '/dashboard/workplace',
    component: Layout,
    meta: {
      title: 'Dashboard',
      icon: renderIcon(DashboardOutlined),
      sort: 0,
    },
    children: [
      {
        path: 'workplace',
        name: `${routeName}_workplace`,
        meta: {
          title: '工作台',
          keepAlive: true,
        },
        component: () => import('@/views/dashboard/workplace/workplace.vue'),
      },
    ],
  },
];

export default routes;
