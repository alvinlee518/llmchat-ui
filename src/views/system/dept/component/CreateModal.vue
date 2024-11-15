<template>
  <n-modal
    v-model:show="showModal"
    class="w-1/2"
    content-class="px-16"
    preset="card"
    :bordered="false"
  >
    <template #header>
      {{ `${form_data && form_data.id && form_data.id >= 1 ? '编辑' : '添加'}部门` }}
    </template>
    <n-form
      label-width="80px"
      label-placement="left"
      ref="formRef"
      :model="form_data"
      :rules="form_data_rules"
    >
      <n-form-item path="parentId" label="上级部门">
        <n-tree-select
          default-expand-all
          :options="deptList"
          label-field="label"
          key-field="value"
          children-field="children"
          v-model:value="form_data.parentId"
        />
      </n-form-item>
      <n-form-item path="name" label="部门名称">
        <n-input v-model:value="form_data.name" maxlength="64" show-count />
      </n-form-item>
      <n-form-item path="code" label="部门编码">
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
  import { create, modify, detail, getDeptTree } from '@/api/system/dept';

  const emit = defineEmits(['onClose']);

  const message = useMessage();
  const showModal = ref<boolean>(false);
  const formRef: any = ref(null);
  const defaultForm = {
    name: '',
    remark: '',
    code: '',
    sorting: 0,
    parentId: 0,
  };
  const form_data = ref<{
    id?: number;
    parentId: number;
    name: string;
    code: string;
    sorting: number;
    remark: string;
  }>({ ...defaultForm });

  const form_data_rules = ref({
    name: [
      {
        required: true,
        message: '请输入部门名称',
        trigger: 'blur',
      },
    ],
    code: [
      {
        required: true,
        message: '请输入部门编码',
        trigger: 'blur',
      },
    ],
  });

  const deptList = ref<any[]>([]);

  const fetchdeptList = async () => {
    const { data } = await getDeptTree(0);
    deptList.value = data;
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

  const openModal = async (id: any, parentId: any) => {
    showModal.value = true;
    await fetchdeptList();
    if (id && id >= 1) {
      const { data } = await detail(id);
      form_data.value = Object.assign({ ...form_data.value }, data, {
        id,
        parentId,
      });
    } else {
      form_data.value = Object.assign(
        { ...defaultForm },
        {
          id,
          parentId,
        }
      );
    }
  };

  defineExpose({
    openModal,
  });
</script>
