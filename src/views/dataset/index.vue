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
            v-model:value="searchForm.name"
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
              v-model:item-count="pagination.itemCount"
              v-model:page="pagination.page"
              v-model:page-size="pagination.pageSize"
              @update:page="pagination.onChange"
            />
          </n-flex>
        </template>
        <template #default v-if="datalist && datalist.length >= 1">
          <n-list-item v-for="(item, index) in datalist" :key="index">
            <template #prefix>
              <n-icon :size="24" :component="DocumentsOutline" />
            </template>
            <n-grid :cols="24" layout-shift-disabled>
              <n-gi :span="12">
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
          <n-empty description="暂无数据" class="mt-5" />
        </template>
      </n-list>
    </n-card>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { SearchSharp, DocumentsOutline } from '@vicons/ionicons5';
  import { queryPage, remove } from '@/api/dataset';
  const datalist = ref<any[]>([]);
  const searchForm = ref<{
    name: string;
    page: number;
    size: number;
  }>({
    name: '',
    page: 1,
    size: 10,
  });

  const router = useRouter();

  function onDetail(id: any) {
    router.push({ name: 'dataset_detail', params: { id: id } });
  }
  const onModify = (id: any) => {
    router.push({ name: 'dataset_modify', params: { id: id } });
  };
  const onTesting = (id: any) => {
    router.push({ name: 'dataset_testing', params: { id: id } });
  };

  const onCreate = () => {
    router.push({ name: 'dataset_create' });
  };

  const onRemove = async (item) => {
    await remove(item.id);
    await onSearch();
  };

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
    datalist.value = data;
    pagination.page = page;
    pagination.itemCount = total;
  };
  const onSearch = async () => {
    searchForm.value.page = 1;
    await fetchData();
  };

  onMounted(() => {
    onSearch();
  });
</script>
