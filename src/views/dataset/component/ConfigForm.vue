<template>
  <n-form
    ref="formRef"
    :model="form_data"
    :rules="form_data_rules"
    label-placement="left"
    label-width="150px"
  >
    <n-form-item label="Embedding模型" path="embedId">
      <n-select
        v-model:value="form_data.embedId"
        :options="embeddingOptions"
        placeholder="请选择Embedding模型"
      />
    </n-form-item>
    <n-form-item label="检索模式" path="searchMode">
      <n-radio-group style="width: 100%" v-model:value="form_data.searchMode" name="searchMode">
        <n-flex align="center" :wrap="false" class="n-card n-card--bordered p-3 mb-2 h-24">
          <div><n-radio :value="0" /></div>
          <div>
            <n-flex align="center">
              <n-icon :size="24"> <NumberOutlined /> </n-icon> 向量检索
            </n-flex>
            <div>
              <n-text depth="3"> 通过生成查询嵌入并查询与其向量表示最相似的文本分段 </n-text>
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
</template>

<script setup lang="ts">
  import { FileSearchOutlined, TableOutlined, NumberOutlined } from '@vicons/antd';
  import { selectGroupOptions } from '@/api/model';
  import { onMounted, ref, watch } from 'vue';

  const formRef: any = ref(null);
  const form_data = ref<{
    embedId?: string;
    searchMode: number;
    topK: number;
    score: number;
  }>({
    searchMode: 2,
    topK: 3,
    score: 0.5,
  });

  const form_data_rules = ref({
    embedId: [
      {
        required: true,
        type: 'string',
        message: '请选择Embedding模型',
        trigger: ['blur', 'change'],
      },
    ],
    searchMode: [
      {
        required: true,
        type: 'number',
        message: '请选择检索模式',
        trigger: ['blur', 'change'],
      },
    ],
    topK: [
      {
        required: true,
        type: 'number',
        message: '请输入召回数量',
        trigger: ['blur', 'change'],
      },
    ],
    score: [
      {
        required: true,
        type: 'number',
        message: '请输入相似度',
        trigger: ['blur', 'change'],
      },
    ],
  });

  const embeddingOptions = ref<any[]>([
    {
      label: 'bge-m3',
      value: 1,
    },
  ]);

  const props = defineProps({
    data: {
      type: Object,
      default: () => {},
    },
  });

  watch(
    () => props.data,
    (value) => {
      if (value && JSON.stringify(value) !== '{}') {
        form_data.value = Object.assign(form_data.value, { ...value });
      }
    },
    {
      immediate: true,
    }
  );

  /**
   * 校验表单
   */
  const validate = () => {
    if (!formRef.value) {
      return;
    }
    return formRef.value
      .validate()
      .catch((errors) => !errors)
      .then((errors) => !errors);
  };

  defineExpose({
    validate,
    form_data,
  });
  onMounted(async () => {
    const { data } = await selectGroupOptions(2);
    embeddingOptions.value = data;
  });
</script>
