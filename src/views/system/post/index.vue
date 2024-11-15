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
            <n-form-item label="岗位名称" path="name">
              <n-input v-model:value="searchForm.name" placeholder="请输入岗位名称" />
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
              <n-button type="info" @click="onCreate"> 新增 </n-button>
              <n-button
                type="warning"
                @click="onBatchRemove"
                :disabled="!(checkedList && checkedList.length >= 1)"
              >
                批量删除
              </n-button>
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
        :row-key="(row) => row.id"
        :pagination="pagination"
        @update:checked-row-keys="(ids) => (checkedList = ids)"
      />
    </n-card>
    <CreateModal ref="createModalRef" @on-close="onSearch" />
  </div>
</template>

<script setup lang="ts">
  import { h, onMounted, reactive, ref } from 'vue';
  import { NText, NButton, NDivider, NPopconfirm } from 'naive-ui';
  import { RowStateOptions, findRowStateLabel } from '@/utils/optionsUtil';
  import { queryPage, remove } from '@/api/system/post';
  import CreateModal from './component/CreateModal.vue';
  const createModalRef: any = ref(null);
  const checkedList = ref<any[]>([]);
  const dataList = ref<any[]>([]);
  const searchForm = ref<{
    name: string;
    status: number;
    page: number;
    size: number;
  }>({
    page: 1,
    size: 10,
    name: '',
    status: 1,
  });

  const columns = [
    {
      type: 'selection',
    },
    {
      title: '岗位名称',
      key: 'name',
    },
    {
      title: '岗位编码',
      key: 'code',
    },
    {
      title: '排序',
      key: 'sorting',
      width: 100,
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render(row) {
        return h(
          NText,
          {},
          {
            default: () => findRowStateLabel(row.status),
          }
        );
      },
    },
    {
      title: '更新时间',
      key: 'updateAt',
      width: 180,
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
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

  const onCreate = () => {
    createModalRef.value.openModal();
  };

  const onRemove = async (id: any) => {
    await remove(id);
    await onSearch();
  };

  const onBatchRemove = async () => {
    await remove(checkedList.value);
    await onSearch();
    checkedList.value = [];
  };

  const fetchData = async () => {
    const { data, total, page } = await queryPage(
      Object.assign(searchForm.value, { page: pagination.page, size: pagination.pageSize })
    );
    dataList.value = [...data];
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
