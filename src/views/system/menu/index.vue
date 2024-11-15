<template>
  <div>
    <n-card :bordered="false">
      <n-form
        ref="formRef"
        :model="searchForm"
        label-placement="left"
        :show-feedback="false"
        label-width="auto"
      >
        <n-grid :cols="4">
          <n-gi>
            <n-form-item label="菜单名称" path="name">
              <n-input v-model:value="searchForm.name" placeholder="请输入菜单名称" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="状态" path="status">
              <n-select v-model:value="searchForm.status" clearable :options="RowStateOptions" />
            </n-form-item>
          </n-gi>
          <n-gi />
          <n-gi>
            <n-space justify="end">
              <n-button @click="onSearch"> 查询 </n-button>
              <n-button type="info" @click="onCreate(0)"> 新增 </n-button>
            </n-space>
          </n-gi>
        </n-grid>
      </n-form>
    </n-card>
    <n-card :bordered="false" class="mt-2">
      <n-data-table
        remote
        :bordered="false"
        :columns="columns"
        :data="dataList"
        :cascade="false"
        :row-key="(row) => row.id"
        :pagination="pagination"
        @load="onLoad"
      />
    </n-card>
    <CreateModal ref="createModalRef" @on-close="onSearch" />
  </div>
</template>

<script setup lang="ts">
  import { h, onMounted, reactive, ref } from 'vue';
  import { NText, NButton, NDivider, NPopconfirm } from 'naive-ui';
  import { RowStateOptions, findBooleanLabel, findMenuTypeLabel } from '@/utils/optionsUtil';
  import { queryPage, remove } from '@/api/system/menu';
  import CreateModal from './component/CreateModal.vue';
  const createModalRef: any = ref(null);
  const dataList = ref<any[]>([]);
  const searchForm = ref<{
    name: string;
    status?: number;
    page: number;
    size: number;
    parentId: number;
  }>({
    page: 1,
    size: 10,
    name: '',
    parentId: 0,
  });

  const columns = [
    {
      title: '菜单名称',
      key: 'name',
    },
    {
      title: '请求地址',
      key: 'path',
      width: 180,
    },
    {
      title: '权限标识',
      key: 'perms',
      width: 180,
    },
    {
      title: '菜单类型',
      key: 'menuType',
      width: 80,
      render(row) {
        return h(
          NText,
          {},
          {
            default: () => findMenuTypeLabel(row.menuType),
          }
        );
      },
    },
    {
      title: '是否隐藏',
      key: 'hidden',
      width: 80,
      render(row) {
        return h(
          NText,
          {},
          {
            default: () => findBooleanLabel(row.hidden),
          }
        );
      },
    },
    {
      title: '排序',
      key: 'sorting',
      width: 60,
    },
    {
      title: '更新时间',
      key: 'updateAt',
      width: 180,
    },
    {
      title: '操作',
      key: 'actions',
      width: 160,
      render(row) {
        return [
          h(
            NButton,
            {
              text: true,
              onClick: () => onModify(row.id),
            },
            { default: () => '编辑' }
          ),
          h(NDivider, { vertical: true }),
          h(
            NButton,
            {
              text: true,
              onClick: () => onCreate(row.id),
            },
            { default: () => '新增' }
          ),
          h(NDivider, { vertical: true }),
          h(
            NPopconfirm,
            {
              onPositiveClick: () => {
                onRemove(row.id);
              },
            },
            {
              trigger: () => {
                return h(
                  NButton,
                  {
                    text: true,
                  },
                  { default: () => '删除' }
                );
              },
              default: () => {
                return '确认删除此数据吗？';
              },
            }
          ),
        ];
      },
    },
  ];

  const pagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 1,
    onChange: async (page: number) => {
      pagination.page = page;
      await fetchData();
    },
  });

  const onModify = (id: any) => {
    createModalRef.value.openModal(id);
  };

  const onCreate = (parentId: any) => {
    createModalRef.value.openModal(null, parentId);
  };

  const onLoad = (row: any) => {
    return new Promise<void>(async (resolve) => {
      const { data } = await queryPage(
        Object.assign(
          { ...searchForm.value },
          {
            page: 1,
            size: 100,
            parentId: row.id,
          }
        )
      );
      data &&
        data.forEach((item) => {
          item.isLeaf = false;
        });
      row.children = data;
      resolve();
    });
  };

  const onRemove = async (id: any) => {
    await remove(id);
    await onSearch();
  };

  const fetchData = async () => {
    const { data, total, page } = await queryPage(
      Object.assign(searchForm.value, { page: pagination.page, size: pagination.pageSize })
    );
    data &&
      data.forEach((item) => {
        item.isLeaf = false;
      });
    dataList.value = data;
    pagination.page = page;
    pagination.itemCount = total;
  };

  const onSearch = async () => {
    searchForm.value.page = 1;
    await fetchData();
  };

  onMounted(() => {
    onSearch();
  });
</script>
