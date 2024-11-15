<template>
  <n-modal
    v-model:show="showModal"
    title="菜单权限"
    preset="card"
    :bordered="false"
    class="w-2/5"
    content-class="px-16"
  >
    <n-form ref="formRef" :model="form_data">
      <n-form-item path="name" label="角色名称">
        <n-input disabled v-model:value="form_data.name" maxlength="64" show-count />
      </n-form-item>
      <n-form-item path="code" label="角色编码">
        <n-input disabled v-model:value="form_data.code" maxlength="64" show-count />
      </n-form-item>
      <n-form-item path="menuIds">
        <template #label>
          <n-flex class="w-80" align="center" justify="space-between">
            <n-text>菜单权限</n-text>
            <div>
              <n-checkbox v-model:checked="expanded"> 展开/收起 </n-checkbox>
              <n-checkbox
                v-model:checked="checkedAll"
                @update:checked="
                  (checked) => {
                    if (checked) {
                      form_data.menuIds = getTreeAll(menuList);
                    } else {
                      form_data.menuIds = [];
                    }
                  }
                "
              >
                全选/全不选
              </n-checkbox>
            </div>
          </n-flex>
        </template>
        <n-tree
          class="mt-5 h-[24rem]"
          block-line
          cascade
          checkable
          expand-on-click
          label-field="label"
          key-field="value"
          children-field="children"
          :virtual-scroll="true"
          :checked-keys="form_data.menuIds"
          :default-expand-all="expanded"
          :data="menuList"
          @update:checked-keys="
            (checked) => {
              form_data.menuIds = [...checked];
            }
          "
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
  import { getTreeAll } from '@/utils';
  import { saveMenuScope, getMenuScope } from '@/api/system/role';
  import { getMenuTree } from '@/api/system/menu';
  const emit = defineEmits(['onClose']);
  const showModal = ref<boolean>(false);
  const formRef: any = ref(null);
  const defaultForm = {
    menuIds: [],
    name: '',
    code: '',
  };
  const form_data = ref<{
    id?: number;
    name: string;
    code: string;
    menuIds: number[];
  }>({ ...defaultForm });
  const checkedAll = ref<boolean>(false);
  const expanded = ref<boolean>(false);

  const menuList = ref<any[]>([]);
  const fetchmenuList = async () => {
    const { data } = await getMenuTree(0);
    menuList.value = data;
  };
  const formSubmit = async () => {
    await saveMenuScope(form_data.value);
    showModal.value = false;
    emit('onClose');
  };

  const openModal = async (id: any) => {
    showModal.value = true;
    await fetchmenuList();
    const { data } = await getMenuScope(id);
    form_data.value = Object.assign({}, form_data.value, data);
  };

  defineExpose({
    openModal,
  });
</script>
