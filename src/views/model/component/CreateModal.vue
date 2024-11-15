<template>
  <n-modal
    v-model:show="showModal"
    :show-icon="false"
    preset="dialog"
    :title="form_data.id && form_data.id >= 1 ? '编辑模型' : '添加模型'"
    :style="{ width: '600px' }"
  >
    <n-form ref="formRef" :model="form_data" :rules="form_data_rules">
      <n-form-item label="模型供应商" path="modelProvider">
        <n-select
          :disabled="form_data.id && form_data.id >= 1 ? true : false"
          v-model:value="form_data.modelProvider"
          :options="providerList"
          placeholder="请选择模型供应商"
        />
      </n-form-item>
      <n-form-item label="模型类型" path="modelType">
        <n-select
          v-model:value="form_data.modelType"
          :options="typeOptions"
          placeholder="请选择模型类型"
        />
      </n-form-item>
      <n-form-item label="模型名称" path="modelName" v-if="form_data.modelProvider !== 2">
        <n-input
          v-model:value="form_data.modelName"
          maxlength="50"
          show-count
          placeholder="请输入模型名称"
        />
      </n-form-item>
      <n-form-item label="API 域名" path="baseUrl" v-if="form_data.modelProvider !== 3">
        <n-input v-model:value="form_data.baseUrl" placeholder="请输入API域名" />
      </n-form-item>
      <n-form-item
        label="访问凭据"
        path="apiKey"
        v-if="
          form_data.modelProvider !== 2 &&
          form_data.modelProvider !== 4 &&
          form_data.modelProvider !== 5
        "
      >
        <n-input v-model:value="form_data.apiKey" placeholder="请输入访问凭据" />
      </n-form-item>
    </n-form>
    <template #action>
      <n-space>
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="info" @click="formSubmit">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
  import { useMessage } from 'naive-ui';
  import { computed, ref } from 'vue';
  import { create, modify, detail } from '@/api/model';
  const props = defineProps<{
    providerList: any[];
  }>();
  const typeOptions = computed(() => {
    return (
      props.providerList.find((item) => item.value === form_data.value.modelProvider)
        ?.supportedModelTypes || []
    );
  });
  const emit = defineEmits(['onClose']);
  const showModal = ref<boolean>(false);
  const formRef: any = ref(null);
  const message = useMessage();
  const defaultForm = {
    modelName: '',
    baseUrl: '',
    apiKey: '',
  };
  const form_data = ref<{
    id?: number;
    modelName: string;
    modelProvider?: number;
    modelType?: number;
    baseUrl: string;
    apiKey: string;
  }>({ ...defaultForm });

  const form_data_rules = {
    modelName: [{ required: true, message: '请输入模型名称', trigger: 'blur' }],
    baseUrl: [{ required: true, message: '请输入API域名', trigger: 'blur' }],
    apiKey: [{ required: true, message: '请输入访问凭据', trigger: 'blur' }],
    modelProvider: [
      { required: true, type: 'number', message: '请选择模型供应商', trigger: ['blur', 'change'] },
    ],
    modelType: [
      { required: true, type: 'number', message: '请选择模型类型', trigger: ['blur', 'change'] },
    ],
  };

  const formSubmit = () => {
    formRef.value.validate(async (errors) => {
      if (!errors) {
        if (form_data.value.id && form_data.value.id >= 1) {
          await modify(form_data.value);
        } else {
          await create(form_data.value);
        }
        showModal.value = false;
        emit('onClose');
      } else {
        message.error('请检查表单填写是否正确');
      }
    });
  };

  const openModal = async (id: any, modelProvider: any) => {
    showModal.value = true;
    if (id && id >= 1) {
      const { data } = await detail(id);
      form_data.value = Object.assign({ ...form_data.value }, data);
    } else {
      form_data.value = Object.assign({ ...defaultForm }, { id, modelProvider });
    }
  };

  defineExpose({
    openModal,
  });
</script>
