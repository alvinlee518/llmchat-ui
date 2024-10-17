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
            <n-form-item label="检索模式" path="search_mode">
              <n-radio-group
                style="width: 100%"
                v-model:value="form_data.search_mode"
                name="search_mode"
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
            <n-form-item label="召回数量" path="topk">
              <n-input-number v-model:value="form_data.topk" :min="1" :max="10" :step="1" />
            </n-form-item>
            <n-form-item label="相似度" path="score">
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
            size="large"
            placeholder="请输入文本"
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 8 }"
          >
            <template #suffix>
              <n-button type="primary" text @click="onSearch">
                <n-icon><SendOutlined /></n-icon>
              </n-button>
            </template>
          </n-input>
          <n-h6>召回结果</n-h6>
          <n-grid v-if="datasetList && datasetList.length >= 1" x-gap="12" :cols="2">
            <n-gi v-for="(item, index) in datasetList" :key="index">
              <n-card size="small" class="w-full h-44" hoverable>
                <template #header>
                  <n-ellipsis :line-clamp="1">{{ item.doc_name }}</n-ellipsis>
                </template>
                <template #header-extra>
                  <n-text>相似度:{{ item.score }}</n-text>
                </template>
                <n-ellipsis :line-clamp="4" :tooltip="{ width: '400px' }">
                  {{ item.content }}
                </n-ellipsis>
              </n-card>
            </n-gi>
          </n-grid>
          <n-empty v-else description="无召回结果" class="h-full" />
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup lang="ts">
  import { FileSearchOutlined, TableOutlined, NumberOutlined, SendOutlined } from '@vicons/antd';
  import { onMounted, ref } from 'vue';
  const formRef: any = ref(null);

  import { useRouter } from 'vue-router';

  const router = useRouter();
  const datasetId = router.currentRoute.value.params.id;
  const datasetList = ref<any[]>([]);
  const form_data = ref<{
    search_mode: number;
    topk: number;
    score: number;
    datasetId: any;
  }>({
    search_mode: 2,
    score: 0.5,
    topk: 3,
    datasetId: datasetId,
  });

  const fetchData = () => {
    datasetList.value = [
      {
        id: 1728366909514,
        doc_name: '培训手册',
        content: '这是知识库的描述',
        score: 0.25,
      },
      {
        id: 1728366909515,
        doc_name: '飞行须知飞行须知飞行须知飞行须知飞行须知飞行须知',
        content:
          '货币是为了提高交易效率而用于交换的中介商品。货币有多种形式，如贝壳粮食等自然物、金属纸张等加工品、银行卡信用卡等磁条卡、移动支付加密货币等APP。货币是为了提高交易效率而用于交换的中介商品。货币有多种形式，如贝壳粮食等自然物、金属纸张等加工品、银行卡信用卡等磁条卡、移动支付加密货币等APP。',
        score: 0.25,
      },
    ];
  };

  const onSearch = async () => {
    await fetchData();
  };

  onMounted(() => {
    console.log('modify datasets:' + datasetId);
    if (datasetId) {
      // TODO: 获取数据
    }
  });
</script>

<style lang="less" scoped>
  .card_content {
    background-color: var(--n-color-embedded);
  }
</style>
