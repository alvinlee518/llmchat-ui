<template>
  <n-grid :x-gap="12">
    <n-grid-item span="6">
      <n-card title="个人信息">
        <div class="text-center">
          <n-avatar
            round
            :size="128"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
          />
        </div>
        <n-grid :cols="1" class="mt-3">
          <n-grid-item class="list-group-item">
            <n-space justify="space-between">
              <n-text>姓名</n-text>
              <n-text>{{ userinfo.name }}</n-text>
            </n-space>
          </n-grid-item>
          <n-grid-item class="list-group-item">
            <n-space justify="space-between">
              <n-text>用户名</n-text>
              <n-text>{{ userinfo.username }}</n-text>
            </n-space>
          </n-grid-item>
          <n-grid-item class="list-group-item">
            <n-space justify="space-between">
              <n-text>手机号</n-text>
              <n-text>{{ userinfo.phone }}</n-text>
            </n-space>
          </n-grid-item>
          <n-grid-item class="list-group-item">
            <n-space justify="space-between">
              <n-text>邮箱</n-text>
              <n-text>{{ userinfo.email }}</n-text>
            </n-space>
          </n-grid-item>
          <n-grid-item class="list-group-item">
            <n-space justify="space-between">
              <n-text>部门</n-text>
              <n-text>{{ userinfo.deptName }}</n-text>
            </n-space>
          </n-grid-item>
          <n-grid-item class="list-group-item">
            <n-space justify="space-between">
              <n-text>创建日期</n-text>
              <n-text>{{ userinfo.createAt }}</n-text>
            </n-space>
          </n-grid-item>
        </n-grid>
      </n-card>
    </n-grid-item>
    <n-grid-item span="18">
      <n-card title="基本资料">
        <n-tabs type="line" animated>
          <n-tab-pane name="基本资料" class="mt-3">
            <BasicCard
              @refresh="
                (data) => {
                  userinfo = { ...userinfo, ...data };
                }
              "
            />
          </n-tab-pane>
          <n-tab-pane name="修改密码" class="mt-3"><PasswordCard /> </n-tab-pane>
        </n-tabs>
      </n-card>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
  import { useUserStore } from '@/store/modules/user';
  import BasicCard from './component/BasicCard.vue';
  import PasswordCard from './component/PasswordCard.vue';
  import { onMounted, ref } from 'vue';

  const userStore = useUserStore();
  const userinfo = ref<any>({});
  onMounted(async () => {
    const { user } = await userStore.getInfo();
    userinfo.value = user;
  });
</script>

<style lang="less" scoped>
  .list-group-item {
    border-bottom: 1px solid #e7eaec;
    border-top: 1px solid #e7eaec;
    margin-bottom: -1px;
    padding: 11px 0;
    font-size: 13px;
  }
</style>
