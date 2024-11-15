<template>
  <n-form
    ref="formRef"
    :model="form_data"
    :rules="form_data_rules"
    label-placement="left"
    label-width="150px"
  >
    <n-form-item label="数据类型" path="dataType">
      <n-radio-group
        @change="
          (value) => {
            form_data.fileList = [];
          }
        "
        style="width: 100%"
        v-model:value="form_data.dataType"
        name="dataType"
      >
        <n-flex align="center" :wrap="false" class="n-card n-card--bordered p-3 mb-2 h-24">
          <div><n-radio :value="0" /></div>
          <div>
            <n-flex align="center">
              <n-icon :size="24">
                <FileWordFilled />
              </n-icon>
              非结构化数据
            </n-flex>
            <div> <n-text depth="3">支持TXT、Markdown、PDF、DOCX、HTML等格式的文件</n-text></div>
          </div>
        </n-flex>
        <n-flex align="center" :wrap="false" class="n-card n-card--bordered p-3 h-24">
          <div><n-radio :value="1" /></div>
          <div>
            <n-flex align="center">
              <n-icon :size="24">
                <FileExcelFilled />
              </n-icon>
              结构化数据
            </n-flex>
            <div> <n-text depth="3">当前支持XLSX / XLS / CSV格式的文档</n-text></div>
          </div>
        </n-flex>
      </n-radio-group>
    </n-form-item>
    <n-form-item label="上传文档" path="fileList">
      <n-upload
        v-if="form_data.dataType === 1"
        multiple
        action="#"
        :max="10"
        :default-upload="false"
        v-model:file-list="form_data.fileList"
        directory-dnd
        accept=".xlsx, .xls, .csv"
        @before-upload="beforeUpload"
      >
        <n-upload-dragger>
          <n-flex justify="center">
            <n-icon size="24" :depth="3">
              <ArchiveOutline />
            </n-icon>
            <n-text> 点击或者拖动文件上传 </n-text>
          </n-flex>
          <n-p depth="3" style="font-size: 12px">
            当前支持 XLSX / XLS / CSV 格式的文档每次最多上传10个文件，每个文件不超过20MB
          </n-p>
        </n-upload-dragger>
        <n-p>
          <n-button @click.stop="exportExcel" text tag="a" type="primary"> 下载Excel模板 </n-button>
        </n-p>
      </n-upload>
      <n-upload
        v-else
        multiple
        action="#"
        :max="10"
        :default-upload="false"
        v-model:file-list="form_data.fileList"
        directory-dnd
        accept=".txt, .md, .doc, .log, .docx, .pdf, .html"
        @before-upload="beforeUpload"
      >
        <n-upload-dragger>
          <n-flex justify="center">
            <n-icon size="24" :depth="3">
              <ArchiveOutline />
            </n-icon>
            <n-text> 点击或者拖动文件上传 </n-text>
          </n-flex>
          <n-p depth="3" style="font-size: 12px">
            支持格式：TXT、Markdown、PDF、DOC、HTML每次最多上传10个文件，每个文件不超过20MB，建议上传前规范文件的分段标识
          </n-p>
        </n-upload-dragger>
      </n-upload>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
  import { ArchiveOutline } from '@vicons/ionicons5';
  import { FileWordFilled, FileExcelFilled } from '@vicons/antd';
  import { ref, watch } from 'vue';
  import { useMessage } from 'naive-ui';
  import { UploadFileInfo } from 'naive-ui';
  import * as XLSX from 'xlsx';
  const formRef: any = ref(null);
  const message = useMessage();

  const form_data = ref<{
    dataType: number;
    fileList: any[];
  }>({
    dataType: 0,
    fileList: [],
  });

  const form_data_rules = ref({
    dataType: [
      {
        required: true,
        type: 'number',
        message: '请选择数据类型',
        trigger: ['blur', 'change'],
      },
    ],
    fileList: [
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

  function readFile(file) {
    return new Promise((resolve) => {
      let reader = new FileReader();
      reader.readAsArrayBuffer(file as File);
      reader.onload = (e) => {
        resolve(new Uint8Array(e.target?.result as ArrayBuffer));
      };
    });
  }

  const beforeUpload = async (data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
    if (form_data.value.dataType === 1) {
      const buffer = await readFile(data.file.file);
      const workbook = XLSX.read(buffer, { type: 'array' });
      // 假设你读取的是第一个工作表
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const headersArray = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
      const headers = headersArray as string[];
      if (
        !(
          headers.length == 2 &&
          headers[0].toLowerCase() === 'prompt' &&
          headers[1].toLowerCase() === 'completion'
        )
      ) {
        message.error('文件和模板结构未对齐', { duration: 5000 });
        return false;
      }
    }
    return true;
  };

  const exportExcel = () => {
    const data = [{ Prompt: '', Completion: '' }];
    // 将数据转换为工作表
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    // 导出 Excel 文件
    XLSX.writeFile(workbook, 'dataset_template.xlsx');
  };

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
