<template>
  <n-modal
    v-model:show="showModal"
    title="数据权限"
    preset="card"
    :bordered="false"
    class="w-2/5"
    content-class="px-16"
  >
    <n-form ref="formRef" :model="form_data">
      <n-form-item label="数据范围" path="dataScope">
        <n-select
          v-model:value="form_data.dataScope"
          :options="DataScopeOptions"
          placeholder="请选择数据范围"
        />
      </n-form-item>
      <n-form-item path="name">
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
                      form_data.deptIds = getTreeAll(treeData);
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
          :virtual-scroll="true"
          :checked-keys="form_data.deptIds"
          :default-expand-all="expanded"
          :data="treeData"
          @update:checked-keys="
            (checked) => {
              form_data.deptIds = [form_data.deptIds, ...checked];
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
  import { DataScopeOptions } from '@/utils/optionsUtil';
  const message = useMessage();
  const showModal = ref<boolean>(false);
  const formRef: any = ref(null);
  const form_data = ref<{
    id?: number;
    dataScope: number;
    deptIds: number[];
  }>({
    dataScope: 0,
    deptIds: [],
  });
  const checkedAll = ref<boolean>(false);
  const expanded = ref<boolean>(true);
  const treeData = [
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
  const formSubmit = () => {};

  const openModal = (id: any) => {
    // TODO: 获取详情
    form_data.value.id = id;
    console.log('app id', id);
    showModal.value = true;
  };

  defineExpose({
    openModal,
  });
</script>
