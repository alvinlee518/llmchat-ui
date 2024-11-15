<template>
  <n-modal
    v-model:show="showModal"
    title="数据权限"
    preset="card"
    :bordered="false"
    class="w-2/5"
    content-class="px-16"
  >
    <n-form-item path="name" label="角色名称">
      <n-input disabled v-model:value="form_data.name" maxlength="64" show-count />
    </n-form-item>
    <n-form-item path="code" label="角色编码">
      <n-input disabled v-model:value="form_data.code" maxlength="64" show-count />
    </n-form-item>
    <n-form ref="formRef" :model="form_data">
      <n-form-item label="数据范围" path="dataScope">
        <n-select
          v-model:value="form_data.dataScope"
          :options="DataScopeOptions"
          placeholder="请选择数据范围"
          @update:value="
            (value) => {
              if (value !== 1) {
                form_data.deptIds = [];
              }
            }
          "
        />
      </n-form-item>
      <n-form-item path="name" v-if="form_data.dataScope === 1">
        <template #label>
          <n-flex class="w-80" align="center" justify="space-between">
            <n-text>数据权限</n-text>
            <div>
              <n-checkbox v-model:checked="expanded"> 展开/收起 </n-checkbox>
              <n-checkbox
                v-model:checked="checkedAll"
                @update:checked="
                  (checked) => {
                    if (checked) {
                      form_data.deptIds = getTreeAll(deptList);
                    } else {
                      form_data.deptIds = [];
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
          :checked-keys="form_data.deptIds"
          :default-expand-all="expanded"
          :data="deptList"
          @update:checked-keys="
            (checked) => {
              form_data.deptIds = [...checked];
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
  import { DataScopeOptions } from '@/utils/optionsUtil';
  import { saveDataScope, getDataScope } from '@/api/system/role';
  import { getDeptTree } from '@/api/system/dept';

  const emit = defineEmits(['onClose']);
  const showModal = ref<boolean>(false);
  const formRef: any = ref(null);
  const defaultForm = {
    dataScope: 0,
    deptIds: [],
    name: '',
    code: '',
    id: 0,
  };
  const form_data = ref<{
    id: number;
    name: string;
    code: string;
    dataScope: number;
    deptIds: number[];
  }>({ ...defaultForm });
  const checkedAll = ref<boolean>(false);
  const expanded = ref<boolean>(true);
  const deptList = ref<any[]>([]);
  const fetchdeptList = async () => {
    const { data } = await getDeptTree(0);
    deptList.value = data;
  };
  const formSubmit = async () => {
    await saveDataScope(form_data.value);
    showModal.value = false;
    emit('onClose');
  };

  const openModal = async (id: any) => {
    showModal.value = true;
    await fetchdeptList();
    const { data } = await getDataScope(id);
    form_data.value = Object.assign({}, form_data.value, data);
  };

  defineExpose({
    openModal,
  });
</script>
