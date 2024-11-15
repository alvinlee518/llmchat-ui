<template>
  <div>
    <n-card :bordered="false">
      <n-page-header
        @back="
          () => {
            $router.go(-1);
          }
        "
        :title="form_data.name"
      >
        <template #extra>
          <n-button type="info" @click="formSubmit">保存并发布</n-button>
        </template>
      </n-page-header>
    </n-card>
    <n-grid x-gap="5" class="mt-2">
      <n-gi span="10">
        <n-card
          header-class="py-3"
          title="编排"
          :bordered="false"
          :segmented="{
            content: true,
          }"
        >
          <template #header-extra>
            <n-button text size="tiny" @click="() => createModalRef.openModal(form_data.id)">
              <template #icon>
                <n-icon>
                  <EditOutlined />
                </n-icon>
              </template>
              编辑
            </n-button>
          </template>

          <n-scrollbar style="height: calc(100vh - 260px)">
            <n-form ref="formRef" :model="form_data" :rules="form_data_rules" :show-label="false">
              <n-thing>
                <template #header> 模型 </template>
                <n-form-item path="modelId">
                  <ModelModal
                    v-model:model-id="form_data.modelId"
                    v-model:temperature="form_data.temperature"
                    v-model:max-tokens="form_data.maxTokens"
                    v-model:max-memory="form_data.maxMemory"
                    v-model:model-name="form_data.modelName"
                  />
                </n-form-item>
              </n-thing>
              <n-thing>
                <template #header> 提示词 </template>
                <template #header-extra>
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
                        <StarOutline />
                      </n-icon>
                    </template>
                    AI优化
                  </n-button>
                </template>
                <n-form-item path="prompt">
                  <n-input
                    v-model:value="form_data.prompt"
                    type="textarea"
                    maxlength="8192"
                    show-count
                    :autosize="{
                      minRows: 6,
                      maxRows: 12,
                    }"
                    placeholder="请输入提示词"
                  />
                </n-form-item>
              </n-thing>
              <n-thing>
                <template #header> 对话开场白 </template>
                <n-form-item>
                  <n-input
                    v-model:value="form_data.prologue"
                    type="textarea"
                    maxlength="4096"
                    show-count
                    :autosize="{
                      minRows: 3,
                      maxRows: 5,
                    }"
                    placeholder="请输入开场白，用于引导对话。"
                  />
                </n-form-item>
              </n-thing>

              <n-thing>
                <template #header> 上下文 </template>
                <template #header-extra>
                  <n-flex>
                    <n-button
                      :disabled="!(form_data.datasets && form_data.datasets.length >= 1)"
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
                      召回配置
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
                      添加
                    </n-button>
                  </n-flex>
                </template>
                <n-form-item>
                  <n-grid
                    y-gap="6"
                    :cols="1"
                    v-if="form_data.datasets && form_data.datasets.length >= 1"
                  >
                    <n-gi v-for="(item, idx) in form_data.datasets" :key="idx">
                      <n-alert :show-icon="false">
                        <n-flex
                          align="center"
                          justify="space-between"
                          class="w-full text-xs"
                          :wrap="false"
                        >
                          <n-flex align="center">
                            <n-icon>
                              <BookSharp />
                            </n-icon>
                            <n-ellipsis line-clamp="1" :tooltip="false">
                              {{ item.name }}
                            </n-ellipsis>
                          </n-flex>
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
                  <n-text v-else depth="3" class="w-full text-xs">
                    您可以配置知识库作为会话上下文
                  </n-text>
                </n-form-item>
              </n-thing>

              <n-thing>
                <template #header> 功能 </template>
                <n-flex vertical>
                  <n-form-item :show-feedback="false">
                    <n-flex class="w-full" justify="space-between">
                      <n-text class="text-sm font-normal"> 下一步问题建议 </n-text>
                      <n-switch
                        :checked-value="1"
                        :unchecked-value="0"
                        v-model:value="form_data.suggestEnabled"
                      >
                        <template #checked>是</template>
                        <template #unchecked>否</template>
                      </n-switch>
                    </n-flex>
                  </n-form-item>
                </n-flex>
              </n-thing>
            </n-form>
          </n-scrollbar>
        </n-card>
      </n-gi>
      <n-gi span="14">
        <n-card
          header-class="py-3"
          title="调试与预览"
          :bordered="false"
          :segmented="{
            content: true,
          }"
        >
          <DebugChat
            v-if="form_data.modelId"
            style="height: calc(100vh - 260px)"
            class="w-full"
            :app-id="form_data.id"
            :prompt="form_data.prompt"
            :prologue="form_data.prologue"
            :model-id="form_data.modelId"
            :temperature="form_data.temperature"
            :max-tokens="form_data.maxTokens"
            :max-memory="form_data.maxMemory"
            :datasets="form_data.datasets.map((item) => item.id)"
            :source-enabled="form_data.sourceEnabled"
            :rewrite-enabled="form_data.rewriteEnabled"
            :suggest-enabled="form_data.suggestEnabled"
            :rerank-id="form_data.rerankId"
            :top-k="form_data.topK"
            :score="form_data.score"
          />
          <n-empty
            v-else
            description="请完善应用编排配置"
            class="w-full"
            style="height: calc(100vh - 260px)"
          />
        </n-card>
      </n-gi>
    </n-grid>

    <CreateModal ref="createModalRef" />

    <RetrievalModal
      ref="retrieveModalRef"
      v-model:rerank-id="form_data.rerankId"
      v-model:source-enabled="form_data.sourceEnabled"
      v-model:top-k="form_data.topK"
      v-model:score="form_data.score"
      v-model:rewrite-enabled="form_data.rewriteEnabled"
    />
    <DatasetModal
      ref="datasetModalRef"
      v-model:datasets="form_data.datasets"
      :app-id="form_data.id"
    />
    <PromptModal
      ref="promptModalRef"
      :model-id="form_data.modelId"
      v-model:prompt="form_data.prompt"
      v-model:prologue="form_data.prologue"
    />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useMessage } from 'naive-ui';
  import { useRoute } from 'vue-router';
  import { SettingsOutline, BookSharp, StarOutline } from '@vicons/ionicons5';
  import { DeleteOutlined, PlusOutlined, EditOutlined } from '@vicons/antd';
  import CreateModal from './component/CreateModal.vue';
  import RetrievalModal from './component/RetrievalModal.vue';
  import DatasetModal from './component/DatasetModal.vue';
  import PromptModal from './component/PromptModal.vue';
  import ModelModal from './component/ModelModal.vue';
  import { DebugChat } from '@/components/AiChat';
  import { detail, modify } from '@/api/app';
  const createModalRef: any = ref(null);
  const retrieveModalRef: any = ref(null);
  const datasetModalRef: any = ref(null);
  const promptModalRef: any = ref(null);
  const route = useRoute();
  const appId = route.params.id;
  const formRef: any = ref(null);
  const message = useMessage();

  const form_data = ref<{
    id: any;
    name: string;
    description: string;
    prompt: string;
    prologue: string;
    modelId?: string;
    modelName?: string;
    temperature: number;
    maxTokens: number;
    maxMemory: number;
    datasets: any[];
    sourceEnabled: number;
    rewriteEnabled: number;
    suggestEnabled: number;
    rerankId?: string;
    topK: number;
    score: number;
  }>({
    id: appId,
    name: '',
    description: '',
    prompt: '',
    temperature: 0.8,
    maxTokens: 1024,
    maxMemory: 5,
    sourceEnabled: 0,
    suggestEnabled: 0,
    rewriteEnabled: 1,
    topK: 3,
    score: 0.5,
    prologue: '',
    datasets: [],
  });

  const form_data_rules = ref({
    modelId: [
      {
        required: true,
        type: 'string',
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
  });

  onMounted(async () => {
    if (appId) {
      const { data } = await detail(appId);
      if (data.modelId === '0') {
        data.modelId = null;
      }
      if (data.rerankId === '0') {
        data.rerankId = null;
      }
      form_data.value = Object.assign(form_data.value, { ...data });
    }
  });

  const formSubmit = () => {
    formRef.value.validate(async (errors) => {
      if (!errors) {
        if (!errors) {
          await modify(form_data.value);
          message.success('保存成功');
        } else {
          message.error('请检查表单填写是否正确');
        }
      } else {
        message.error('请检查表单填写是否正确');
      }
    });
  };
</script>
