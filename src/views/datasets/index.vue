<template>
  <div>
    <n-card :bordered="false">
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
        <n-button type="info" @click="onCreate"> 创建知识库 </n-button>
      </n-space>
    </n-card>
    <n-card :bordered="false" class="mt-2">
      <n-list hoverable>
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
        <template #default v-if="datasetList && datasetList.length >= 1">
          <n-list-item v-for="(item, index) in datasetList" :key="index">
            <template #prefix>
              <n-icon :size="24" :component="DocumentsOutline" />
            </template>
            <n-grid :cols="24" layout-shift-disabled>
              <n-gi :span="13">
                <n-space vertical>
                  <n-text>{{ item.name }}</n-text>
                  <n-text depth="3">{{ item.description }}</n-text>
                </n-space>
              </n-gi>
              <n-gi :span="2">
                <n-space vertical justify="center" align="center">
                  <n-text depth="3">知识数</n-text>
                  <n-text>{{ item.total }}</n-text>
                </n-space>
              </n-gi>
              <n-gi :span="4">
                <n-space vertical>
                  <n-text depth="3">更新时间</n-text>
                  <n-text>{{ item.updateAt }}</n-text>
                </n-space>
              </n-gi>
              <n-gi :span="5">
                <n-space vertical justify="center" align="center" :size="[0, 12]">
                  <div></div>
                  <div>
                    <n-button text @click="onDetail(item.id)">查看</n-button>
                    <n-divider vertical />
                    <n-button text @click="onTesting(item.id)">命中测试</n-button>
                    <n-divider vertical />
                    <n-button text @click="onModify(item.id)">编辑</n-button>
                    <n-divider vertical />
                    <n-popconfirm @positive-click="onRemove(item.id)">
                      <template #trigger>
                        <n-button text>删除</n-button>
                      </template>
                      确认删除此知识库？
                    </n-popconfirm>
                  </div>
                </n-space>
              </n-gi>
            </n-grid>
          </n-list-item>
        </template>
        <template #default v-else>
          <n-empty description="暂无数据" class="mt-4" />
        </template>
      </n-list>
    </n-card>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { SearchSharp, DocumentsOutline } from '@vicons/ionicons5';

  const datasetList = ref<any[]>([]);
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

  const router = useRouter();

  function onDetail(id: any) {
    router.push({ name: 'datasets_detail', params: { id: id } });
  }
  const onModify = (id: any) => {
    router.push({ name: 'datasets_modify', params: { id: id } });
  };
  const onTesting = (id: any) => {
    router.push({ name: 'datasets_testing', params: { id: id } });
  };

  const onCreate = () => {
    router.push({ name: 'datasets_create' });
  };
  const onRemove = (id: any) => {
    console.log('handleDelete');
  };

  const onPageChange = (page: number) => {
    searchForm.value.page = page;
    onSearch();
  };
  const fetchData = () => {
    datasetList.value = [
      {
        id: 1728366909514,
        name: '知识库名称',
        description: '这是知识库的描述',
        total: 1,
        updateAt: '2024-10-08 10:57:23',
      },
      {
        id: 1728366909514,
        name: '知识库名称',
        description: '这是知识库的描述',
        total: 1,
        updateAt: '2024-10-08 10:57:23',
      },
      {
        id: 1728366909514,
        name: '知识库名称',
        description: '这是知识库的描述',
        total: 1,
        updateAt: '2024-10-08 10:57:23',
      },
      {
        id: 1728366909514,
        name: '知识库名称',
        description: '这是知识库的描述',
        total: 1,
        updateAt: '2024-10-08 10:57:23',
      },
    ];
    pageCount.value = 3;
  };
  const onSearch = async () => {
    searchForm.value.page = 1;
    await fetchData();
  };

  onMounted(() => {
    onSearch();
  });
</script>
