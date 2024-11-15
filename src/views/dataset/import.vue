<template>
  <div>
    <n-card :bordered="false">
      <n-page-header
        title="导入数据"
        @back="
          () => {
            $router.go(-1);
          }
        "
      />
    </n-card>
  </div>
  <n-card :bordered="false" class="mt-2">
    <n-space vertical class="steps" justify="center">
      <n-steps style="margin-left: 9em" :current="currentTab">
        <n-step title="选择数据源" />
        <n-step title="数据处理" />
      </n-steps>
      <n-card :bordered="false" style="max-width: 760px; margin: 0">
        <DataForm ref="dataFormRef" :data="form_data" v-if="currentTab === 1" />
        <RuleForm ref="ruleFormRef" :data="form_data" v-if="currentTab === 2" />
      </n-card>
    </n-space>
    <n-float-button-group :right="64" :bottom="64">
      <n-float-button
        v-if="currentTab > 1"
        :width="120"
        type="primary"
        shape="square"
        @click="prevStep"
      >
        <template #description> 上一步 </template>
      </n-float-button>
      <n-float-button
        v-if="currentTab <= 2"
        :width="120"
        type="primary"
        shape="square"
        @click="nextStep"
      >
        <template #description> {{ currentTab === 2 ? '保存并导入' : '下一步' }} </template>
      </n-float-button>
    </n-float-button-group>
  </n-card>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useMessage } from 'naive-ui';
  import { useRouter } from 'vue-router';
  import DataForm from './component/DataForm.vue';
  import RuleForm from './component/RuleForm.vue';
  import { create } from '@/api/document';

  const router = useRouter();
  const datasetId = router.currentRoute.value.params.id;

  const message = useMessage();
  const currentTab = ref(1);
  const form_data = ref<any>({
    datasetId: datasetId,
  });
  const dataFormRef: any = ref(null);
  const ruleFormRef: any = ref(null);
  const loading = ref<boolean>(false);
  async function nextStep() {
    switch (currentTab.value) {
      case 1:
        if (await dataFormRef.value.validate()) {
          message.error('请检查表单填写是否正确');
          return;
        }
        form_data.value = Object.assign({}, form_data.value, dataFormRef.value.form_data);
        break;
      case 2:
        if (await ruleFormRef.value.validate()) {
          message.error('请检查表单填写是否正确');
          return;
        }
        form_data.value = Object.assign({}, form_data.value, ruleFormRef.value.form_data);
        break;
    }
    if (currentTab.value < 2) {
      currentTab.value += 1;
    } else if (currentTab.value == 2) {
      loading.value = true;
      try {
        const requestData = form_data.value;

        await create(
          {
            dataType: requestData.dataType,
            segmentMode: requestData.segmentMode,
            separators: requestData.separators,
            chunkSize: requestData.chunkSize,
            chunkOverlap: requestData.chunkOverlap,
            cleanRules: requestData.cleanRules,
            embedCols: requestData.embedCols,
            replyCols: requestData.replyCols,
            datasetId: datasetId,
          },
          requestData.fileList.map((item) => item.file)
        );
        currentTab.value = 1;
        form_data.value = {};
        router.push({ name: 'dataset_detail', params: { id: datasetId } });
      } finally {
        loading.value = false;
      }
    }
  }

  function prevStep() {
    if (currentTab.value > 1) {
      currentTab.value -= 1;
    }
  }
</script>

<style lang="less" scoped>
  .steps {
    max-width: 900px;
    margin: 0 auto;
  }
</style>
