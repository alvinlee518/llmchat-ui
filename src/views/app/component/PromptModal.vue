<template>
  <n-modal v-model:show="showModal" style="width: 75%">
    <n-card :bordered="false">
      <n-grid x-gap="12">
        <n-gi :span="10">
          <n-h3> AI生成提示词</n-h3>
          <n-alert :show-icon="false" type="info" class="text-xs">
            例如：你是一位PPT大纲撰写高手，请根据我给出的PPT核心内容，写一个PPT大纲,要求结构清晰，有逻辑。
          </n-alert>
          <n-form
            ref="formRef"
            :label-width="120"
            :model="form_data"
            :rules="{
              instruction: [
                {
                  required: true,
                  type: 'string',
                  message: '请输入角色设定',
                  trigger: 'blur',
                },
              ],
            }"
            class="mt-4"
          >
            <n-form-item path="instruction" label="角色设定">
              <n-input
                v-model:value="form_data.instruction"
                type="textarea"
                maxlength="512"
                show-count
                :autosize="{ minRows: 5, maxRows: 12 }"
                placeholder="你是一位PPT大纲撰写高手，请根据我给出的PPT核心内容，写一个PPT大纲,要求结构清晰，有逻辑。"
              />
            </n-form-item>
          </n-form>
          <n-form-item>
            <n-flex justify="end" class="w-full">
              <n-button type="success" @click="formSubmit" :loading="loading"> 一键生成 </n-button>
              <n-button
                type="info"
                :disabled="!form_data.taskObjective || !form_data.prologue"
                @click="
                  () => {
                    const prompt = `任务目标：\n${form_data.taskObjective}\n输出格式：\n${form_data.outputFormat}\n关键点：\n${form_data.keyPoints}`;
                    emit('update:prompt', prompt);
                    emit('update:prologue', form_data.prologue);
                    showModal = false;
                  }
                "
              >
                应用
              </n-button>
            </n-flex>
          </n-form-item>
        </n-gi>
        <n-gi :span="14">
          <n-flex vertical class="ml-5 mr-2" v-if="form_data.taskObjective || form_data.prologue">
            <n-h3> 提示词 </n-h3>
            <n-text class="text-sm font-medium"> 任务目标：</n-text>
            <pre class="w-full font-light whitespace-pre-wrap">{{ form_data.taskObjective }}</pre>
            <n-text class="text-sm font-medium"> 输出格式：</n-text>
            <pre class="w-full font-light whitespace-pre-wrap">{{ form_data.outputFormat }}</pre>
            <n-text class="text-sm font-medium"> 关键点：</n-text>
            <pre class="w-full font-light whitespace-pre-wrap">{{ form_data.keyPoints }}</pre>
            <n-h3> 开场白</n-h3>
            <pre class="w-full font-light whitespace-pre-wrap">{{ form_data.prologue }}</pre>
          </n-flex>
          <n-empty class="mt-32" description="在左侧描述您的用例，编排预览将在此处显示。" v-else />
        </n-gi>
      </n-grid>
    </n-card>
  </n-modal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';

  import { useMessage } from 'naive-ui';
  import { prompt_optimize } from '@/api/chat';

  const message = useMessage();
  const showModal = ref<boolean>(false);
  const loading = ref<boolean>(false);

  const emit = defineEmits(['update:prompt', 'update:prologue']);
  const formRef: any = ref(null);
  const props = defineProps({
    modelId: {
      type: String,
      default: () => '',
    },
  });
  const DEFAULT_DATA = {
    instruction: '',
    prologue: '',
    taskObjective: '',
    outputFormat: '',
    keyPoints: '',
  };
  const form_data = ref<{
    instruction: string;
    taskObjective: string;
    outputFormat: string;
    keyPoints: string;
    prologue: string;
  }>({ ...DEFAULT_DATA });

  const openModal = async () => {
    showModal.value = true;
    form_data.value = { ...DEFAULT_DATA };
  };

  const formSubmit = () => {
    formRef.value.validate(async (errors) => {
      if (!errors) {
        loading.value = true;
        try {
          const { data } = await prompt_optimize({
            modelId: props.modelId,
            instruction: form_data.value.instruction,
          });
          form_data.value = Object.assign(
            { ...data },
            { instruction: form_data.value.instruction }
          );
        } finally {
          loading.value = false;
        }
      } else {
        message.error('请检查表单填写是否正确');
      }
    });
  };
  defineExpose({
    openModal,
  });
</script>
