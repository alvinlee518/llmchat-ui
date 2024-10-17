<template>
  <n-modal
    v-model:show="showModal"
    class="w-1/2"
    content-class="px-16"
    preset="card"
    :bordered="false"
  >
    <template #header>
      {{ `${form_data && form_data.id && form_data.id >= 1 ? '编辑' : '添加'}菜单` }}
    </template>
    <n-form
      label-width="80px"
      label-placement="left"
      ref="formRef"
      :model="form_data"
      :rules="form_data_rules"
    >
      <n-form-item path="parentId" label="上级菜单">
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
      <n-form-item path="menuType" label="菜单类型">
        <n-radio-group v-model:value="form_data.menuType" name="menuType">
          <n-space>
            <n-radio v-for="(item, idx) in MenuTypeOptions" :key="idx" :value="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item path="name" label="菜单名称">
        <n-input v-model:value="form_data.name" maxlength="64" show-count />
      </n-form-item>
      <n-form-item path="path" label="路由" v-if="form_data.menuType == 1">
        <n-input v-model:value="form_data.path" />
      </n-form-item>
      <n-form-item path="target" label="打开方式" v-if="form_data.menuType == 1">
        <n-radio-group v-model:value="form_data.target" name="target">
          <n-space>
            <n-radio :value="0"> 页签 </n-radio>
            <n-radio :value="1"> 新窗口 </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item path="perms" label="权限标识" v-if="form_data.menuType != 0">
        <n-input v-model:value="form_data.perms" />
      </n-form-item>
      <n-form-item path="sorting" label="排序">
        <n-input-number class="w-full" v-model:value="form_data.sorting" clearable />
      </n-form-item>
      <n-form-item path="hidden" label="是否隐藏">
        <n-radio-group v-model:value="form_data.hidden" name="target">
          <n-space>
            <n-radio v-for="(item, idx) in BooleanOptions" :key="idx" :value="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-form-item path="keepAlive" label="是否刷新" v-if="form_data.menuType == 1">
        <n-radio-group v-model:value="form_data.keepAlive" name="target">
          <n-space>
            <n-radio v-for="(item, idx) in BooleanOptions" :key="idx" :value="item.value">
              {{ item.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
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
  import { BooleanOptions, MenuTypeOptions } from '@/utils/optionsUtil';

  const message = useMessage();
  const showModal = ref<boolean>(false);
  const formRef: any = ref(null);
  const form_data = ref<{
    id?: number;
    parentId: number;
    menuType: number;
    name: string;
    path: string;
    target: number;
    perms: string;
    hidden: number;
    keepAlive: number;
    sorting: number;
    remark: string;
  }>({
    name: '',
    remark: '',
    sorting: 0,
    parentId: 0,
    menuType: 0,
    path: '',
    target: 0,
    perms: '',
    hidden: 0,
    keepAlive: 0,
  });

  const form_data_rules = ref({
    name: [
      {
        required: true,
        message: '请输入菜单名称',
        trigger: 'blur',
      },
    ],
    path: [
      {
        required: true,
        message: '请输入路由地址',
        trigger: 'blur',
      },
    ],
    perms: [
      {
        required: true,
        message: '请输入权限标识',
        trigger: 'blur',
      },
    ],
  });

  const treeData = ref<any[]>([]);

  const fetchTreeData = () => {
    treeData.value = [
      {
        label: 'Dashboard',
        key: 1729048848368,
        children: [
          {
            label: '主控台',
            key: 1729048848367,
          },
          {
            label: '工作台',
            key: 1729048848366,
          },
        ],
      },
      {
        label: '表单管理',
        key: 1729048848365,
        children: [
          {
            label: '基础表单',
            key: 1729048848364,
          },
          {
            label: '分步表单',
            key: 1729048848363,
          },
          {
            label: '表单详情',
            key: 1729048848362,
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
