<template>
  <n-modal v-model:show="showModal" style="width: 40%">
    <n-card title="召回配置" :bordered="false">
      <template #footer>
        <n-flex justify="end" class="mr-5">
          <n-button @click="showModal = false">取消</n-button>
          <n-button type="primary" @click="onSubmit"> 确认 </n-button>
        </n-flex>
      </template>
      <n-form
        label-placement="left"
        ref="formRef"
        :model="form_data"
        :rules="form_data_rules"
        label-width="120px"
        class="mr-5"
      >
        <n-form-item label="Rerank模型" :show-require-mark="false" path="rerankId">
          <n-select
            v-model:value="form_data.rerankId"
            :options="modelOptions"
            clearable
            @clear="
              () => {
                form_data.topK = 3;
                form_data.score = 0.5;
              }
            "
          />
        </n-form-item>
        <n-form-item v-if="form_data.rerankId" label="召回数量" path="topK">
          <n-input-number
            v-model:value="form_data.topK"
            :min="1"
            :max="10"
            :step="1"
            class="w-full"
          />
        </n-form-item>
        <n-form-item v-if="form_data.rerankId" label="相似度" path="score">
          <n-input-number
            v-model:value="form_data.score"
            :min="0.01"
            :max="1"
            :precision="2"
            :step="0.01"
            class="w-full"
          />
        </n-form-item>
        <n-form-item label="展示回答来源" path="sourceEnabled">
          <n-switch :checked-value="1" :unchecked-value="0" v-model:value="form_data.sourceEnabled">
            <template #checked>是</template>
            <template #unchecked>否</template>
          </n-switch>
        </n-form-item>
        <n-form-item label="多轮对话改写" path="rewriteEnabled">
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
    </n-card>
  </n-modal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';

  import { selectGroupOptions } from '@/api/model';
  import { useMessage } from 'naive-ui';
  const formRef: any = ref(null);
  const emit = defineEmits([
    'update:rerank-id',
    'update:source-enabled',
    'update:top-k',
    'update:score',
    'update:rewrite-enabled',
  ]);
  const showModal = ref<boolean>(false);
  const modelOptions = ref<any[]>([]);
  const message = useMessage();

  interface RerankInterface {
    sourceEnabled: number;
    rerankId?: string;
    topK: number;
    score: number;
    rewriteEnabled: number;
  }
  const props = defineProps<RerankInterface>();

  const form_data = ref<RerankInterface>({
    rerankId: '',
    sourceEnabled: 0,
    topK: 3,
    score: 0.5,
    rewriteEnabled: 0,
  });

  const form_data_rules = ref({
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

  const openModal = async () => {
    const { data } = await selectGroupOptions(1);
    modelOptions.value = data;
    form_data.value = { ...props };
    showModal.value = true;
  };
  const onSubmit = () => {
    formRef.value.validate(async (errors) => {
      if (!errors) {
        showModal.value = false;
        emit('update:rerank-id', form_data.value.rerankId);
        emit('update:score', form_data.value.score);
        emit('update:source-enabled', form_data.value.sourceEnabled);
        emit('update:rewrite-enabled', form_data.value.rewriteEnabled);
        emit('update:top-k', form_data.value.topK);
      } else {
        message.error('请检查表单填写是否正确');
      }
    });
  };
  defineExpose({
    openModal,
  });
</script>
