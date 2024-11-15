<template>
  <n-form
    ref="formRef"
    :model="form_data"
    :rules="form_data_rules"
    label-placement="left"
    label-width="150px"
  >
    <div v-if="form_data.dataType === 1">
      <n-form-item label="索引配置" path="embedData">
        <n-data-table :columns="embed_columns" :data="form_data.embedData" :bordered="false" />
      </n-form-item>
    </div>
    <div v-else>
      <n-form-item label="分段规则" path="segmentMode">
        <n-radio-group style="width: 100%" v-model:value="form_data.segmentMode" name="segmentMode">
          <n-flex align="center" :wrap="false" class="n-card n-card--bordered p-3 mb-2 h-24">
            <div><n-radio :value="0" /></div>
            <div>
              <n-flex align="center">
                <n-icon :size="24"> <FlashSharp /> </n-icon> 智能切分
              </n-flex>
              <div>
                <n-text depth="3">
                  在通用文档上的最优chunk切分方法，经过评测可在多数文档上获得最佳的检索效果
                </n-text>
              </div>
            </div>
          </n-flex>
          <n-flex align="center" :wrap="false" class="n-card n-card--bordered p-3 h-24">
            <div><n-radio :value="1" /></div>
            <div>
              <n-flex align="center">
                <n-icon :size="24"> <SettingsSharp /> </n-icon> 自定义切分
              </n-flex>
              <div>
                <n-text depth="3">
                  完全开放的chunk切分配置，按照实际文档情况自由配置，通过调试获得更好的检索效果
                </n-text>
              </div>
            </div>
          </n-flex>
        </n-radio-group>
      </n-form-item>
      <n-form-item v-if="form_data.segmentMode === 1" label="分段标识符" path="separators">
        <n-select
          v-model:value="form_data.separators"
          :options="splitor_options"
          :multiple="true"
        />
      </n-form-item>
      <n-form-item v-if="form_data.segmentMode === 1" label="分段预估长度" path="chunkSize">
        <n-input-number v-model:value="form_data.chunkSize" :min="1" :max="2048" />
      </n-form-item>
      <n-form-item v-if="form_data.segmentMode === 1" label="分段重叠长度" path="chunkOverlap">
        <n-input-number v-model:value="form_data.chunkOverlap" :min="0" :max="512" />
      </n-form-item>
      <n-form-item label="数据清洗" path="cleanRules">
        <n-checkbox-group v-model:value="form_data.cleanRules">
          <n-space vertical>
            <n-checkbox :value="1" label="删除多余符号空格、空行、制表符" />
            <n-checkbox :value="2" label="删除所有 URL 和电子邮件地址" />
          </n-space>
        </n-checkbox-group>
      </n-form-item>
    </div>
  </n-form>
</template>

<script setup lang="ts">
  import { ref, watch, h } from 'vue';
  import { NSwitch } from 'naive-ui';
  import { SettingsSharp, FlashSharp } from '@vicons/ionicons5';
  const formRef: any = ref(null);
  const splitor_options = [
    {
      label: '#',
      value: '(?<=^)# .*|(?<=\\n)# .*',
    },
    {
      label: '##',
      value: '(?<=\\n)(?<!#)## (?!#).*|(?<=^)(?<!#)## (?!#).*',
    },
    {
      label: '###',
      value: '(?<=\\n)(?<!#)### (?!#).*|(?<=^)(?<!#)### (?!#).*',
    },
    {
      label: '####',
      value: '(?<=\\n)(?<!#)#### (?!#).*|(?<=^)(?<!#)#### (?!#).*',
    },
    {
      label: '#####',
      value: '(?<=\\n)(?<!#)##### (?!#).*|(?<=^)(?<!#)##### (?!#).*',
    },
    {
      label: '######',
      value: '(?<=\\n)(?<!#)###### (?!#).*|(?<=^)(?<!#)###### (?!#).*',
    },
    {
      label: '-',
      value: '(?<! )- .*',
    },
    {
      label: '空格',
      value: '(?<! ) (?! )',
    },
    {
      label: '分号',
      value: '(?<!；)；(?!；)',
    },
    {
      label: '逗号',
      value: '(?<!，)，(?!，)',
    },
    {
      label: '句号',
      value: '(?<!。)。(?!。)',
    },
    {
      label: '回车',
      value: '(?<!\\n)\\n(?!\\n)',
    },
    {
      label: '空行',
      value: '(?<!\\n)\\n\\n(?!\\n)',
    },
  ];
  const form_data = ref<{
    segmentMode: number;
    separators: any[];
    chunkSize: number;
    chunkOverlap: number;
    cleanRules: any[];
    dataType: number;
    embedData: any[];
    embedCols: number;
    replyCols: number;
  }>({
    segmentMode: 0,
    separators: ['(?<!\\n)\\n(?!\\n)', '(?<!\\n)\\n\\n(?!\\n)'],
    chunkSize: 256,
    chunkOverlap: 64,
    cleanRules: [1],
    dataType: 0,
    embedCols: 3,
    replyCols: 3,
    embedData: [
      {
        columnName: 'Prompt',
        embedEnabled: 1,
        replyEnabled: 1,
        value: 1,
      },
      {
        columnName: 'Completion',
        embedEnabled: 1,
        replyEnabled: 1,
        value: 2,
      },
    ],
  });

  const form_data_rules = ref({
    segmentMode: [
      {
        required: true,
        type: 'number',
        message: '请选择分段规则',
        trigger: ['blur', 'change'],
      },
    ],
    file_list: [
      {
        required: true,
        type: 'array',
        message: '请上传数据文档',
        trigger: ['blur', 'change'],
      },
    ],
  });

  const props = defineProps({
    data: {
      type: Object,
      default: () => {},
    },
  });

  watch(
    () => props.data,
    (value) => {
      if (value && JSON.stringify(value) !== '{}') {
        form_data.value = Object.assign(form_data.value, { ...value });
      }
    },
    {
      immediate: true,
    }
  );

  const embed_columns = [
    {
      title: '字段名称',
      key: 'columnName',
    },
    {
      title: '是否参与检索',
      key: 'embedEnabled',
      render(row, index) {
        return h(NSwitch, {
          defaultValue: row.embedEnabled,
          checkedValue: 1,
          uncheckedValue: 0,
          onUpdateValue(v) {
            form_data.value.embedData[index].embedEnabled = v;
            form_data.value.embedCols = form_data.value.embedData
              .map((item) => {
                if (item.embedEnabled === 1) {
                  return item.value;
                } else {
                  return 0;
                }
              })
              .reduce((acc, val) => acc + val, 0);
          },
        });
      },
    },
    {
      title: '是否参与模型回复',
      key: 'replyEnabled',
      render(row, index) {
        return h(NSwitch, {
          defaultValue: row.replyEnabled,
          checkedValue: 1,
          uncheckedValue: 0,
          onUpdateValue(v) {
            form_data.value.embedData[index].replyEnabled = v;
            form_data.value.replyCols = form_data.value.embedData
              .map((item) => {
                if (item.replyEnabled === 1) {
                  return item.value;
                } else {
                  return 0;
                }
              })
              .reduce((acc, val) => acc + val, 0);
          },
        });
      },
    },
  ];

  /**
   * 校验表单
   */
  const validate = () => {
    if (!formRef.value) {
      return;
    }
    return formRef.value
      .validate()
      .catch((errors) => !errors)
      .then((errors) => !errors);
  };

  defineExpose({
    validate,
    form_data,
  });
</script>
