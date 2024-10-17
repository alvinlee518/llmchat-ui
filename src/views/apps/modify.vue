<template>
  <div>
    <n-card :bordered="false">
      <n-page-header
        @back="
          () => {
            $router.go(-1);
          }
        "
      >
        <template #title>
          <n-flex align="center">
            <n-text>{{ form_data.name }}</n-text>
            <n-button
              text
              @click="
                () => {
                  createModalRef.openModal(form_data.id);
                }
              "
            >
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 16 16"
                >
                  <g fill="none">
                    <path
                      d="M14.854 1.854a.5.5 0 1 0-.708-.708l-8 8L6 10l.854-.146l8-8zM4.5 2A2.5 2.5 0 0 0 2 4.5v7A2.5 2.5 0 0 0 4.5 14h7a2.5 2.5 0 0 0 2.5-2.5v-5a.5.5 0 0 0-1 0v5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5v-7A1.5 1.5 0 0 1 4.5 3h5.005a.5.5 0 0 0 0-1H4.5z"
                      fill="currentColor"
                    />
                  </g>
                </svg>
              </n-icon>
            </n-button>
          </n-flex>
        </template>
        <template #extra>
          <n-button type="info" @click="formSubmit">保存并发布</n-button>
        </template>
      </n-page-header>
    </n-card>
  </div>
  <n-card :bordered="false" class="mt-2">
    <n-grid>
      <n-grid-item class="border-r-2 border-gray-100" style="height: calc(100vh - 240px)" span="10">
        <n-scrollbar :size="1">
          <n-form class="mr-5" ref="formRef" :model="form_data" :rules="form_data_rules">
            <n-form-item label="选择模型" path="chatModel" :label-style="labelStyle">
              <n-popover width="trigger" trigger="click" :show-arrow="false" placement="bottom">
                <template #trigger>
                  <n-button class="w-full select-model">
                    <template #icon>
                      <n-icon>
                        <GridOutline />
                      </n-icon>
                    </template>
                    <n-flex justify="space-between" align="center" class="w-full ml-2">
                      <n-text v-if="form_data.chatModel && form_data.chatModel >= 1">{{
                        form_data.chatModelName
                      }}</n-text>
                      <n-text v-else depth="3"> 请选择模型 </n-text>
                      <n-button text size="tiny">
                        <template #icon>
                          <n-icon>
                            <SettingsOutline />
                          </n-icon>
                        </template>
                        设置
                      </n-button>
                    </n-flex>
                  </n-button>
                </template>
                <n-grid :x-gap="6" :y-gap="6" :cols="24" layout-shift-disabled class="p-3">
                  <n-gi :span="4" class="pt-1">
                    <n-h6>
                      <n-text>模型选择</n-text>
                    </n-h6>
                  </n-gi>
                  <n-gi :span="20">
                    <n-form-item :show-label="false" path="chatModel">
                      <n-select
                        v-model:value="form_data.chatModel"
                        :options="chatModelOptions"
                        @update:value="onModelChange"
                        clearable
                      />
                    </n-form-item>
                  </n-gi>
                  <n-gi :span="4">
                    <n-h6 class="pt-1">
                      <n-text>参数配置</n-text>
                    </n-h6>
                  </n-gi>
                  <n-gi :span="20">
                    <n-form-item
                      label-width="120px"
                      label="温度系数"
                      label-placement="left"
                      :show-require-mark="false"
                      path="temperature"
                    >
                      <n-input-number
                        v-model:value="form_data.temperature"
                        :min="0.01"
                        :max="1.99"
                        :precision="2"
                        :step="0.01"
                        class="w-full"
                      />
                    </n-form-item>
                    <n-form-item
                      label-width="120px"
                      label="最大输出长度"
                      label-placement="left"
                      :show-require-mark="false"
                      path="maxTokens"
                    >
                      <n-input-number
                        v-model:value="form_data.maxTokens"
                        :min="1"
                        :max="2048"
                        :step="1"
                        :precision="0"
                        class="w-full"
                      />
                    </n-form-item>
                    <n-form-item
                      label-width="120px"
                      label="携带上下文轮数"
                      label-placement="left"
                      :show-require-mark="false"
                      path="maxMemory"
                    >
                      <n-input-number
                        v-model:value="form_data.maxMemory"
                        :min="1"
                        :max="30"
                        :step="1"
                        :precision="0"
                        class="w-full"
                      />
                    </n-form-item>
                  </n-gi>
                </n-grid>
              </n-popover>
            </n-form-item>
            <n-form-item
              path="prompt"
              class="select-dataset"
              :label-style="labelStyle"
              :show-require-mark="false"
            >
              <template #label>
                <n-flex align="center" justify="space-between" class="w-full pr-1">
                  <n-text> 提示词 </n-text>
                  <n-flex>
                    <n-button
                      text
                      size="tiny"
                      @click="
                        () => {
                          promptModalRef.openModal();
                        }
                      "
                    >
                      <template #icon>
                        <n-icon>
                          <SettingsOutline />
                        </n-icon>
                      </template>
                      AI优化
                    </n-button>
                  </n-flex>
                </n-flex>
              </template>
              <n-input
                v-model:value="form_data.prompt"
                type="textarea"
                maxlength="8192"
                show-count
                :placeholder="PROMPT_PLACEHOLDER"
                :autosize="{
                  minRows: 8,
                  maxRows: 8,
                }"
              />
            </n-form-item>
            <n-form-item path="datasets" class="select-dataset" :label-style="labelStyle">
              <template #label>
                <n-flex align="center" justify="space-between" class="w-full pr-1">
                  <n-text> 知识库 </n-text>
                  <n-flex>
                    <n-button
                      text
                      size="tiny"
                      @click="
                        () => {
                          retrieveModalRef.openModal(form_data);
                        }
                      "
                    >
                      <template #icon>
                        <n-icon>
                          <SettingsOutline />
                        </n-icon>
                      </template>
                      检索设置
                    </n-button>
                    <n-button
                      text
                      size="tiny"
                      @click="
                        () => {
                          datasetModalRef.openModal();
                        }
                      "
                    >
                      <template #icon>
                        <n-icon>
                          <PlusOutlined />
                        </n-icon>
                      </template>
                      配置知识库
                    </n-button>
                  </n-flex>
                </n-flex>
              </template>
              <n-grid y-gap="6" :cols="1">
                <n-gi v-for="(item, idx) in form_data.datasets" :key="idx">
                  <n-alert :show-icon="false">
                    <n-flex
                      align="center"
                      justify="space-between"
                      class="w-full text-xs"
                      :wrap="false"
                    >
                      <n-ellipsis line-clamp="1" :tooltip="false">
                        {{ item.name }}
                      </n-ellipsis>
                      <n-button
                        text
                        @click="
                          () => {
                            form_data.datasets.splice(idx, 1);
                          }
                        "
                      >
                        <n-icon>
                          <DeleteOutlined />
                        </n-icon>
                      </n-button>
                    </n-flex>
                  </n-alert>
                </n-gi>
              </n-grid>
            </n-form-item>
            <n-form-item label="对话开场白" :label-style="labelStyle">
              <n-input
                v-model:value="form_data.prologue"
                type="textarea"
                maxlength="4096"
                show-count
                placeholder="请输入开场白，用于引导对话。"
              />
            </n-form-item>
          </n-form>
        </n-scrollbar>
      </n-grid-item>
      <n-grid-item span="14" class="ml-5">
        <n-h6>调试预览</n-h6>
        <Chat
          style="height: calc(100vh - 285px)"
          :app-id="form_data.id"
          :prompt="form_data.prompt"
          :prologue="form_data.prologue"
          :model="{
            model: form_data.chatModel,
            temperature: form_data.temperature,
            max_tokens: form_data.maxTokens,
            maxMemory: form_data.maxMemory,
          }"
          :dataset="{
            ids: form_data.datasets.map((item) => item.id),
            sourceEnabled: form_data.sourceEnabled,
            rewriteEnabled: form_data.rewriteEnabled,
            rerankModel: form_data.rerankModel,
            topk: form_data.topk,
            score: form_data.score,
          }"
        />
      </n-grid-item>
    </n-grid>
    <CreateModal ref="createModalRef" />
    <RetrievalModal
      ref="retrieveModalRef"
      @close="
        (data) => {
          form_data = Object.assign({}, form_data, data);
        }
      "
    />
    <DatasetModal ref="datasetModalRef" v-model:datasets="form_data.datasets" />
    <PromptModal ref="promptModalRef" v-model:prompt="form_data.prompt" />
  </n-card>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { SelectOption, useMessage } from 'naive-ui';
  import { useRoute } from 'vue-router';
  import { GridOutline, SettingsOutline } from '@vicons/ionicons5';
  import { DeleteOutlined, PlusOutlined } from '@vicons/antd';
  import CreateModal from './component/CreateModal.vue';
  import RetrievalModal from './component/RetrievalModal.vue';
  import DatasetModal from './component/DatasetModal.vue';
  import PromptModal from './component/PromptModal.vue';
  import { Chat } from '@/components/Chat';
  const labelStyle = {
    fontSize: '1rem',
    lineHeight: '1.5rem',
  };
  const createModalRef: any = ref(null);
  const retrieveModalRef: any = ref(null);
  const datasetModalRef: any = ref(null);
  const promptModalRef: any = ref(null);
  const route = useRoute();
  const appId = route.params.id;
  const formRef: any = ref(null);
  const message = useMessage();

  const PROMPT_PLACEHOLDER = `参考信息：
  {context}
  ---
  我的问题或指令：
  {question}
  ---
  请根据上述参考信息回答我的问题或回复我的指令。前面的参考信息可能有用，也可能没用，你需要从我给出的参考信息中选出与我的问题最相关的那些，来为你的回答提供依据。回答一定要忠于原文，简洁但不丢信息，不要胡乱编造。我的问题或指令是什么语种，你就用什么语种回复,
  你的回复：
    `;

  const chatModelOptions = ref<any[]>([]);

  const form_data = ref<{
    id: any;
    name: string;
    description: string;
    prompt: string;
    prologue: string;
    chatModel?: number;
    chatModelName?: string;
    temperature: number;
    maxTokens: number;
    maxMemory: number;
    datasets: any[];
    sourceEnabled: number;
    rewriteEnabled: number;
    rerankModel?: number;
    topk: number;
    score: number;
  }>({
    id: appId,
    name: '',
    description: '',
    prompt: PROMPT_PLACEHOLDER,
    temperature: 0.8,
    maxTokens: 1024,
    maxMemory: 5,
    sourceEnabled: 0,
    rewriteEnabled: 1,
    topk: 3,
    score: 0.5,
    prologue: '',
    datasets: [
      {
        id: 1728366909517,
        name: '知识库名称1',
        description: '这是知识库的描述',
        total: 1,
        updateAt: '2024-10-08 10:57:23',
      },
    ],
  });

  const form_data_rules = ref({
    chatModel: [
      {
        required: true,
        type: 'number',
        message: '请选择模型',
        trigger: ['blur', 'change'],
      },
    ],
    prompt: [
      {
        required: true,
        message: '请输入提示词',
        trigger: ['blur', 'change'],
      },
    ],
    temperature: [
      {
        required: true,
        type: 'number',
        message: '请输入温度系数',
        trigger: ['blur', 'change'],
      },
    ],
    maxTokens: [
      {
        required: true,
        type: 'number',
        message: '请输入模型最大输出长度',
        trigger: ['blur', 'change'],
      },
    ],
    maxMemory: [
      {
        required: true,
        type: 'number',
        message: '请输入携带上下文轮数',
        trigger: ['blur', 'change'],
      },
    ],
  });
  const onModelChange = (value: number, option: SelectOption) => {
    if (option && option.label) {
      form_data.value.chatModelName = `${option.label}`;
    } else {
      form_data.value.chatModelName = '';
    }
  };

  onMounted(() => {
    console.log('app:' + appId);
    if (appId) {
      // TODO: 获取数据
      form_data.value = Object.assign({}, form_data.value, {
        name: '测试',
        description: '测试应用',
      });
    }
    chatModelOptions.value = [
      {
        label: 'qwen2.5:3b',
        value: 1728542045578,
      },
    ];
  });

  const formSubmit = () => {
    formRef.value.validate((errors) => {
      if (!errors) {
        message.success('保存成功');
      } else {
        message.error('请检查表单填写是否正确');
      }
    });
  };
</script>

<style lang="less" scoped>
  .select-model {
    :deep(.n-button__content) {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: nowrap;
      width: 100% !important;
    }
  }
  .select-dataset {
    :deep(.n-form-item-label__text) {
      width: 100% !important;
    }
  }
</style>
