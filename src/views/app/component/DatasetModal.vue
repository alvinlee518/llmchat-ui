<template>
  <n-drawer v-model:show="showModal" width="50%" @after-leave="onClose">
    <n-drawer-content title="配置知识库">
      <n-space justify="space-between">
        <n-input-group>
          <n-input
            type="text"
            placeholder="按名称搜索"
            style="max-width: 280px"
            clearable
            v-model:value="searchForm.keyword"
            @keyup.enter="onSearch"
          >
            <template #prefix>
              <n-icon :component="SearchSharp" />
            </template>
          </n-input>
          <n-button @click="onSearch"> 搜索 </n-button>
        </n-input-group>
      </n-space>
      <n-checkbox-group
        :default-value="datasets.map((item:any)=>item.id)"
        @update:value="onCheckedChange"
      >
        <n-list hoverable class="mt-3">
          <template #footer>
            <n-flex justify="end">
              <n-pagination
                v-model:item-count="pagination.itemCount"
                v-model:page="pagination.page"
                v-model:page-size="pagination.pageSize"
                @update:page="pagination.onChange"
              />
            </n-flex>
          </template>
          <template #default v-if="dataList && dataList.length >= 1">
            <n-list-item v-for="(item, index) in dataList" :key="index">
              <template #prefix>
                <n-checkbox :value="item.id" />
              </template>
              <n-grid :cols="24" layout-shift-disabled>
                <n-gi :span="15">
                  <n-space vertical>
                    <n-text>{{ item.name }}</n-text>
                    <n-text depth="3">{{ item.description }}</n-text>
                  </n-space>
                </n-gi>
                <n-gi :span="3">
                  <n-space vertical justify="center" align="center">
                    <n-text depth="3">文档数量</n-text>
                    <n-text>{{ item.docCount }}</n-text>
                  </n-space>
                </n-gi>
                <n-gi :span="6">
                  <n-space vertical justify="center" align="center">
                    <n-text depth="3">更新时间</n-text>
                    <n-text>{{ item.updateAt }}</n-text>
                  </n-space>
                </n-gi>
              </n-grid>
            </n-list-item>
          </template>
          <template #default v-else>
            <n-empty description="暂无数据" class="mt-4" />
          </template>
        </n-list>
      </n-checkbox-group>
    </n-drawer-content>
  </n-drawer>
</template>
<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { queryPage } from '@/api/dataset';
  import { SearchSharp } from '@vicons/ionicons5';
  const emit = defineEmits(['update:datasets']);
  const showModal = ref<boolean>(false);

  const props = defineProps({
    appId: {
      type: String,
      default: () => '',
    },
    datasets: {
      type: Array,
      default: () => [],
    },
  });

  const onCheckedChange = (_v, meta) => {
    if (meta.actionType === 'check') {
      const data = dataList.value.find((item) => meta.value === item.id);
      emit('update:datasets', [...props.datasets, data]);
    } else {
      emit('update:datasets', [...props.datasets.filter((item: any) => meta.value !== item.id)]);
    }
  };

  const dataList = ref<any[]>([]);
  const searchForm = ref<{
    keyword: string;
    page: number;
    size: number;
    appId: string;
  }>({
    keyword: '',
    page: 1,
    size: 10,
    appId: props.appId,
  });

  const pagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0,
    onChange: async (page: number) => {
      pagination.page = page;
      await fetchData();
    },
  });

  const fetchData = async () => {
    const { data, total, page } = await queryPage(
      Object.assign(searchForm.value, { page: pagination.page, size: pagination.pageSize })
    );
    dataList.value = data;
    pagination.page = page;
    pagination.itemCount = total;
  };

  const onSearch = async () => {
    searchForm.value.page = 1;
    await fetchData();
  };

  const openModal = async () => {
    await onSearch();
    showModal.value = true;
  };
  const onClose = () => {};
  defineExpose({
    openModal,
  });
</script>
