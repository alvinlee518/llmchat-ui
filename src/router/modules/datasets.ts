import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { BookSharp } from '@vicons/ionicons5';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/datasets',
    name: 'datasets',
    component: Layout,
    meta: {
      title: '知识库管理',
      icon: renderIcon(BookSharp),
      sort: 11,
    },
    children: [
      {
        path: 'index',
        name: `datasets_index`,
        meta: {
          title: '知识库管理',
          activeMenu: 'datasets_index',
        },
        component: () => import('@/views/datasets/index.vue'),
      },
      {
        path: 'create/',
        name: 'datasets_create',
        meta: {
          title: '创建知识库',
          hidden: true,
          activeMenu: 'datasets_create',
        },
        component: () => import('@/views/datasets/create.vue'),
      },
      {
        path: 'modify/:id?',
        name: 'datasets_modify',
        meta: {
          title: '编辑知识库',
          hidden: true,
          activeMenu: 'datasets_modify',
        },
        component: () => import('@/views/datasets/modify.vue'),
      },
      {
        path: 'detail/:id?',
        name: 'datasets_detail',
        meta: {
          title: '查看知识库',
          hidden: true,
          activeMenu: 'datasets_detail',
        },
        component: () => import('@/views/datasets/detail.vue'),
      },
      {
        path: 'import/:id?',
        name: 'datasets_import',
        meta: {
          title: '导入数据',
          hidden: true,
          activeMenu: 'datasets_import',
        },
        component: () => import('@/views/datasets/import.vue'),
      },
      {
        path: 'paragraph/:id?',
        name: 'datasets_paragraph',
        meta: {
          title: '查看文件',
          hidden: true,
          activeMenu: 'datasets_paragraph',
        },
        component: () => import('@/views/datasets/paragraph.vue'),
      },
      {
        path: 'testing/:id?',
        name: 'datasets_testing',
        meta: {
          title: '命中测试',
          hidden: true,
          activeMenu: 'datasets_testing',
        },
        component: () => import('@/views/datasets/testing.vue'),
      },
    ],
  },
];

export default routes;
