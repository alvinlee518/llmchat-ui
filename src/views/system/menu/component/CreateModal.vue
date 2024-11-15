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
          :options="menuList"
          default-expand-all
          label-field="label"
          key-field="value"
          children-field="children"
          v-model:value="form_data.parentId"
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
      <n-form-item path="path" label="路由地址" v-if="form_data.menuType != 2">
        <n-input v-model:value="form_data.path" />
      </n-form-item>
      <n-form-item path="path" label="组件地址" v-if="form_data.menuType == 1">
        <n-input v-model:value="form_data.component" />
      </n-form-item>
      <n-form-item path="perms" label="权限标识" v-if="form_data.menuType != 0">
        <n-input v-model:value="form_data.perms" />
      </n-form-item>
      <n-form-item path="target" label="打开方式" v-if="form_data.menuType == 1">
        <n-radio-group v-model:value="form_data.target" name="target">
          <n-space>
            <n-radio :value="0"> 页签 </n-radio>
            <n-radio :value="1"> 新窗口 </n-radio>
          </n-space>
        </n-radio-group>
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
  import { BooleanOptions, MenuTypeOptions } from '@/utils/optionsUtil';

  import { create, modify, detail, getMenuTree } from '@/api/system/menu';

  const emit = defineEmits(['onClose']);
  const message = useMessage();
  const showModal = ref<boolean>(false);
  const formRef: any = ref(null);
  const defaultForm = {
    name: '',
    remark: '',
    sorting: 0,
    parentId: 0,
    menuType: 0,
    path: '',
    component: '',
    target: 0,
    perms: '',
    hidden: 0,
    keepAlive: 0,
  };
  const form_data = ref<{
    id?: number;
    parentId: number;
    menuType: number;
    name: string;
    path: string;
    component: string;
    target: number;
    perms: string;
    hidden: number;
    keepAlive: number;
    sorting: number;
    remark: string;
  }>({ ...defaultForm });

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
  const menuList = ref<any[]>([]);

  const fetchmenuList = async () => {
    const { data } = await getMenuTree(0);
    menuList.value = data;
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
    await fetchmenuList();
    if (id && id >= 1) {
      const { data } = await detail(id);
      form_data.value = Object.assign({ ...form_data.value }, data);
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
