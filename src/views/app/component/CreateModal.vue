<template>
  <n-modal
    v-model:show="showModal"
    style="width: 40%"
    preset="card"
    :bordered="false"
    :content-style="{ paddingBottom: 0 }"
  >
    <template #header>
      {{ `${form_data && form_data.id && form_data.id >= 1 ? '编辑' : '创建'}应用` }}
    </template>
    <template #footer>
      <n-flex justify="end" class="mr-8">
        <n-button @click="showModal = false"> 取消 </n-button>
        <n-button type="info" @click="formSubmit"> 保存 </n-button>
      </n-flex>
    </template>
    <n-form
      label-placement="left"
      label-width="120px"
      ref="formRef"
      :model="form_data"
      :rules="form_data_rules"
      class="mr-8"
    >
      <n-form-item path="name" label="应用名称">
        <n-input v-model:value="form_data.name" maxlength="64" show-count />
      </n-form-item>
      <n-form-item path="description" label="应用描述">
        <n-input
          v-model:value="form_data.description"
          type="textarea"
          maxlength="256"
          show-count
          :autosize="{ minRows: 3, maxRows: 3 }"
        />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useMessage } from 'naive-ui';

  import { create, modify, detail } from '@/api/app';
  const emit = defineEmits(['onClose']);
  const message = useMessage();
  const showModal = ref<boolean>(false);
  const formRef: any = ref(null);
  const defaultForm = {
    name: '',
    description: '',
  };
  const form_data = ref<{
    id?: number;
    name: string;
    description: string;
  }>(defaultForm);

  const form_data_rules = ref({
    name: [
      {
        required: true,
        message: '请输入应用名称',
        trigger: 'blur',
      },
    ],
  });

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
