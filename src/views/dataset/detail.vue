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
            <n-input v-model:value="searchForm.name" type="text" placeholder="搜索文件名称" />
          </n-gi>
          <n-gi :span="5">
            <n-select
              v-model:value="searchForm.state"
              :options="ParagraphStateOptions"
              placeholder="选择解析状态"
              clearable
            />
          </n-gi>
          <n-gi :span="2">
            <n-button @click="onSearch">查询</n-button>
          </n-gi>
          <n-gi :span="12">
            <n-flex justify="end">
              <n-button type="info" @click="onImport"> 导入数据 </n-button>
            </n-flex>
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
    <SplitModal ref="splitModalRef" @close="onSearch" />
  </div>
</template>

<script setup lang="ts">
  import { NButton, NDivider, NDropdown, NPopover, NText, useDialog, useMessage } from 'naive-ui';
  import { reactive, ref, h, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { ParagraphStateOptions, findParagraphStateLabel } from '@/utils/optionsUtil';
  import { queryPage, remove, reindex, exportAll } from '@/api/document';

  import SplitModal from './component/SplitModal.vue';

  const splitModalRef = ref<any>(null);

  const router = useRouter();
  const datasetId = router.currentRoute.value.params.id;

  const dialog = useDialog();
  const message = useMessage();

  const searchForm = ref<{
    name: string;
    state?: number;
    datasetId: any;
  }>({
    name: '',
    datasetId: datasetId,
  });
  const datalist = ref<any[]>([]);

  const columns = [
    {
      title: '文件名称',
      key: 'name',
    },
    {
      title: '分段数',
      key: 'paraCount',
      width: 120,
    },
    {
      title: '分段状态',
      key: 'state',
      width: 120,
      render(row) {
        return h(
          NPopover,
          {
            disabled: row.state !== 3,
          },
          {
            trigger: () => {
              return h(
                NText,
                {
                  type: row.state !== 3 ? 'info' : 'error',
                },
                {
                  default: () => findParagraphStateLabel(row.state),
                }
              );
            },
            default: () => row.failure,
          }
        );
      },
    },
    {
      title: '索引进度',
      key: 'paraCount',
      width: 120,
      render(row) {
        return h(
          NText,
          { type: 'primary' },
          {
            default: () => `${row.indexCount} / ${row.paraCount}`,
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
              onClick: () => onDetail(row),
            },
            { default: () => '查看' }
          ),
          h(NDivider, { vertical: true }),
          h(
            NButton,
            {
              text: true,
              onClick: async () => {
                await exportAll(row.id);
              },
            },
            { default: () => '导出' }
          ),
          h(NDivider, { vertical: true }),
          h(
            NDropdown,
            {
              trigger: 'hover',
              options: [
                {
                  label: '分段设置',
                  key: 'split',
                },
                {
                  label: '重新索引',
                  key: 'reindex',
                },
                {
                  label: '删除',
                  key: 'remove',
                },
              ],
              onSelect: (key: string) => {
                switch (key) {
                  case 'split':
                    splitModalRef.value.openModal(row.id);
                    break;
                  case 'reindex':
                    dialog.warning({
                      title: '向量化',
                      content: '确认重新向量化此文档吗',
                      positiveText: '确认',
                      onPositiveClick: async () => {
                        await reindex(row.id);
                        message.success('操作成功');
                        await onSearch();
                      },
                    });
                    break;
                  case 'remove':
                    dialog.warning({
                      title: '删除',
                      content: '确认删除此文档吗',
                      positiveText: '确认',
                      onPositiveClick: async () => {
                        await remove(row.id);
                        message.success('操作成功');
                        await onSearch();
                      },
                    });
                    break;
                }
              },
            },
            { default: () => '管理' }
          ),
        ];
      },
    },
  ];

  const pagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0,
    onChange: async (page: number) => {
      pagination.page = page;
      await fetchData();
    },
  });

  const onRemove = async (item) => {
    await remove(item.id);
    await onSearch();
  };

  const fetchData = async () => {
    const { data, total, page } = await queryPage(
      Object.assign({ ...searchForm.value }, { page: pagination.page, size: pagination.pageSize })
    );
    datalist.value = data;
    pagination.page = page;
    pagination.itemCount = total;
  };

  const onSearch = async () => {
    pagination.page = 1;
    await fetchData();
  };
  const onImport = () => {
    router.push({
      name: 'dataset_import',
      params: {
        id: datasetId,
      },
    });
  };
  const onDetail = (item) => {
    router.push({
      name: 'dataset_paragraph',
      params: {
        id: item.id,
      },
    });
  };

  onMounted(async () => {
    await onSearch();
  });
</script>
