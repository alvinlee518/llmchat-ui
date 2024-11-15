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
            <n-select v-model:value="searchForm.userScope" :options="UserScopeOptions" />
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
      remote
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
        <n-button
          type="warning"
          @click="onCancel"
          :disabled="!(checkedList && checkedList.length >= 1)"
        >
          批量取消授权
        </n-button>
        <n-button
          type="info"
          @click="formSubmit"
          :disabled="!(checkedList && checkedList.length >= 1)"
        >
          批量授权
        </n-button>
      </n-flex>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
  import { h, reactive, ref } from 'vue';
  import { NButton, NText } from 'naive-ui';
  import { UserScopeOptions } from '@/utils/optionsUtil';
  import { getUserScope, allocated, unallocated } from '@/api/system/role';
  const showModal = ref<boolean>(false);
  const formRef: any = ref(null);

  const checkedList = ref<any[]>([]);
  const dataList = ref<any[]>([]);
  const searchForm = ref<{
    name: string;
    phone: string;
    userScope: number;
    roleId: number;
    page: number;
    size: number;
  }>({
    page: 1,
    size: 10,
    name: '',
    phone: '',
    userScope: 1,
    roleId: 0,
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
      title: '用户名',
      key: 'username',
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
      title: '更新时间',
      key: 'updateAt',
      width: 180,
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

  const fetchData = async () => {
    const { data, total, page } = await getUserScope(searchForm.value);
    dataList.value = [...data];
    pagination.page = page;
    pagination.itemCount = total;
  };

  const onSearch = async () => {
    searchForm.value.page = 1;
    await fetchData();
  };

  const formSubmit = async () => {
    await allocated({
      roleId: searchForm.value.roleId,
      userIds: checkedList.value,
    });
    showModal.value = false;
  };

  const onCancel = async () => {
    await unallocated({
      roleId: searchForm.value.roleId,
      userIds: checkedList.value,
    });
    showModal.value = false;
  };

  const openModal = (id: any) => {
    showModal.value = true;
    searchForm.value = Object.assign({ ...searchForm.value }, { roleId: id });
    onSearch();
  };

  defineExpose({
    openModal,
  });
</script>
