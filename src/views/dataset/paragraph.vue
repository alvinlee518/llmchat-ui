<template>
  <div>
    <n-card :bordered="false">
      <n-page-header
        title="查看文档"
        @back="
          () => {
            $router.go(-1);
          }
        "
      >
        <n-grid :cols="24" x-gap="12" layout-shift-disabled>
          <n-gi :span="5">
            <n-input v-model:value="searchForm.keyword" type="text" placeholder="输入关键词搜索" />
          </n-gi>
          <n-gi :span="5">
            <n-select
              v-model:value="searchForm.state"
              :options="ParagraphStateOptions"
              placeholder="选择解析状态"
              clearable
            />
          </n-gi>
          <n-gi :span="2">
            <n-button @click="onSearch">查询</n-button>
          </n-gi>
        </n-grid>
      </n-page-header>
    </n-card>
    <n-card :bordered="false" class="mt-2">
      <n-flex vertical :size="[5, 5]">
        <n-grid v-if="dataList && dataList.length >= 1" x-gap="12" y-gap="12" :cols="4">
          <n-gi v-for="(item, idx) in dataList" :key="idx">
            <n-card size="small" class="w-full h-44" hoverable>
              <template #header>
                <n-tooltip trigger="hover" v-if="item.state == 3">
                  <template #trigger>
                    <n-tag type="error">
                      # {{ item.position }}
                      <template #icon>
                        <n-icon>
                          <CloseCircle />
                        </n-icon>
                      </template>
                    </n-tag>
                  </template>
                  {{ item.failure }}
                </n-tooltip>

                <n-tag type="success" v-else-if="item.state == 2">
                  # {{ item.position }}
                  <template #icon>
                    <n-icon>
                      <CheckmarkCircle />
                    </n-icon>
                  </template>
                </n-tag>
                <n-tag type="info" v-else>
                  # {{ item.position }}
                  <template #icon>
                    <n-icon>
                      <AnalyticsOutline />
                    </n-icon>
                  </template>
                </n-tag>
              </template>
              <template #header-extra>
                <n-dropdown
                  trigger="hover"
                  :options="options"
                  @select="
                    async (key: number) => {
                      if (key === 2) {
                        showModal = true;
                        form_data = Object.assign({}, item, { position: item.position });
                      } else {
                        await remove(item.id);
                        await onSearch();
                      }
                    }
                  "
                >
                  <n-button text>
                    <n-icon>
                      <EllipsisHorizontal />
                    </n-icon>
                  </n-button>
                </n-dropdown>
              </template>
              <n-ellipsis :line-clamp="4" :tooltip="false">{{ item.content }}</n-ellipsis>
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
      </n-flex>
    </n-card>
    <n-modal
      v-model:show="showModal"
      style="width: 50%"
      preset="card"
      :bordered="false"
      :content-style="{ paddingBottom: 0 }"
    >
      <template #header> # {{ form_data.position }} </template>
      <n-form ref="formRef" :model="form_data" :rules="form_data_rules">
        <n-form-item path="title" label="标题">
          <n-input v-model:value="form_data.title" maxlength="256" show-count />
        </n-form-item>
        <n-form-item path="content" label="内容">
          <n-input
            v-model:value="form_data.content"
            type="textarea"
            maxlength="2048"
            show-count
            :autosize="{ minRows: 8, maxRows: 16 }"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-flex justify="end">
          <n-button @click="showModal = false"> 取消 </n-button>
          <n-button type="info" @click="formSubmit"> 保存 </n-button>
        </n-flex>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue';
  import { useMessage } from 'naive-ui';
  import { ParagraphStateOptions } from '@/utils/optionsUtil';
  import {
    CheckmarkCircle,
    CloseCircle,
    AnalyticsOutline,
    EllipsisHorizontal,
  } from '@vicons/ionicons5';

  import { useRouter } from 'vue-router';
  import { queryPage, remove, modify } from '@/api/paragraph';
  const router = useRouter();
  const docId = router.currentRoute.value.params.id;
  const message = useMessage();
  const dataList = ref<any[]>([]);

  const searchForm = ref<{
    keyword: string;
    page: number;
    size: number;
    docId: any;
    state?: number;
  }>({
    keyword: '',
    page: 1,
    size: 8,
    docId: docId,
  });
  const options = [
    {
      label: '编辑',
      key: 2,
    },
    {
      label: '删除',
      key: 1,
    },
  ];

  const showModal = ref<boolean>(false);
  const form_data = ref<any>({});
  const formRef: any = ref(null);
  const form_data_rules = ref({
    content: [
      {
        required: true,
        message: '分段内容不能为空',
        trigger: 'blur',
      },
    ],
  });
  const formSubmit = () => {
    formRef.value.validate(async (errors) => {
      if (!errors) {
        await modify(form_data.value);
        await onSearch();
        showModal.value = false;
      } else {
        message.error('请检查表单填写是否正确');
      }
    });
  };

  const pagination = reactive({
    page: 1,
    pageSize: 8,
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

  onMounted(() => {
    onSearch();
  });
</script>
<style scoped>
  .light-green {
    height: 108px;
    background-color: rgba(0, 128, 0, 0.12);
  }
  .green {
    height: 108px;
    background-color: rgba(0, 128, 0, 0.24);
  }
</style>
