<template>
  <n-form
    ref="formRef"
    :model="form_data"
    :rules="form_data_rules"
    label-placement="left"
    label-width="150px"
  >
    <n-form-item label="知识库名称" path="name">
      <n-input
        v-model:value="form_data.name"
        maxlength="64"
        show-count
        placeholder="请输入知识库名称"
      />
    </n-form-item>
    <n-form-item label="知识库描述" path="description">
      <n-input
        v-model:value="form_data.description"
        type="textarea"
        maxlength="256"
        show-count
        placeholder="请输入知识库描述。对知识库包含的内容和数据的用途进行描述。"
      />
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';

  const formRef: any = ref(null);
  const form_data = ref<{
    name: string;
    description: string;
  }>({
    name: '',
    description: '',
  });

  const form_data_rules = ref({
    name: [
      {
        required: true,
        message: '请输入知识库名称',
        trigger: 'blur',
      },
    ],
  });

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
</script>
