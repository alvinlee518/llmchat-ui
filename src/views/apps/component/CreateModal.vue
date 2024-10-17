<template>
  <n-modal
    v-model:show="showModal"
    style="width: 50%"
    preset="card"
    :bordered="false"
    :content-style="{ paddingBottom: 0 }"
  >
    <template #header>
      {{ `${form_data && form_data.id && form_data.id >= 1 ? '编辑' : '创建'}应用` }}
    </template>
    <n-form ref="formRef" :model="form_data" :rules="form_data_rules">
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
    <template #footer>
      <n-flex justify="end">
        <n-button @click="showModal = false"> 取消 </n-button>
        <n-button type="info" @click="formSubmit"> 保存 </n-button>
      </n-flex>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useMessage } from 'naive-ui';

  const message = useMessage();
  const showModal = ref<boolean>(false);
  const formRef: any = ref(null);
  const form_data = ref<{
    id?: number;
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
        message: '请输入应用名称',
        trigger: 'blur',
      },
    ],
  });

  const formSubmit = () => {
    formRef.value.validate((errors) => {
      if (!errors) {
        console.log('form_data', form_data.value);
      } else {
        message.error('请检查表单填写是否正确');
      }
    });
  };

  const openModal = (id: any) => {
    // TODO: 获取详情
    console.log('app id', id);
    form_data.value.id = id;
    showModal.value = true;
  };

  defineExpose({
    openModal,
  });
</script>
