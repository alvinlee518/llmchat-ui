<template>
  <div>
    <n-card :bordered="false">
      <n-page-header
        title="标签数据"
        @back="
          () => {
            $router.go(-1);
          }
        "
      >
        <n-form
          ref="formRef"
          :model="searchForm"
          label-placement="left"
          label-width="80px"
          :show-feedback="false"
        >
          <n-grid :cols="4">
            <n-gi>
              <n-form-item label="字典名称" path="name">
                <n-input v-model:value="searchForm.name" placeholder="请选择字典" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="标签名称" path="name">
                <n-input v-model:value="searchForm.name" placeholder="请输入标签名称" />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item label="状态" path="status">
                <n-select v-model:value="searchForm.status" clearable :options="RowStateOptions" />
              </n-form-item>
            </n-gi>
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
      </n-page-header>
    </n-card>
    <n-card :bordered="false" class="mt-2">
      <n-data-table
        :bordered="false"
        :columns="columns"
        :data="dataList"
        :row-key="(row) => row.id"
        :pagination="pagination"
        @update:checked-row-keys="(ids) => (checkedList = ids)"
      />
    </n-card>
  </div>
  <LabelModal ref="labelModalRef" />
</template>

<script setup lang="ts">
  import { h, onMounted, reactive, ref } from 'vue';
  import { NText, NButton, NDivider, NPopconfirm } from 'naive-ui';
  import { useRouter } from 'vue-router';
  import { RowStateOptions, findRowStateLabel } from '@/utils/optionsUtil';
  import LabelModal from './component/LabelModal.vue';
  const labelModalRef: any = ref(null);
  const checkedList = ref<any[]>([]);
  const dataList = ref<any[]>([]);
  const searchForm = ref<{
    name: string;
    status: number;
    page: number;
    pageSize: number;
  }>({
    page: 1,
    pageSize: 10,
    name: '',
    status: 1,
  });

  const router = useRouter();

  const columns = [
    {
      type: 'selection',
    },
    {
      title: '标签名称',
      key: 'name',
    },
    {
      title: '标签编码',
      key: 'value',
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
      width: 120,
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
    pageCount: 1,
    onChange: async (page: number) => {
      pagination.page = page;
      await fetchData();
    },
  });
  function onPreview(id: any) {
    router.push({ name: 'apps_preview', params: { id: id } });
  }

  const onModify = (id: any) => {
    labelModalRef.value.openModal(id);
  };

  const onCreate = () => {
    labelModalRef.value.openModal();
  };

  const onRemove = (id: any) => {
    console.log('handleDelete');
  };

  const onBatchRemove = () => {};

  const fetchData = () => {
    dataList.value = [
      {
        id: 1728366909514,
        name: '应用名称',
        description:
          '这是应用的描述这是应用的描述这是应用的描述这是应用的描述这是应用的描述这是应用的描述这是应用的描述这是应用的描述这是应用的描述',
        total: 1,
        updateAt: '2024-10-08 10:57:23',
      },
    ];
  };
  const onSearch = async () => {
    searchForm.value.page = 1;
    await fetchData();
  };

  onMounted(() => {
    onSearch();
  });
</script>
