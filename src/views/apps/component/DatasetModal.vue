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
      <n-checkbox-group v-model:value="checkedList">
        <n-list hoverable class="mt-3">
          <template #footer>
            <n-flex justify="end">
              <n-pagination
                v-model:page-count="pageCount"
                v-model:page="searchForm.page"
                v-model:page-size="searchForm.pageSize"
                :update:page="onPageChange"
              />
            </n-flex>
          </template>
          <template #default v-if="dataList && dataList.length >= 1">
            <n-list-item v-for="(item, index) in dataList" :key="index">
              <template #prefix>
                <n-checkbox :value="item.id" />
              </template>
              <n-grid :cols="24" layout-shift-disabled>
                <n-gi :span="21">
                  <n-space vertical>
                    <n-text>{{ item.name }}</n-text>
                    <n-text depth="3">{{ item.description }}</n-text>
                  </n-space>
                </n-gi>
                <n-gi :span="3">
                  <n-space vertical justify="center" align="center">
                    <n-text depth="3">知识数</n-text>
                    <n-text>{{ item.total }}</n-text>
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
  import { computed, ref } from 'vue';

  const emit = defineEmits(['update:datasets']);
  const showModal = ref<boolean>(false);
  import { SearchSharp } from '@vicons/ionicons5';

  const props = defineProps({
    datasets: {
      type: Array,
      default: () => [],
    },
  });

  const checkedList = computed({
    get: () => {
      return props.datasets.flatMap((item: any) => item.id);
    },
    set: (value) => {
      const data = dataList.value.filter((item) => value.includes(item.id));
      console.log(data);
      emit('update:datasets', data);
    },
  });

  const dataList = ref<any[]>([]);
  const pageCount = ref<number>(10);
  const searchForm = ref<{
    keyword: string;
    page: number;
    pageSize: number;
  }>({
    keyword: '',
    page: 1,
    pageSize: 10,
  });

  const onPageChange = (page: number) => {
    searchForm.value.page = page;
    onSearch();
  };

  const fetchData = () => {
    dataList.value = [
      {
        id: 1728366909517,
        name: '知识库名称1',
        description: '这是知识库的描述',
        total: 1,
        updateAt: '2024-10-08 10:57:23',
      },
      {
        id: 1728366909516,
        name: '知识库名称2',
        description: '这是知识库的描述',
        total: 2,
        updateAt: '2024-10-08 10:57:23',
      },
      {
        id: 1728366909515,
        name: '知识库名称3',
        description: '这是知识库的描述',
        total: 1100,
        updateAt: '2024-10-08 10:57:23',
      },
      {
        id: 1728366909514,
        name: '知识库名称4',
        description: '这是知识库的描述',
        total: 1100,
        updateAt: '2024-10-08 10:57:23',
      },
      {
        id: 1728366909513,
        name: '知识库名称5',
        description: '这是知识库的描述',
        total: 1100,
        updateAt: '2024-10-08 10:57:23',
      },
    ];
    pageCount.value = 3;
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
