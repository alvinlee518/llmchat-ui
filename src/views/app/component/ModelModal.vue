<template>
  <n-popover
    width="trigger"
    trigger="click"
    :show-arrow="false"
    placement="bottom"
    @update:show="onShow"
  >
    <template #trigger>
      <n-button class="w-full select-model">
        <template #icon>
          <n-icon>
            <GridOutline />
          </n-icon>
        </template>
        <n-flex justify="space-between" align="center" class="w-full ml-2">
          <n-text v-if="props.modelId">
            {{ props.modelName }}
          </n-text>
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
      <n-gi :span="5" class="pt-1">
        <n-h6>
          <n-text>模型选择</n-text>
        </n-h6>
      </n-gi>
      <n-gi :span="19">
        <n-select
          :value="props.modelId"
          :options="modelOptions"
          @update:value="onModelChange"
          clearable
        />
      </n-gi>
      <n-gi :span="5">
        <n-h6 class="pt-1">
          <n-text>参数配置</n-text>
        </n-h6>
      </n-gi>
      <n-gi :span="19">
        <n-form-item
          label-width="120px"
          label="温度系数"
          label-placement="left"
          :show-require-mark="false"
          path="temperature"
        >
          <n-input-number
            :value="props.temperature"
            :min="0.01"
            :max="1.99"
            :precision="2"
            :step="0.01"
            class="w-full"
            @update:value="(value:number)=>emit('update:temperature',value)"
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
            :value="props.maxTokens"
            :min="1"
            :max="2048"
            :step="1"
            :precision="0"
            class="w-full"
            @update:value="(value:number)=>emit('update:max-tokens',value)"
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
            :value="props.maxMemory"
            :min="1"
            :max="30"
            :step="1"
            :precision="0"
            class="w-full"
            @update:value="(value:number)=>emit('update:max-memory',value)"
          />
        </n-form-item>
      </n-gi>
    </n-grid>
  </n-popover>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { GridOutline, SettingsOutline } from '@vicons/ionicons5';
  import { SelectOption } from 'naive-ui';
  import { selectGroupOptions } from '@/api/model';
  const emit = defineEmits([
    'update:model-id',
    'update:model-name',
    'update:temperature',
    'update:max-tokens',
    'update:max-memory',
  ]);
  const modelOptions = ref<any[]>([]);
  interface ModelInterface {
    modelId?: string;
    modelName?: string;
    temperature: number;
    maxTokens: number;
    maxMemory: number;
  }

  const props = defineProps<ModelInterface>();

  const onModelChange = (value: string, option: SelectOption) => {
    emit('update:model-id', value);
    if (option && option.label) {
      emit('update:model-name', `${option.label}`);
    } else {
      emit('update:model-name', '');
    }
  };

  const onShow = async (value: boolean) => {
    if (value === true) {
      const { data } = await selectGroupOptions(1);
      modelOptions.value = data;
    }
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
