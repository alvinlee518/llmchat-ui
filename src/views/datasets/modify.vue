<template>
  <div>
    <n-card :bordered="false">
      <n-page-header
        title="编辑知识库"
        @back="
          () => {
            $router.go(-1);
          }
        "
      />
    </n-card>
    <n-card :bordered="false" class="mt-2">
      <n-space vertical class="steps" justify="center">
        <n-steps style="margin-left: 8em" :current="currentTab">
          <n-step title="知识库信息" />
          <n-step title="知识库设置" />
        </n-steps>
        <n-card :bordered="false" style="max-width: 760px; margin: 0">
          <BaseForm ref="baseFormRef" :data="form_data" v-if="currentTab === 1" />
          <ConfigForm ref="configFormRef" :data="form_data" v-if="currentTab === 2" />
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
          <template #description> {{ currentTab === 2 ? '保 存' : '下一步' }} </template>
        </n-float-button>
      </n-float-button-group>
    </n-card>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useMessage } from 'naive-ui';
  import { useRouter } from 'vue-router';

  import BaseForm from './component/BaseForm.vue';
  import ConfigForm from './component/ConfigForm.vue';

  const router = useRouter();
  const datasetId = router.currentRoute.value.params.id;
  const message = useMessage();
  const form_data = ref<any>({
    id: datasetId,
  });
  const currentTab = ref(1);
  const baseFormRef: any = ref(null);
  const configFormRef: any = ref(null);
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
    }
    if (currentTab.value < 2) {
      currentTab.value += 1;
    } else if (currentTab.value == 2) {
      // TODO: 提交数据
      currentTab.value = 1;
      form_data.value = {};
    }
  }

  function prevStep() {
    if (currentTab.value > 1) {
      currentTab.value -= 1;
    }
  }

  onMounted(() => {
    console.log('modify datasets:' + datasetId);
    if (datasetId) {
      // TODO: 获取数据
    }
  });
</script>

<style lang="less" scoped>
  .steps {
    max-width: 900px;
    margin: 0px auto;
  }
</style>
