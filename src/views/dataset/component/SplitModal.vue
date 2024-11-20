<template>
  <n-modal v-model:show="showModal" style="width: 55%" class="pr-14">
    <n-card title="分段设置" :bordered="false">
      <template #footer>
        <n-flex justify="end" class="mr-5">
          <n-button @click="showModal = false">取消</n-button>
          <n-button type="primary" @click="onSubmit"> 确认 </n-button>
        </n-flex>
      </template>
      <RuleForm ref="ruleFormRef" :data="form_data" />
    </n-card>
  </n-modal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import RuleForm from './RuleForm.vue';
  import { useMessage } from 'naive-ui';
  import { detail, modify } from '@/api/document';

  const emit = defineEmits(['update:close']);
  const showModal = ref<boolean>(false);
  const message = useMessage();

  const form_data = ref<any>({
    datasetId: 0,
  });

  const ruleFormRef: any = ref(null);

  const openModal = async (id) => {
    const { data } = await detail(id);
    form_data.value = { ...data };
    showModal.value = true;
  };
  const onSubmit = async () => {
    if (await ruleFormRef.value.validate()) {
      message.error('请检查表单填写是否正确');
      return;
    }
    const requestData = { ...form_data.value, ...ruleFormRef.value.form_data };
    await modify({
      segmentMode: requestData.segmentMode,
      separators: requestData.separators,
      chunkSize: requestData.chunkSize,
      chunkOverlap: requestData.chunkOverlap,
      cleanRules: requestData.cleanRules,
      embedCols: requestData.embedCols,
      replyCols: requestData.replyCols,
      id: requestData.id,
    });
    message.success('保存成功');
    showModal.value = false;
    emit('update:close');
  };
  defineExpose({
    openModal,
  });
</script>
