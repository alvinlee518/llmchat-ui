<template>
  <n-modal v-model:show="showModal" class="w-3/5" preset="card" :bordered="false">
    <template #header>
      {{ `${form_data && form_data.id && form_data.id >= 1 ? '编辑' : '添加'}用户` }}
    </template>
    <n-form
      label-width="120px"
      label-placement="left"
      class="mr-16"
      ref="formRef"
      :model="form_data"
      :rules="form_data_rules"
    >
      <n-grid :cols="2">
        <n-gi>
          <n-form-item path="name" label="姓名">
            <n-input v-model:value="form_data.name" maxlength="64" show-count />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item path="gender" label="性别">
            <n-select
              v-model:value="form_data.gender"
              clearable
              :options="[
                {
                  label: '未知',
                  value: 0,
                },
                {
                  label: '男',
                  value: 1,
                },
                {
                  label: '女',
                  value: 2,
                },
              ]"
            />
          </n-form-item>
        </n-gi>
        <n-gi v-if="!(form_data.id && form_data.id >= 1)">
          <n-form-item path="username" label="用户名">
            <n-input v-model:value="form_data.username" maxlength="64" show-count />
          </n-form-item>
        </n-gi>
        <n-gi v-if="!(form_data.id && form_data.id >= 1)">
          <n-form-item path="password" label="密码">
            <n-input
              type="password"
              v-model:value="form_data.password"
              :maxlength="32"
              :minlength="8"
              show-password-on="mousedown"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item path="phone" label="手机号">
            <n-input v-model:value="form_data.phone" maxlength="64" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item path="email" label="邮箱">
            <n-input v-model:value="form_data.email" maxlength="64" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item path="deptId" label="归属部门">
            <n-tree-select
              default-expand-all
              :options="deptList"
              label-field="label"
              key-field="value"
              children-field="children"
              v-model:value="form_data.deptId"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item path="postIds" label="岗位">
            <n-select multiple v-model:value="form_data.postIds" clearable :options="postList" />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item path="roleIds" label="角色">
            <n-select multiple v-model:value="form_data.roleIds" clearable :options="roleList" />
          </n-form-item>
        </n-gi>
        <n-gi :span="2">
          <n-form-item path="remark" label="备注">
            <n-input
              v-model:value="form_data.remark"
              type="textarea"
              maxlength="256"
              :autosize="{ minRows: 3, maxRows: 3 }"
            />
          </n-form-item>
        </n-gi>
      </n-grid>
    </n-form>
    <template #footer>
      <n-flex justify="end">
        <n-button @click="showModal = false"> 取消 </n-button>
        <n-button type="info" @click="formSubmit"> 保存 </n-button>
      </n-flex>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  import { useMessage } from 'naive-ui';
  import { create, modify, detail } from '@/api/system/user';
  import { getDeptTree } from '@/api/system/dept';
  import { selectOptions as getRoleOptions } from '@/api/system/role';
  import { selectOptions as getPostOptions } from '@/api/system/post';
  const message = useMessage();
  const showModal = ref<boolean>(false);
  const deptList = ref<any[]>([]);
  const postList = ref<any[]>([]);
  const roleList = ref<any[]>([]);
  const formRef: any = ref(null);
  const emit = defineEmits(['onClose']);
  const defaultForm = {
    name: '',
    remark: '',
    gender: 0,
    phone: '',
    email: '',
    username: '',
    password: '',
    postIds: [],
    deptId: 0,
    roleIds: [],
  };
  const form_data = ref<{
    id?: number;
    name: string;
    remark: string;
    gender: number;
    phone: string;
    email: string;
    username: string;
    password: string;
    postIds: number[];
    deptId: number;
    roleIds: number[];
  }>({ ...defaultForm });

  const form_data_rules = ref({
    name: [
      {
        required: true,
        message: '请输入用户名称',
        trigger: 'blur',
      },
    ],
    username: [
      {
        required: true,
        message: '请输入用户名',
        trigger: 'blur',
      },
    ],
    password: [
      {
        required: true,
        message: '请输入密码',
        trigger: 'blur',
      },
    ],
  });

  const formSubmit = () => {
    formRef.value.validate(async (errors) => {
      if (!errors) {
        if (form_data.value.id && form_data.value.id >= 1) {
          await modify(form_data.value);
        } else {
          await create(form_data.value);
        }
        message.success('保存成功');
        showModal.value = false;
        emit('onClose');
      } else {
        message.error('请检查表单填写是否正确');
      }
    });
  };

  const fetchDeptList = async () => {
    const { data } = await getDeptTree(0);
    deptList.value = data;
  };

  const fetchPostList = async () => {
    const { data } = await getPostOptions();
    postList.value = data;
  };

  const fetchRoleList = async () => {
    const { data } = await getRoleOptions();
    roleList.value = data;
  };
  const openModal = async (id: any) => {
    showModal.value = true;
    await fetchDeptList();
    await fetchPostList();
    await fetchRoleList();
    if (id && id >= 1) {
      const { data } = await detail(id);
      form_data.value = Object.assign({}, form_data.value, data);
    } else {
      form_data.value = Object.assign({}, { ...defaultForm });
    }
  };

  defineExpose({
    openModal,
  });
</script>
