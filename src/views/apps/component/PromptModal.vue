<template>
  <n-drawer v-model:show="showModal" width="50%" @after-leave="onClose">
    <n-drawer-content title="AI生成提示词">
      <n-alert :show-icon="false" type="info">
        例如：你是一位述职汇报导师，请根据我给的工作目标，生成对应的年度述职报告，要求分点概述目标、策略和成果等。
      </n-alert>
      <n-form
        ref="formRef"
        :label-width="120"
        :model="form_data"
        :rules="form_data_rules"
        class="mt-4"
      >
        <n-form-item path="instructions" label="指令">
          <n-input
            v-model:value="form_data.instructions"
            type="textarea"
            maxlength="512"
            show-count
            :autosize="{ minRows: 6, maxRows: 12 }"
            placeholder="你是一位述职汇报导师，请根据我给的工作目标，生成对应的年度述职报告，要求分点概述目标、策略和成果等。"
          />
        </n-form-item>
        <n-form-item label="生成的提示词">
          <n-input
            v-model:value="form_data.prompt"
            type="textarea"
            maxlength="8192"
            show-count
            readonly
            :autosize="{ minRows: 6, maxRows: 12 }"
            placeholder=""
          />
        </n-form-item>
        <n-form-item :show-label="false">
          <n-flex justify="end" class="w-full">
            <n-button type="success" @click="formSubmit"> 一键生成 </n-button>
            <n-button
              type="info"
              @click="
                () => {
                  emit('update:prompt', form_data.prompt);
                }
              "
            >
              应用
            </n-button>
          </n-flex>
        </n-form-item>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>
<script setup lang="ts">
  import { ref } from 'vue';

  import { useMessage } from 'naive-ui';

  const message = useMessage();
  const showModal = ref<boolean>(false);

  const emit = defineEmits(['update:prompt']);
  const formRef: any = ref(null);
  const form_data = ref<{
    instructions: string;
    prompt: string;
  }>({
    instructions: '',
    prompt: '',
  });

  const form_data_rules = ref({
    instructions: [
      {
        required: true,
        type: 'string',
        message: '请输入指令',
        trigger: 'blur',
      },
    ],
  });

  const openModal = async () => {
    showModal.value = true;
  };

  const onClose = () => {};
  const formSubmit = () => {
    formRef.value.validate((errors) => {
      if (!errors) {
        console.log('form_data', form_data.value);
        //TODO: 提交表单
      } else {
        message.error('请检查表单填写是否正确');
      }
    });
  };
  defineExpose({
    openModal,
  });
</script>
