<template>
  <div>
    <n-grid :cols="5" x-gap="12">
      <n-gi span="1">
        <n-card :bordered="false">
          <template #header> 组织架构 </template>
          <template #header-extra>
            <n-button text @click="fetchdeptList">
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
            label-field="label"
            key-field="value"
            children-field="children"
            :selected-keys="[searchForm.deptId]"
            default-expand-all
            :data="deptList"
            @update:selected-keys="
              (checked) => {
                console.log(checked);
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
            remote
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
    <CreateModal ref="createModalRef" @on-close="onSearch" />
  </div>
</template>

<script setup lang="ts">
  import { h, onMounted, reactive, ref } from 'vue';
  import { NText, NButton, NDivider, NPopconfirm } from 'naive-ui';
  import { RefreshOutline } from '@vicons/ionicons5';
  import { RowStateOptions, findRowStateLabel } from '@/utils/optionsUtil';
  import { queryPage, remove } from '@/api/system/user';
  import CreateModal from './component/CreateModal.vue';
  import { getDeptTree } from '@/api/system/dept';
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
    size: number;
  }>({
    page: 1,
    size: 10,
    name: '',
    status: 1,
    email: '',
    phone: '',
    username: '',
    deptId: 0,
  });

  const deptList = ref<any[]>([]);

  const fetchdeptList = async () => {
    const { data } = await getDeptTree(0);
    deptList.value = data;
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
    itemCount: 0,
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
    fetchdeptList();
    onSearch();
  });
</script>
