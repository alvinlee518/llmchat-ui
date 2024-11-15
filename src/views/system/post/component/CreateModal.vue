<template>
  <n-modal
    v-model:show="showModal"
    preset="card"
    :bordered="false"
    class="w-1/2"
    content-class="px-16"
  >
    <template #header>
      {{ `${form_data && form_data.id && form_data.id >= 1 ? '编辑' : '添加'}岗位` }}
    </template>
    <n-form
      label-width="80px"
      label-placement="left"
      ref="formRef"
      :model="form_data"
      :rules="form_data_rules"
    >
      <n-form-item path="name" label="岗位名称">
        <n-input v-model:value="form_data.name" maxlength="64" show-count />
      </n-form-item>
      <n-form-item path="code" label="岗位编码">
        <n-input v-model:value="form_data.code" maxlength="64" show-count />
      </n-form-item>
      <n-form-item path="sorting" label="排序">
        <n-input-number class="w-full" v-model:value="form_data.sorting" clearable />
      </n-form-item>
      <n-form-item path="remark" label="备注">
        <n-input
          v-model:value="form_data.remark"
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

  import { create, modify, detail } from '@/api/system/post';
  const emit = defineEmits(['onClose']);

  const message = useMessage();
  const showModal = ref<boolean>(false);
  const formRef: any = ref(null);
  const defaultForm = {
    name: '',
    remark: '',
    code: '',
    sorting: 0,
  };
  const form_data = ref<{
    id?: number;
    name: string;
    code: string;
    sorting: number;
    remark: string;
  }>({ ...defaultForm });

  const form_data_rules = ref({
    name: [
      {
        required: true,
        message: '请输入岗位名称',
        trigger: 'blur',
      },
    ],
    code: [
      {
        required: true,
        message: '请输入岗位编码',
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

  const openModal = async (id: any) => {
    showModal.value = true;
    if (id && id >= 1) {
      const { data } = await detail(id);
      form_data.value = Object.assign({}, form_data.value, data);
    } else {
      form_data.value = Object.assign({}, { ...defaultForm });
    }
  };

  defineExpose({
    openModal,
  });
</script>
