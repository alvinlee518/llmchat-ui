<template>
  <div>
    <n-grid :x-gap="5">
      <n-grid-item span="6">
        <n-card :bordered="false" size="small" class="proCard" title="模型供应商">
          <n-list hoverable clickable :show-divider="false">
            <n-list-item
              :class="{ 'list-item-cell-on': !searchForm.modelProvider }"
              @click="onProviderChange(undefined)"
            >
              <template #prefix>
                <n-avatar color="#2080f0">
                  <n-icon>
                    <GridSharp />
                  </n-icon>
                </n-avatar>
              </template>
              全部模型
            </n-list-item>
            <n-list-item
              v-for="(item, index) in providerList"
              :key="index"
              :class="{ 'list-item-cell-on': searchForm.modelProvider === item.value }"
              @click="onProviderChange(item.value)"
            >
              <template #prefix>
                <n-avatar color="#fff" :src="`${apiUrl}${urlPrefix}/icons/${item.icon}`" />
              </template>
              {{ item.label }}
            </n-list-item>
          </n-list>
        </n-card>
      </n-grid-item>
      <n-grid-item span="18">
        <n-card :bordered="false" size="small" class="proCard" :title="providerName">
          <n-flex justify="space-between">
            <n-button type="info" @click="onCreate"> 添加模型 </n-button>
            <n-input-group style="max-width: 280px">
              <n-input
                type="text"
                placeholder="按名称搜索"
                clearable
                v-model:value="searchForm.modelName"
                @keyup.enter="onSearch"
              >
                <template #prefix>
                  <n-icon :component="SearchSharp" />
                </template>
              </n-input>
              <n-button @click="onSearch"> 搜索 </n-button>
            </n-input-group>
          </n-flex>
          <n-grid
            v-if="modelList && modelList.length >= 1"
            x-gap="12"
            y-gap="12"
            :cols="2"
            class="mt-5"
          >
            <n-gi v-for="(item, idx) in modelList" :key="idx">
              <n-card bordered>
                <template #header>
                  <n-space>
                    <n-avatar
                      color="#fff"
                      :src="`${apiUrl}${urlPrefix}/icons/${item.modelProviderIcon}`"
                    />
                    {{ item.modelProviderName }}
                  </n-space>
                </template>
                <template #header-extra>
                  <n-button text @click="onModify(item)">
                    <n-icon class="ml-3" :size="14">
                      <EditOutlined />
                    </n-icon>
                  </n-button>
                  <n-popconfirm @positive-click="onRemove(item)">
                    <template #trigger>
                      <n-button text>
                        <n-icon class="ml-3" :size="14">
                          <DeleteOutlined />
                        </n-icon>
                      </n-button>
                    </template>
                    确认删除此模型？
                  </n-popconfirm>
                </template>
                <ul>
                  <li>
                    <n-text depth="3">模型类型</n-text>
                    <span class="ellipsis ml-16 font-medium">{{ item.modelTypeName }}</span>
                  </li>
                  <li class="mt-3">
                    <n-text depth="3">模型名称</n-text>
                    <span class="ellipsis ml-16">{{ item.modelName }}</span>
                  </li>
                </ul>
              </n-card>
            </n-gi>
          </n-grid>
          <n-empty v-else description="暂无数据" class="mt-5" />
          <n-flex justify="end">
            <n-pagination
              v-model:item-count="pagination.itemCount"
              v-model:page="pagination.page"
              v-model:page-size="pagination.pageSize"
              @update:page="pagination.onChange"
            />
          </n-flex>
        </n-card>
      </n-grid-item>
    </n-grid>
    <CreateModal ref="createModalRef" @on-close="onSearch" :provider-list="providerList" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed, onMounted, reactive } from 'vue';
  import { SearchSharp, GridSharp } from '@vicons/ionicons5';
  import { EditOutlined, DeleteOutlined } from '@vicons/antd';
  import { queryPage, remove, modelProviders } from '@/api/model';
  import CreateModal from './component/CreateModal.vue';
  import { useGlobSetting } from '@/hooks/setting';
  const createModalRef: any = ref(null);
  const modelList = ref<any[]>([]);
  const providerList = ref<any[]>([]);
  const searchForm = ref<{
    modelName: string;
    modelProvider?: number;
    page: number;
    size: number;
  }>({
    page: 1,
    size: 10,
    modelName: '',
  });
  const { apiUrl, urlPrefix } = useGlobSetting();
  const providerName = computed(() => {
    return (
      providerList.value.find((item) => item.value === searchForm.value.modelProvider)?.label ||
      '全部模型'
    );
  });

  const onProviderChange = async (value) => {
    searchForm.value.modelProvider = value;
    await onSearch();
  };

  const onCreate = () => {
    createModalRef.value.openModal(null, searchForm.value.modelProvider);
  };
  const onModify = (item) => {
    createModalRef.value.openModal(item.id, searchForm.value.modelProvider);
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
    modelList.value = data;
    pagination.page = page;
    pagination.itemCount = total;
  };

  const onSearch = async () => {
    searchForm.value.page = 1;
    await fetchData();
  };

  onMounted(async () => {
    const { data } = await modelProviders();
    providerList.value = data || [];
    await onSearch();
  });
</script>

<style lang="less" scoped>
  .list-item-cell-on {
    background: #f0faff;
    color: #2d8cf0;

    ::v-deep(.n-thing-main .n-thing-header .n-thing-header__title) {
      color: #2d8cf0;
    }

    &:hover {
      background: #f0faff;
    }
  }
</style>
