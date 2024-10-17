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
          :options="treeData"
          :default-value="form_data.parentId"
          @update:value="
            (value) => {
              form_data.parentId = value;
            }
          "
        />
      </n-form-item>
      <n-form-item path="name" label="部门名称">
        <n-input v-model:value="form_data.name" maxlength="64" show-count />
      </n-form-item>
      <n-form-item path="value" label="部门编码">
        <n-input v-model:value="form_data.value" maxlength="64" show-count />
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

  const message = useMessage();
  const showModal = ref<boolean>(false);
  const formRef: any = ref(null);
  const form_data = ref<{
    id?: number;
    parentId: number;
    name: string;
    value: string;
    sorting: number;
    remark: string;
  }>({
    name: '',
    remark: '',
    value: '',
    sorting: 0,
    parentId: 0,
  });

  const form_data_rules = ref({
    name: [
      {
        required: true,
        message: '请输入部门名称',
        trigger: 'blur',
      },
    ],
  });

  const treeData = ref<any[]>([]);

  const fetchTreeData = () => {
    treeData.value = [
      {
        label: '总公司',
        key: 1729048848368,
        children: [
          {
            label: '北京分公司',
            key: 1729048848367,
            children: [
              {
                label: '研发部门',
                key: 1729048848364,
              },
              {
                label: '产品部门',
                key: 1729048848363,
              },
            ],
          },
          {
            label: '上海分公司',
            key: 1729048848366,
            children: [
              {
                label: '运营部门',
                key: 1729048848362,
              },
              {
                label: '销售部门',
                key: 1729048848365,
              },
            ],
          },
        ],
      },
    ];
  };

  const formSubmit = () => {
    formRef.value.validate((errors) => {
      if (!errors) {
        console.log('form_data', form_data.value);
      } else {
        message.error('请检查表单填写是否正确');
      }
    });
  };

  const openModal = async (id: any, parentId: any) => {
    await fetchTreeData();
    // TODO: 获取详情
    form_data.value = Object.assign({}, form_data.value, {
      id,
      parentId,
    });
    console.log('app id', id);
    showModal.value = true;
  };

  defineExpose({
    openModal,
  });
</script>
