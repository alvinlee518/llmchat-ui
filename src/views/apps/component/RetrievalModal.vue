<template>
  <n-drawer v-model:show="showModal" width="50%" @after-leave="onClose">
    <n-drawer-content title="检索设置">
      <n-form ref="formRef" :model="form_data" :rules="form_data_rules">
        <n-form-item
          label-width="100px"
          label="Rerank模型"
          label-placement="left"
          :show-require-mark="false"
          path="rerankModel"
        >
          <n-select v-model:value="form_data.rerankModel" :options="rerankModelOptions" clearable />
        </n-form-item>
        <n-form-item
          v-if="form_data.rerankModel && form_data.rerankModel >= 1"
          label-width="100px"
          label-placement="left"
          label="召回数量"
          :show-require-mark="false"
          path="topk"
        >
          <n-input-number v-model:value="form_data.topk" :min="1" :max="10" :step="1" />
        </n-form-item>
        <n-form-item
          v-if="form_data.rerankModel && form_data.rerankModel >= 1"
          label-width="100px"
          label-placement="left"
          label="相似度"
          :show-require-mark="false"
          path="score"
        >
          <n-input-number
            v-model:value="form_data.score"
            :min="0.01"
            :max="1"
            :precision="2"
            :step="0.01"
          />
        </n-form-item>
        <n-form-item
          label-width="100px"
          label="展示回答来源"
          label-placement="left"
          :show-require-mark="false"
          path="sourceEnabled"
        >
          <n-switch :checked-value="1" :unchecked-value="0" v-model:value="form_data.sourceEnabled">
            <template #checked>是</template>
            <template #unchecked>否</template>
          </n-switch>
        </n-form-item>
        <n-form-item
          label-width="100px"
          label="多轮对话改写"
          label-placement="left"
          :show-require-mark="false"
          path="rewriteEnabled"
        >
          <n-switch
            :checked-value="1"
            :unchecked-value="0"
            v-model:value="form_data.rewriteEnabled"
          >
            <template #checked>是</template>
            <template #unchecked>否</template>
          </n-switch>
        </n-form-item>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>
<script setup lang="ts">
  import { onMounted, ref } from 'vue';

  const formRef: any = ref(null);
  const emit = defineEmits(['close']);
  const showModal = ref<boolean>(false);
  const rerankModelOptions = ref<any[]>([]);

  const form_data = ref<{
    sourceEnabled: number;
    rewriteEnabled: number;
    rerankModel?: number;
    topk: number;
    score: number;
  }>({
    sourceEnabled: 0,
    rewriteEnabled: 1,
    topk: 3,
    score: 0.5,
  });

  const form_data_rules = ref({
    topk: [
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
  const openModal = (data: any) => {
    form_data.value = Object.assign({}, form_data.value, data || {});
    showModal.value = true;
  };
  const onClose = () => {
    emit('close', form_data.value);
  };
  defineExpose({
    openModal,
  });
  onMounted(() => {
    rerankModelOptions.value = [
      {
        label: 'bge-reranker-v2-m3',
        value: 1728542045579,
      },
    ];
  });
</script>
