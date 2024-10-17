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
        <n-button type="info" @click="onCreate"> 创建应用 </n-button>
      </n-space>
    </n-card>
    <n-card :bordered="false" class="mt-2">
      <n-flex vertical :size="[5, 5]">
        <n-grid v-if="appList && appList.length >= 1" x-gap="12" :cols="4">
          <n-gi v-for="(item, index) in appList" :key="index">
            <n-card size="small" class="w-full h-44" hoverable>
              <template #header>
                <n-flex align="center">
                  <n-avatar>{{ item.name }}</n-avatar>
                  <n-text>{{ item.name }}</n-text>
                </n-flex>
              </template>
              <template #action>
                <n-flex justify="end" align="center">
                  <n-button
                    text
                    size="tiny"
                    @click="
                      () => {
                        $router.push({ name: 'apps_modify', params: { id: item.id } });
                      }
                    "
                  >
                    <template #icon>
                      <n-icon>
                        <SettingsOutline />
                      </n-icon>
                    </template>
                    管理
                  </n-button>
                  <n-divider vertical />
                  <n-button
                    text
                    size="tiny"
                    @click="
                      () => {
                        $router.push({ name: 'apps_preview', params: { id: item.id } });
                      }
                    "
                  >
                    <template #icon>
                      <n-icon>
                        <VideocamOutline />
                      </n-icon>
                    </template>
                    演示
                  </n-button>
                  <n-divider vertical />
                  <n-popconfirm @positive-click="onRemove(item.id)">
                    <template #trigger>
                      <n-button text size="tiny">
                        <template #icon>
                          <n-icon>
                            <DeleteOutlined />
                          </n-icon>
                        </template>
                        删除
                      </n-button>
                    </template>
                    确认删除此应用？
                  </n-popconfirm>
                </n-flex>
              </template>
              <n-ellipsis :line-clamp="2" :tooltip="false">{{ item.description }}</n-ellipsis>
            </n-card>
          </n-gi>
        </n-grid>
        <n-empty v-else description="暂无数据" />
        <n-flex justify="end">
          <n-pagination
            v-model:page-count="pageCount"
            v-model:page="searchForm.page"
            v-model:page-size="searchForm.pageSize"
            :update:page="onPageChange"
          />
        </n-flex>
      </n-flex>
    </n-card>
    <CreateModal ref="createModalRef" />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { SearchSharp, SettingsOutline, VideocamOutline } from '@vicons/ionicons5';

  import { DeleteOutlined } from '@vicons/antd';

  import CreateModal from './component/CreateModal.vue';

  const createModalRef: any = ref(null);

  const appList = ref<any[]>([]);
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

  const onCreate = () => {
    createModalRef.value.openModal();
  };

  const onRemove = (id: any) => {
    console.log('handleDelete');
  };

  const onPageChange = (page: number) => {
    searchForm.value.page = page;
    onSearch();
  };
  const fetchData = () => {
    appList.value = [
      {
        id: 1728366909514,
        name: '应用名称',
        description:
          '这是应用的描述这是应用的描述这是应用的描述这是应用的描述这是应用的描述这是应用的描述这是应用的描述这是应用的描述这是应用的描述',
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
