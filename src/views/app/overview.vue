<template>
  <div>
    <n-card :bordered="false">
      <n-page-header
        title="监测"
        @back="
          () => {
            $router.go(-1);
          }
        "
      />
    </n-card>
    <n-card :bordered="false" class="mt-2">
      <n-card title="应用信息">
        <n-grid :cols="2" :x-gap="12">
          <n-grid-item>
            <n-text>访问链接</n-text>
          </n-grid-item>
          <n-grid-item>
            <n-text>访问凭据</n-text>
          </n-grid-item>
        </n-grid>
      </n-card>
      <n-card title="监控统计">
        <n-grid :cols="4" :x-gap="12">
          <n-grid-item>
            <n-text>用户数</n-text>
          </n-grid-item>
          <n-grid-item>
            <n-text>提问次数</n-text>
          </n-grid-item>
          <n-grid-item>
            <n-text>Tokens总数</n-text>
          </n-grid-item>
          <n-grid-item>
            <n-text>用户满意度</n-text>
          </n-grid-item>
        </n-grid>
      </n-card>
    </n-card>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useMessage } from 'naive-ui';
</script>
