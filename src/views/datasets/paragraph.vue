<template>
  <div>
    <n-card :bordered="false">
      <n-page-header
        title="查看知识库"
        @back="
          () => {
            $router.go(-1);
          }
        "
      >
        <n-input-group>
          <n-input
            type="text"
            placeholder="输入关键词搜索"
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
      </n-page-header>
    </n-card>
    <n-card :bordered="false" class="mt-2">
      <n-flex vertical :size="[5, 5]">
        <n-grid v-if="paragraphList && paragraphList.length >= 1" x-gap="5" :cols="4">
          <n-gi v-for="(item, index) in paragraphList" :key="index">
            <n-card size="small" class="w-full h-44" hoverable>
              <template #header> 分段{{ index }} </template>
              <template #header-extra>
                <n-button
                  text
                  @click="
                    () => {
                      showModal = true;
                      form_data = Object.assign({}, item, { index });
                    }
                  "
                >
                  <n-icon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 16 16"
                    >
                      <g fill="none">
                        <path
                          d="M14.854 1.854a.5.5 0 1 0-.708-.708l-8 8L6 10l.854-.146l8-8zM4.5 2A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-5a.5.5 0 0 0-1 0v5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5v-7A1.5 1.5 0 0 1 4.5 3h5.005a.5.5 0 0 0 0-1H4.5z"
                          fill="currentColor"
                        />
                      </g>
                    </svg>
                  </n-icon>
                </n-button>
              </template>
              <n-ellipsis :line-clamp="4" :tooltip="false">{{ item.content }}</n-ellipsis>
            </n-card>
          </n-gi>
        </n-grid>
        <n-empty v-else description="暂无数据" />
        <n-flex justify="end">
          <n-pagination
            v-model:page-count="pageCount"
            v-model:page="searchForm.page"
            v-model:page-size="searchForm.pageSize"
            :on-update:page="onPageChange"
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
      <template #header> 编辑分段{{ form_data.index }} </template>
      <n-form ref="formRef" :model="form_data" :rules="form_data_rules">
        <n-form-item path="title" label="分段标题">
          <n-input v-model:value="form_data.title" maxlength="256" show-count />
        </n-form-item>
        <n-form-item path="content" label="分段内容">
          <n-input
            v-model:value="form_data.content"
            type="textarea"
            maxlength="2048"
            show-count
            :autosize="{ minRows: 8, maxRows: 16 }"
          />
        </n-form-item>
        <n-form-item path="enabled" label="是否启用">
          <n-switch :checked-value="1" :unchecked-value="0" v-model:value="form_data.enabled">
            <template #checked>是</template>
            <template #unchecked>否</template>
          </n-switch>
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
  import { onMounted, ref } from 'vue';
  import { SearchSharp } from '@vicons/ionicons5';
  import { useMessage } from 'naive-ui';

  import { useRouter } from 'vue-router';
  const router = useRouter();
  const docId = router.currentRoute.value.params.id;
  const message = useMessage();
  const paragraphList = ref<any[]>([]);
  const pageCount = ref<number>(10);

  const searchForm = ref<{
    keyword: string;
    page: number;
    pageSize: number;
    docId: any;
  }>({
    keyword: '',
    page: 1,
    pageSize: 10,
    docId: docId,
  });

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
    formRef.value.validate((errors) => {
      if (!errors) {
        console.log('form_data', form_data.value);
      } else {
        message.error('请检查表单填写是否正确');
      }
    });
  };
  const onPageChange = async (page: number) => {
    searchForm.value.page = page;
    await fetchData();
  };
  const fetchData = () => {
    paragraphList.value = [
      {
        id: 1728366909514,
        title: '',
        content: '这是知识库的描述',
        enabled: 1,
      },
      {
        id: 1728366909515,
        title: '',
        content:
          '货币是为了提高交易效率而用于交换的中介商品。货币有多种形式，如贝壳粮食等自然物、金属纸张等加工品、银行卡信用卡等磁条卡、移动支付加密货币等APP。',
        enabled: 0,
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
