<template>
  <div>
    <n-grid :cols="5" x-gap="12">
      <n-gi span="1">
        <n-card :bordered="false">
          <template #header> 组织架构 </template>
          <template #header-extra>
            <n-button text @click="fetchTreeData">
              <n-icon>
                <RefreshOutline />
              </n-icon>
            </n-button>
          </template>
          <n-tree
            style="height: calc(100vh - 210px)"
            block-line
            cascade
            virtual-scroll
            :selected-keys="[searchForm.deptId]"
            default-expand-all
            :data="treeData"
            @update:selected-keys="
              (checked) => {
                if (checked && checked.length >= 1) {
                  searchForm.deptId = checked[0];
                }
                onSearch();
              }
            "
          />
        </n-card>
      </n-gi>
      <n-gi span="4">
        <n-card :bordered="false">
          <n-form
            ref="formRef"
            :model="searchForm"
            label-placement="left"
            :show-feedback="false"
            label-width="auto"
          >
            <n-grid :cols="3" :x-gap="12" :y-gap="20">
              <n-gi>
                <n-form-item label="姓名" path="name">
                  <n-input v-model:value="searchForm.name" placeholder="请输入姓名" />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="邮箱" path="email">
                  <n-input v-model:value="searchForm.email" placeholder="请输入邮箱" />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="手机号" path="phone">
                  <n-input v-model:value="searchForm.phone" placeholder="请输入手机号" />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="状态" path="status">
                  <n-select
                    v-model:value="searchForm.status"
                    clearable
                    :options="RowStateOptions"
                  />
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
            :bordered="false"
            :columns="columns"
            :data="dataList"
            :row-key="(row) => row.id"
            :pagination="pagination"
            @update:checked-row-keys="(ids) => (checkedList = ids)"
          />
        </n-card>
      </n-gi>
    </n-grid>
    <CreateModal ref="createModalRef" />
  </div>
</template>

<script setup lang="ts">
  import { h, onMounted, reactive, ref } from 'vue';
  import { NText, NButton, NDivider, NPopconfirm } from 'naive-ui';
  import { RefreshOutline } from '@vicons/ionicons5';
  import { RowStateOptions, findRowStateLabel } from '@/utils/optionsUtil';
  import CreateModal from './component/CreateModal.vue';
  const createModalRef: any = ref(null);
  const checkedList = ref<any[]>([]);
  const dataList = ref<any[]>([]);
  const searchForm = ref<{
    name: string;
    username: string;
    email: string;
    phone: string;
    deptId: number;
    status: number;
    page: number;
    pageSize: number;
  }>({
    page: 1,
    pageSize: 10,
    name: '',
    status: 1,
    email: '',
    phone: '',
    username: '',
    deptId: 0,
  });

  const treeData = ref<any[]>([]);

  const fetchTreeData = () => {
    treeData.value = [
      {
        label: '总公司',
        key: 1729048848368,
        children: [
          {
            label: '北京分公司',
            key: 1729048848367,
            children: [
              {
                label: '研发部门',
                key: 1729048848364,
              },
              {
                label: '产品部门',
                key: 1729048848363,
              },
            ],
          },
          {
            label: '上海分公司',
            key: 1729048848366,
            children: [
              {
                label: '运营部门',
                key: 1729048848362,
              },
              {
                label: '销售部门',
                key: 1729048848365,
              },
            ],
          },
        ],
      },
    ];
  };

  const columns = [
    {
      type: 'selection',
    },
    {
      title: '用户名',
      key: 'username',
    },
    {
      title: '姓名',
      key: 'name',
    },
    {
      title: '邮箱',
      key: 'email',
    },
    {
      title: '手机号',
      key: 'phone',
    },
    {
      title: '部门',
      key: 'deptName',
    },
    {
      title: '状态',
      key: 'status',
      width: 60,
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
      width: 100,
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

  const onModify = (id: any) => {
    createModalRef.value.openModal(id);
  };

  const onCreate = () => {
    createModalRef.value.openModal();
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
    fetchTreeData();
    onSearch();
  });
</script>
