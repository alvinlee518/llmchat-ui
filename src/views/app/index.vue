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
        <n-button type="info" @click="onCreate"> 创建应用 </n-button>
      </n-space>
    </n-card>
    <n-card :bordered="false" class="mt-2">
      <n-flex vertical :size="[5, 5]">
        <n-grid v-if="appList && appList.length >= 1" x-gap="12" :cols="4">
          <n-gi v-for="(item, index) in appList" :key="index">
            <n-card size="small" class="w-full h-40" hoverable header-class="py-3">
              <template #header>
                <n-flex align="center">
                  <n-avatar>{{ item.name }}</n-avatar>
                  <n-text>{{ item.name }}</n-text>
                </n-flex>
              </template>
              <template #footer>
                <n-flex justify="end" align="center">
                  <n-button
                    text
                    size="tiny"
                    @click="
                      () => {
                        $router.push({ name: 'app_modify', params: { id: item.id } });
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
                    :disabled="!item.modelId || item.modelId === '0'"
                    size="tiny"
                    @click="
                      () => {
                        $router.push({ name: 'app_preview', params: { id: item.id } });
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
              <n-ellipsis :line-clamp="2" :tooltip="false">
                {{ item.description || item.prompt }}
              </n-ellipsis>
            </n-card>
          </n-gi>
        </n-grid>
        <n-empty v-else description="暂无数据" />
        <n-flex justify="end">
          <n-pagination
            v-model:item-count="pagination.itemCount"
            v-model:page="pagination.page"
            v-model:page-size="pagination.pageSize"
            @update:page="pagination.onChange"
          />
        </n-flex>
      </n-flex>
    </n-card>
    <CreateModal ref="createModalRef" @on-close="onSearch" />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue';
  import { SearchSharp, SettingsOutline, VideocamOutline } from '@vicons/ionicons5';

  import { DeleteOutlined } from '@vicons/antd';

  import CreateModal from './component/CreateModal.vue';
  import { queryPage, remove } from '@/api/app';

  const createModalRef: any = ref(null);

  const appList = ref<any[]>([]);
  const searchForm = ref<{
    name: string;
    page: number;
    size: number;
  }>({
    name: '',
    page: 1,
    size: 10,
  });

  const onCreate = () => {
    createModalRef.value.openModal();
  };

  const onRemove = async (id) => {
    await remove(id);
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
    appList.value = data;
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
