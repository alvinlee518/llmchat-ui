<template>
  <div>
    <n-card :bordered="false">
      <n-page-header
        title="创建知识库"
        @back="
          () => {
            $router.go(-1);
          }
        "
      />
    </n-card>
    <n-spin :show="loading">
      <n-card :bordered="false" class="mt-2">
        <n-space vertical class="steps" justify="center">
          <n-steps :current="currentTab">
            <n-step title="知识库信息" />
            <n-step title="知识库设置" />
            <n-step title="选择数据源" />
            <n-step title="数据处理" />
          </n-steps>
          <n-card :bordered="false" style="max-width: 760px; margin: 0">
            <BaseForm ref="baseFormRef" :data="form_data" v-if="currentTab === 1" />
            <ConfigForm ref="configFormRef" :data="form_data" v-if="currentTab === 2" />
            <DataForm ref="dataFormRef" :data="form_data" v-if="currentTab === 3" />
            <RuleForm ref="ruleFormRef" :data="form_data" v-if="currentTab === 4" />
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
            v-if="currentTab <= 4"
            :width="120"
            type="primary"
            shape="square"
            @click="nextStep"
          >
            <template #description> {{ currentTab === 4 ? '创建并导入' : '下一步' }} </template>
          </n-float-button>
        </n-float-button-group>
      </n-card>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useMessage } from 'naive-ui';
  import BaseForm from './component/BaseForm.vue';
  import ConfigForm from './component/ConfigForm.vue';
  import DataForm from './component/DataForm.vue';
  import RuleForm from './component/RuleForm.vue';
  import { create } from '@/api/dataset';

  import { useRouter } from 'vue-router';

  const router = useRouter();
  const message = useMessage();
  const currentTab = ref(1);
  const form_data = ref<any>({});
  const baseFormRef: any = ref(null);
  const configFormRef: any = ref(null);
  const dataFormRef: any = ref(null);
  const loading = ref<boolean>(false);
  const ruleFormRef: any = ref(null);
  async function nextStep() {
    switch (currentTab.value) {
      case 1:
        if (await baseFormRef.value.validate()) {
          message.error('请检查表单填写是否正确');
          return;
        }
        form_data.value = Object.assign({}, form_data.value, baseFormRef.value.form_data);
        break;
      case 2:
        if (await configFormRef.value.validate()) {
          message.error('请检查表单填写是否正确');
          return;
        }
        form_data.value = Object.assign({}, form_data.value, configFormRef.value.form_data);
        break;
      case 3:
        if (await dataFormRef.value.validate()) {
          message.error('请检查表单填写是否正确');
          return;
        }
        form_data.value = Object.assign({}, form_data.value, dataFormRef.value.form_data);
        break;
      case 4:
        if (await ruleFormRef.value.validate()) {
          message.error('请检查表单填写是否正确');
          return;
        }
        form_data.value = Object.assign({}, form_data.value, ruleFormRef.value.form_data);
        break;
    }
    if (currentTab.value < 4) {
      currentTab.value += 1;
    } else if (currentTab.value == 4) {
      loading.value = true;
      try {
        const requestData = form_data.value;

        const { data } = await create(
          {
            name: requestData.name,
            description: requestData.description || '',
            embedId: requestData.embedId,
            searchMode: requestData.searchMode,
            topK: requestData.topK,
            score: requestData.score,
            dataType: requestData.dataType,
            segmentMode: requestData.segmentMode,
            separators: requestData.separators,
            chunkSize: requestData.chunkSize,
            chunkOverlap: requestData.chunkOverlap,
            cleanRules: requestData.cleanRules,
            embedCols: requestData.embedCols,
            replyCols: requestData.replyCols,
          },
          requestData.fileList.map((item) => item.file)
        );
        currentTab.value = 1;
        form_data.value = {};
        router.push({ name: 'dataset_detail', params: { id: data } });
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
    margin: 0px auto;
  }
</style>
