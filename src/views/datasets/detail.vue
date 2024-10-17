<template>
  <div>
    <n-card :bordered="false">
      <n-page-header
        title="查看知识库"
        @back="
          () => {
            $router.go(-1);
          }
        "
      >
        <n-grid :cols="24" x-gap="12" layout-shift-disabled>
          <n-gi :span="5">
            <n-input v-model:value="searchForm.keyword" type="text" placeholder="搜索文件名称" />
          </n-gi>
          <n-gi :span="5">
            <n-select
              v-model:value="searchForm.state"
              :options="ParagraphStateOptions"
              placeholder="选择状态"
              clearable
            />
          </n-gi>
          <n-gi :span="2">
            <n-button @click="onSearch">查询</n-button>
          </n-gi>
          <n-gi :span="12">
            <n-flex justify="end"
              ><n-button type="info" @click="onImport">导入数据</n-button></n-flex
            >
          </n-gi>
        </n-grid>
      </n-page-header>
    </n-card>
    <n-card :bordered="false" class="mt-2">
      <n-data-table
        :bordered="false"
        :columns="columns"
        :data="datalist"
        class="mt-4"
        :pagination="pagination"
      />
    </n-card>
  </div>
</template>

<script setup lang="ts">
  import { NButton, NDivider, NPopconfirm, NText } from 'naive-ui';
  import { reactive, ref, h, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { ParagraphStateOptions, findParagraphStateLabel } from '@/utils/optionsUtil';
  const router = useRouter();
  const datasetId = router.currentRoute.value.params.id;

  const searchForm = ref<{
    keyword: string;
    state?: number;
    datasetId: any;
  }>({
    keyword: '',
    datasetId: datasetId,
  });
  const datalist = ref<any[]>([]);

  const columns = [
    {
      title: '文件名称',
      key: 'name',
    },
    {
      title: '文件大小',
      key: 'size',
      width: 120,
      render(row) {
        return h(
          NText,
          {},
          {
            default: () => `${row.size}MB`,
          }
        );
      },
    },
    {
      title: '分段数量',
      key: 'total',
      width: 120,
    },
    {
      title: '状态',
      key: 'state',
      width: 120,
      render(row) {
        return h(
          NText,
          {},
          {
            default: () => findParagraphStateLabel(row.state),
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
              onClick: () => onDetail(row),
            },
            { default: () => '查看' }
          ),
          h(NDivider, { vertical: true }),
          h(
            NPopconfirm,
            {
              onPositiveClick: () => {
                onRemove(row);
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

  const fetchData = () => {
    console.log(Object.assign({}, searchForm.value, pagination));
    datalist.value = [
      {
        id: 1728366909514,
        name: 'qwen2.5:3b',
        size: 10.5,
        total: 10,
        state: 1,
        updateAt: '2023-08-01 12:00:00',
      },
    ];
  };
  const onSearch = async () => {
    pagination.page = 1;
    await fetchData();
  };
  const onImport = () => {
    router.push({
      name: 'datasets_import',
      params: {
        id: datasetId,
      },
    });
  };
  const onDetail = (item) => {
    router.push({
      name: 'datasets_paragraph',
      params: {
        id: item.id,
      },
    });
  };

  const onRemove = (item: any) => {
    console.log('handleDelete');
  };
  onMounted(async () => {
    await onSearch();
  });
</script>
