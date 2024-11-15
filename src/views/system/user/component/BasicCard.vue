<template>
  <n-form
    label-width="120px"
    label-placement="left"
    class="mr-16"
    ref="formRef"
    :model="form_data"
    :rules="form_data_rules"
  >
    <n-form-item path="name" label="姓名">
      <n-input v-model:value="form_data.name" maxlength="64" show-count />
    </n-form-item>
    <n-form-item path="phone" label="手机号">
      <n-input v-model:value="form_data.phone" maxlength="64" />
    </n-form-item>
    <n-form-item path="email" label="邮箱">
      <n-input v-model:value="form_data.email" maxlength="64" />
    </n-form-item>
    <n-form-item path="birthday" label="生日">
      <n-date-picker
        type="date"
        clearable
        v-model:formatted-value="form_data.birthday"
        value-format="yyyy-MM-dd"
      />
    </n-form-item>
    <n-form-item path="gender" label="性别">
      <n-radio-group v-model:value="form_data.gender" name="gender" :default-value="0">
        <n-space>
          <n-radio :value="1"> 男 </n-radio>
          <n-radio :value="2"> 女 </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
    <n-form-item class="pl-32">
      <n-button type="primary" @click="formSubmit"> 确认修改 </n-button>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { changeInfo } from '@/api/system/account';
  import { useMessage } from 'naive-ui';
  import { useUserStore } from '@/store/modules/user';

  const message = useMessage();
  const emit = defineEmits(['refresh']);

  const formRef: any = ref(null);
  const form_data = ref<{
    id: string;
    name: string;
    gender: number;
    phone: string;
    email: string;
    birthday: string;
  }>({
    id: '',
    name: '',
    gender: 0,
    phone: '',
    email: '',
    birthday: '1970-01-01',
  });

  const form_data_rules = ref({
    name: [
      {
        required: true,
        message: '请输入用户名称',
        trigger: 'blur',
      },
    ],
    email: [
      {
        required: true,
        message: '请输入邮箱',
        trigger: 'blur',
      },
    ],
    phone: [
      {
        required: true,
        message: '请输入手机号',
        trigger: 'blur',
      },
    ],
  });

  const formSubmit = () => {
    formRef.value.validate(async (errors) => {
      if (!errors) {
        await changeInfo(form_data.value);
        message.success('保存成功');
        emit('refresh', form_data.value);
      } else {
        message.error('请检查表单填写是否正确');
      }
    });
  };
  onMounted(async () => {
    const userStore = useUserStore();
    const { user } = await userStore.getInfo();
    form_data.value = { ...user, birthday: user.birthday || '1970-01-01' };
  });
</script>
