<template>
  <n-form
    label-width="120px"
    label-placement="left"
    class="mr-16"
    ref="formRef"
    :model="form_data"
    :rules="form_data_rules"
  >
    <n-form-item path="oldPwd" label="原始密码">
      <n-input
        v-model:value="form_data.oldPwd"
        maxlength="64"
        type="password"
        showPasswordOn="click"
      />
    </n-form-item>
    <n-form-item path="newPwd" label="密码">
      <n-input
        v-model:value="form_data.newPwd"
        maxlength="64"
        type="password"
        showPasswordOn="click"
      />
    </n-form-item>
    <n-form-item path="confirmPwd" label="确认密码">
      <n-input
        v-model:value="form_data.confirmPwd"
        maxlength="64"
        type="password"
        showPasswordOn="click"
      />
    </n-form-item>
    <n-form-item class="pl-32">
      <n-button type="primary" @click="formSubmit"> 确认修改 </n-button>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
  import { useMessage } from 'naive-ui';
  import { ref } from 'vue';
  import { changePassword } from '@/api/system/account';

  const message = useMessage();
  const props = defineProps({
    id: {
      type: String,
      default: () => {
        return '';
      },
    },
  });

  const formRef: any = ref(null);
  const form_data = ref<{
    oldPwd: string;
    newPwd: string;
    confirmPwd: string;
  }>({
    oldPwd: '',
    newPwd: '',
    confirmPwd: '',
  });

  const form_data_rules = ref({
    oldPwd: [
      {
        required: true,
        message: '请输入旧密码',
        trigger: ['input', 'blur'],
      },
    ],
    newPwd: [
      {
        required: true,
        message: '请输入密码',
        trigger: ['input', 'blur'],
      },
    ],
    confirmPwd: [
      {
        required: true,
        message: '请再次输入密码',
        trigger: ['input', 'blur'],
      },
      {
        validator: (rule: any, value: string): boolean => {
          return (
            !!form_data.value.newPwd &&
            form_data.value.newPwd.startsWith(value) &&
            form_data.value.newPwd.length >= value.length
          );
        },
        message: '两次密码输入不一致',
        trigger: 'input',
      },
      {
        validator: (rule: any, value: string): boolean => {
          return value === form_data.value.newPwd;
        },
        message: '两次密码输入不一致',
        trigger: ['blur', 'password-input'],
      },
    ],
  });

  const formSubmit = () => {
    formRef.value.validate(async (errors) => {
      if (!errors) {
        await changePassword({
          password: form_data.value.oldPwd,
          newPassword: form_data.value.newPwd,
        });
        message.success('保存成功');
      } else {
        message.error('请检查表单填写是否正确');
      }
    });
  };
</script>
