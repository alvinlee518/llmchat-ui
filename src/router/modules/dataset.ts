import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { BookSharp } from '@vicons/ionicons5';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/dataset',
    name: 'dataset',
    component: Layout,
    meta: {
      title: '知识库管理',
      icon: renderIcon(BookSharp),
      sort: 11,
    },
    children: [
      {
        path: 'index',
        name: `dataset_index`,
        meta: {
          title: '知识库管理',
          activeMenu: 'dataset_index',
        },
        component: () => import('@/views/dataset/index.vue'),
      },
      {
        path: 'create/',
        name: 'dataset_create',
        meta: {
          title: '创建知识库',
          hidden: true,
          activeMenu: 'dataset_create',
        },
        component: () => import('@/views/dataset/create.vue'),
      },
      {
        path: 'modify/:id?',
        name: 'dataset_modify',
        meta: {
          title: '编辑知识库',
          hidden: true,
          activeMenu: 'dataset_modify',
        },
        component: () => import('@/views/dataset/modify.vue'),
      },
      {
        path: 'detail/:id?',
        name: 'dataset_detail',
        meta: {
          title: '查看知识库',
          hidden: true,
          activeMenu: 'dataset_detail',
        },
        component: () => import('@/views/dataset/detail.vue'),
      },
      {
        path: 'import/:id?',
        name: 'dataset_import',
        meta: {
          title: '导入数据',
          hidden: true,
          activeMenu: 'dataset_import',
        },
        component: () => import('@/views/dataset/import.vue'),
      },
      {
        path: 'paragraph/:id?',
        name: 'dataset_paragraph',
        meta: {
          title: '查看文档',
          hidden: true,
          activeMenu: 'dataset_paragraph',
        },
        component: () => import('@/views/dataset/paragraph.vue'),
      },
      {
        path: 'testing/:id?',
        name: 'dataset_testing',
        meta: {
          title: '命中测试',
          hidden: true,
          activeMenu: 'dataset_testing',
        },
        component: () => import('@/views/dataset/testing.vue'),
      },
    ],
  },
];

export default routes;
