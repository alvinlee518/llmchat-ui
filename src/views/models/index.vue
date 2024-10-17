<template>
  <div>
    <n-grid :x-gap="5">
      <n-grid-item span="6">
        <n-card :bordered="false" size="small" class="proCard" title="供应商">
          <n-list hoverable clickable :show-divider="false">
            <n-list-item
              :class="{ 'list-item-cell-on': !form_data.modelProvider }"
              @click="() => (form_data.modelProvider = undefined)"
            >
              <template #prefix>
                <n-icon :size="24">
                  <GridSharp />
                </n-icon>
              </template>
              全部模型
            </n-list-item>
            <n-list-item
              v-for="(item, index) in providerOptions"
              :key="index"
              :class="{ 'list-item-cell-on': form_data.modelProvider === item.value }"
              @click="() => (form_data.modelProvider = item.value)"
            >
              <template #prefix>
                <n-icon :size="24" :innerHTML="item.icon" />
              </template>
              {{ item.label }}
            </n-list-item>
          </n-list>
        </n-card>
      </n-grid-item>
      <n-grid-item span="18">
        <n-card :bordered="false" size="small" class="proCard" :title="providerName">
          <n-flex justify="space-between">
            <n-button type="info" @click="() => (showModal = true)"> 添加模型 </n-button>
            <n-input-group style="max-width: 280px">
              <n-input
                type="text"
                placeholder="按名称搜索"
                clearable
                v-model:value="keyword"
                @keyup.enter="onSearch"
              >
                <template #prefix>
                  <n-icon :component="SearchSharp" />
                </template>
              </n-input>
              <n-button @click="onSearch"> 搜索 </n-button>
            </n-input-group>
          </n-flex>
          <n-grid x-gap="12" y-gap="12" :cols="2" class="mt-5">
            <n-gi v-for="(item, idx) in modelList" :key="idx">
              <n-card bordered>
                <template #header>
                  <n-space>
                    <n-icon :size="24" :innerHTML="getProviderIcon(item.modelProvider)" />
                    {{ getProviderName(item.modelProvider) }}
                  </n-space>
                </template>
                <template #header-extra>
                  <n-button text @click="onModify(item)">
                    <n-icon class="ml-3" :size="14">
                      <EditOutlined />
                    </n-icon>
                  </n-button>
                  <n-popconfirm @positive-click="onRemove(item)">
                    <template #trigger>
                      <n-button text>
                        <n-icon class="ml-3" :size="14">
                          <DeleteOutlined />
                        </n-icon>
                      </n-button>
                    </template>
                    确认删除此模型？
                  </n-popconfirm>
                </template>
                <ul>
                  <li>
                    <n-text depth="3">模型类型</n-text>
                    <span class="ellipsis ml-16">{{ getTypeName(item.modelType) }}</span>
                  </li>
                  <li>
                    <n-text depth="3">模型名称</n-text>
                    <span class="ellipsis ml-16">{{ item.name }}</span>
                  </li>
                </ul>
              </n-card>
            </n-gi>
          </n-grid>
        </n-card>
      </n-grid-item>
    </n-grid>
    <n-modal
      v-model:show="showModal"
      :show-icon="false"
      preset="dialog"
      :title="form_data.id && form_data.id >= 1 ? '编辑模型' : '添加模型'"
      :style="{ width: '600px' }"
    >
      <n-form ref="formRef" :model="form_data" :rules="form_data_rules">
        <n-form-item label="模型供应商" path="modelProvider">
          <n-select
            :disabled="form_data.id && form_data.id >= 1"
            v-model:value="form_data.modelProvider"
            :options="providerOptions"
            placeholder="请选择模型供应商"
          />
        </n-form-item>
        <n-form-item label="模型类型" path="modelType">
          <n-select
            v-model:value="form_data.modelType"
            :options="typeOptions"
            placeholder="请选择模型类型"
          />
        </n-form-item>
        <n-form-item label="模型名称" path="name">
          <n-input
            v-model:value="form_data.name"
            maxlength="50"
            show-count
            placeholder="请输入模型名称"
          />
        </n-form-item>
        <n-form-item label="API 域名" path="baseUrl">
          <n-input v-model:value="form_data.baseUrl" placeholder="请输入API域名" />
        </n-form-item>
        <n-form-item label="API Key" path="apiKey">
          <n-input v-model:value="form_data.apiKey" placeholder="请输入API Key" />
        </n-form-item>
      </n-form>
      <template #action>
        <n-space>
          <n-button @click="() => (showModal = false)">取消</n-button>
          <n-button type="info" @click="onSubmit">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { GridSharp, SearchSharp } from '@vicons/ionicons5';
  import { EditOutlined, DeleteOutlined } from '@vicons/antd';
  import {
    providerOptions,
    typeOptions,
    getProviderName,
    getProviderIcon,
    getTypeName,
  } from './props';
  import { useMessage } from 'naive-ui';

  const formRef: any = ref(null);
  const message = useMessage();
  const modelList = ref<any[]>([]);
  const form_data = ref<{
    id?: number;
    name: string;
    modelProvider?: number;
    modelType?: number;
    baseUrl: string;
    apiKey: string;
  }>({
    name: '',
    baseUrl: '',
    apiKey: '',
  });

  const form_data_rules = {
    name: [{ required: true, message: '请输入模型名称', trigger: 'blur' }],
    baseUrl: [{ required: true, message: '请输入API域名', trigger: 'blur' }],
    apiKey: [{ required: true, message: '请输入API Key', trigger: 'blur' }],
    modelProvider: [
      { required: true, type: 'number', message: '请选择模型供应商', trigger: ['blur', 'change'] },
    ],
    modelType: [
      { required: true, type: 'number', message: '请选择模型类型', trigger: ['blur', 'change'] },
    ],
  };

  const providerName = computed(() => {
    return (
      providerOptions.find((item) => item.value === form_data.value.modelProvider)?.label ||
      '全部模型'
    );
  });

  const showModal = ref<boolean>(false);

  const onModify = (item) => {
    form_data.value = Object.assign(form_data.value, item);
    showModal.value = true;
  };

  const onRemove = (item) => {
    console.log('shanchu', item);
  };

  const onSubmit = () => {
    formRef.value?.validate((errors) => {
      if (!errors) {
        message.success('Valid');
      }
    });
  };
  const keyword = ref<string>('');
  const onSearch = () => {
    console.log(keyword.value);
  };

  onMounted(() => {
    modelList.value = [{ id: 1728642180706, name: 'qwen2.5:3b', modelProvider: 1, modelType: 1 }];
  });
</script>

<style lang="less" scoped>
  .list-item-cell-on {
    background: #f0faff;
    color: #2d8cf0;

    ::v-deep(.n-thing-main .n-thing-header .n-thing-header__title) {
      color: #2d8cf0;
    }

    &:hover {
      background: #f0faff;
    }
  }
</style>
