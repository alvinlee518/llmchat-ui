<template>
  <div>
    <n-card :bordered="false">
      <n-page-header
        title="命中测试"
        @back="
          () => {
            $router.go(-1);
          }
        "
      />
    </n-card>
    <n-card class="mt-2">
      <n-grid :x-gap="12">
        <n-grid-item span="11" style="border-right: 1px solid #ebebeb; padding-right: 12px">
          <n-h6>配置</n-h6>
          <n-form ref="formRef" :model="form_data">
            <n-form-item label="检索模式" path="searchMode">
              <n-radio-group
                style="width: 100%"
                v-model:value="form_data.searchMode"
                name="searchMode"
              >
                <n-flex align="center" :wrap="false" class="n-card n-card--bordered p-3 mb-2 h-24">
                  <div><n-radio :value="0" /></div>
                  <div>
                    <n-flex align="center">
                      <n-icon :size="24"> <NumberOutlined /> </n-icon> 向量检索
                    </n-flex>
                    <div>
                      <n-text depth="3">
                        通过生成查询嵌入并查询与其向量表示最相似的文本分段
                      </n-text>
                    </div>
                  </div>
                </n-flex>
                <n-flex align="center" :wrap="false" class="n-card n-card--bordered p-3 mb-2 h-24">
                  <div><n-radio :value="1" /></div>
                  <div>
                    <n-flex align="center">
                      <n-icon :size="24"> <FileSearchOutlined /> </n-icon> 全文检索
                    </n-flex>
                    <div>
                      <n-text depth="3">
                        索引文档中的所有词汇，从而允许用户查询任意词汇，并返回包含这些词汇的文本片段
                      </n-text>
                    </div>
                  </div>
                </n-flex>
                <n-flex align="center" :wrap="false" class="n-card n-card--bordered p-3 h-24">
                  <div><n-radio :value="2" /></div>
                  <div>
                    <n-flex align="center">
                      <n-icon :size="24"> <TableOutlined /> </n-icon> 混合检索<n-tag
                        type="info"
                        size="small"
                      >
                        推荐
                      </n-tag>
                    </n-flex>
                    <div>
                      <n-text depth="3">
                        同时执行全文检索和向量检索，并应用重排序步骤，从两类查询结果中选择匹配用户问题的最佳结果，需配置Rerank模型API
                      </n-text>
                    </div>
                  </div>
                </n-flex>
              </n-radio-group>
            </n-form-item>
            <n-form-item label="召回数量" path="topK">
              <n-input-number v-model:value="form_data.topK" :min="1" :max="10" :step="1" />
            </n-form-item>
            <n-form-item label="相似度" path="score" v-if="form_data.searchMode === 0">
              <n-input-number
                v-model:value="form_data.score"
                :min="0.01"
                :max="1"
                :precision="2"
                :step="0.01"
              />
            </n-form-item>
          </n-form>
        </n-grid-item>
        <n-grid-item span="13">
          <n-h6>输入</n-h6>
          <n-input
            v-model:value="form_data.keyword"
            size="large"
            placeholder="请输入文本"
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 8 }"
            @keydown.enter="onPressEnter"
          >
            <template #suffix>
              <n-button :loading="loading" type="primary" text @click="onPressEnter">
                <n-icon><SendOutlined /></n-icon>
              </n-button>
            </template>
          </n-input>
          <n-h6>召回结果</n-h6>
          <n-skeleton v-if="loading" text size="medium" :repeat="32" />
          <div v-else>
            <n-grid v-if="datasetList && datasetList.length >= 1" x-gap="12" y-gap="12" :cols="2">
              <n-gi v-for="(item, index) in datasetList" :key="index">
                <n-card size="small" class="w-full h-44" hoverable>
                  <template #header>
                    <n-ellipsis :line-clamp="1">{{ item.title }}</n-ellipsis>
                  </template>
                  <template #header-extra>
                    <n-text>相似度:{{ item.score ? item.score.toFixed(4) : 0 }}</n-text>
                  </template>
                  <n-ellipsis :line-clamp="4" :tooltip="{ width: '400px' }">
                    {{ item.content }}
                  </n-ellipsis>
                </n-card>
              </n-gi>
            </n-grid>
            <n-empty v-else description="无召回结果" class="mt-32" />
          </div>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup lang="ts">
  import { FileSearchOutlined, TableOutlined, NumberOutlined, SendOutlined } from '@vicons/antd';
  import { onMounted, ref } from 'vue';
  const formRef: any = ref(null);
  import { detail, hitTesting } from '@/api/dataset';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const id = router.currentRoute.value.params.id;
  const datasetList = ref<any[]>([]);
  const loading = ref<boolean>(false);
  const form_data = ref<{
    searchMode: number;
    topK: number;
    score: number;
    id: any;
    keyword: string;
  }>({
    searchMode: 2,
    score: 0.5,
    topK: 3,
    id: id,
    keyword: '',
  });

  const fetchData = async () => {
    loading.value = true;
    try {
      const { data } = await hitTesting({
        searchMode: form_data.value.searchMode,
        topK: form_data.value.topK,
        score: form_data.value.score,
        datasetId: form_data.value.id,
        keyword: form_data.value.keyword,
      });
      datasetList.value = data || [];
    } finally {
      loading.value = false;
    }
  };

  const onPressEnter = async (e) => {
    e.preventDefault();
    await fetchData();
  };

  onMounted(async () => {
    if (id) {
      const { data } = await detail(id);
      form_data.value = data;
    }
  });
</script>

<style lang="less" scoped>
  .card_content {
    background-color: var(--n-color-embedded);
  }
</style>
