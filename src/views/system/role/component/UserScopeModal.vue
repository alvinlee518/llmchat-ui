<template>
  <n-modal v-model:show="showModal" class="w-2/3" title="分配用户" preset="card" :bordered="false">
    <n-form
      ref="formRef"
      :model="searchForm"
      label-placement="left"
      :show-feedback="false"
      label-width="auto"
    >
      <n-grid x-gap="12">
        <n-gi :span="7">
          <n-form-item label="姓名" path="name">
            <n-input v-model:value="searchForm.name" placeholder="请输入姓名" />
          </n-form-item>
        </n-gi>
        <n-gi :span="7">
          <n-form-item label="手机号" path="phone">
            <n-input v-model:value="searchForm.phone" placeholder="请输入手机号" />
          </n-form-item>
        </n-gi>
        <n-gi :span="7">
          <n-form-item label="授权状态" path="userScope">
            <n-select v-model:value="searchForm.userScope" clearable :options="UserScopeOptions" />
          </n-form-item>
        </n-gi>
        <n-gi :span="3">
          <n-space justify="end">
            <n-button @click="onSearch"> 查询 </n-button>
          </n-space>
        </n-gi>
      </n-grid>
    </n-form>
    <n-data-table
      :bordered="false"
      :columns="columns"
      :data="dataList"
      :row-key="(row) => row.id"
      class="mt-4"
      :pagination="pagination"
      @update:checked-row-keys="(ids) => (checkedList = ids)"
    />
    <template #footer>
      <n-flex justify="end">
        <n-button @click="onCancel"> 取消授权 </n-button>
        <n-button type="info" @click="formSubmit"> 批量授权 </n-button>
      </n-flex>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
  import { h, onMounted, reactive, ref } from 'vue';
  import { NButton, NText, useMessage } from 'naive-ui';
  import { UserScopeOptions, findUserScopeLabel } from '@/utils/optionsUtil';
  const message = useMessage();
  const showModal = ref<boolean>(false);
  const formRef: any = ref(null);
  const form_data = ref<{
    id?: number;
    menuIds: number[];
  }>({
    menuIds: [],
  });

  const checkedList = ref<any[]>([]);
  const dataList = ref<any[]>([]);
  const searchForm = ref<{
    name: string;
    phone: string;
    userScope: number;
    page: number;
    pageSize: number;
    status: number;
  }>({
    page: 1,
    pageSize: 10,
    name: '',
    phone: '',
    userScope: 0,
    status: 1,
  });

  const columns = [
    {
      type: 'selection',
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
      title: '授权状态',
      key: 'userScope',
      width: 100,
      render(row) {
        return h(
          NText,
          {},
          {
            default: () => findUserScopeLabel(row.userScope),
          }
        );
      },
    },
    {
      title: '更新时间',
      key: 'updateAt',
      width: 180,
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

  const formSubmit = () => {
    showModal.value = false;
  };

  const onCancel = () => {
    showModal.value = false;
  };

  const openModal = (id: any) => {
    // TODO: 获取详情
    form_data.value.id = id;
    console.log('app id', id);
    showModal.value = true;
  };

  defineExpose({
    openModal,
  });

  onMounted(() => {
    onSearch();
  });
</script>
