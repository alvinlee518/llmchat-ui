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
                      form_data.menuIds = getTreeAll(treeData);
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
          :virtual-scroll="true"
          :checked-keys="form_data.menuIds"
          :default-expand-all="expanded"
          :data="treeData"
          @update:checked-keys="
            (checked) => {
              form_data.menuIds = [form_data.menuIds, ...checked];
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
  import { useMessage } from 'naive-ui';
  import { getTreeAll } from '@/utils';
  const message = useMessage();
  const showModal = ref<boolean>(false);
  const formRef: any = ref(null);
  const form_data = ref<{
    id?: number;
    menuIds: number[];
  }>({
    menuIds: [],
  });
  const checkedAll = ref<boolean>(false);
  const expanded = ref<boolean>(false);
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
  const formSubmit = () => {};

  const openModal = async (id: any) => {
    await fetchTreeData();
    // TODO: 获取详情
    form_data.value.id = id;
    console.log('app id', id);
    showModal.value = true;
  };

  defineExpose({
    openModal,
  });
</script>
