<template>
  <div>
    <n-space
      class="pl-11 mb-3 max-w-full"
      :wrap="false"
      align="start"
      justify="end"
      v-if="props.role === ChatMessageType.USER"
    >
      <n-alert :bordered="false" :show-icon="false" type="success">
        {{ props.content }}
      </n-alert>
      <n-avatar
        round
        v-if="isString(avatar) && avatar.length > 0"
        :src="avatar"
        :render-fallback="
          () =>
            h(
              NIcon,
              {},
              {
                children: () => h(UserOutlined),
              }
            )
        "
      />
      <n-avatar v-else round>
        <n-icon>
          <UserOutlined />
        </n-icon>
      </n-avatar>
    </n-space>
    <n-space
      class="pr-11 max-w-full"
      :wrap="false"
      align="start"
      v-else-if="props.role === ChatMessageType.AI"
    >
      <n-avatar round>
        <n-icon>
          <RobotOutlined />
        </n-icon>
      </n-avatar>
      <div class="max-w-full">
        <n-skeleton class="min-w-96" v-if="props.loading" :sharp="false" size="medium" />
        <div
          v-else
          @mouseenter="
            () => {
              hovering = true;
            }
          "
          @mouseleave="
            () => {
              hovering = false;
              copied = false;
            }
          "
          class="max-w-full"
        >
          <div class="max-w-full">
            <MdPreview
              editorId="preview-only"
              :modelValue="props.content"
              :class="[
                'min-w-[28rem]',
                'max-w-full',
                'm-0',
                'px-2.5',
                props.error ? 'bg-red-100' : 'bg-slate-100',
              ]"
            />
            <n-collapse
              arrow-placement="right"
              v-if="props.citations && props.citations.length > 0"
              class="mt-3 pl-2.5 pb-2.5 w-80"
            >
              <n-collapse-item>
                <template #header>
                  <n-text depth="3">
                    来源：获取到{{ props.citations.length }}篇资料作为参考
                  </n-text>
                </template>
                <n-ol align-text v-for="(item, idx) in props.citations" :key="idx">
                  <n-li class="text-xs">
                    <n-a underline :href="item.url" target="_blank">
                      <n-ellipsis :line-clamp="1" :tooltip="false">
                        {{ item.name }}
                      </n-ellipsis>
                    </n-a>
                  </n-li>
                </n-ol>
              </n-collapse-item>
            </n-collapse>
          </div>
          <n-space class="px-1 h-3" justify="space-between" v-if="props.usage && hovering">
            <n-text depth="3" class="text-xs">
              时间: {{ props.createAt }}
              <n-divider vertical />
              耗时: {{ props.usage.duration || 0 }} 秒
              <n-divider vertical />
              花费: {{ props.usage.totalTokens || 0 }} Token
            </n-text>
            <n-space justify="space-between">
              <n-button text @click="copyToClip(props.content).then(() => (copied = true))">
                <n-icon>
                  <CheckOutlined v-if="copied == true" />
                  <CopyOutlined v-else />
                </n-icon>
              </n-button>
              <n-button v-if="rating !== 2" text @click="onLiked">
                <n-icon :color="rating === 1 ? '#18a058' : ''">
                  <LikeOutlined />
                </n-icon>
              </n-button>
              <n-button v-if="rating !== 1" text @click="onDisliked">
                <n-icon :color="rating === 2 ? '#d03050' : ''">
                  <DislikeOutlined />
                </n-icon>
              </n-button>
            </n-space>
          </n-space>
          <div v-else class="text-xs h-3"></div>
        </div>
      </div>
    </n-space>
  </div>
</template>
<script setup lang="ts">
  import { computed, h, ref } from 'vue';
  import {
    RobotOutlined,
    UserOutlined,
    CheckOutlined,
    CopyOutlined,
    LikeOutlined,
    DislikeOutlined,
  } from '@vicons/antd';
  import { ChatMessage, ChatMessageType } from './types';
  import { useUserStore } from '@/store/modules/user';
  import { isString } from '@/utils/is';
  import { NIcon } from 'naive-ui';
  import { copyToClip } from '@/utils/copy';
  import { MdPreview } from '@/components/Markdown/index';
  import { chatRating } from '@/api/chat';
  const userStore = useUserStore();
  const avatar = computed(() => userStore.avatar);
  const props = defineProps<ChatMessage>();
  const hovering = ref<boolean>(false);
  const copied = ref<boolean>(false);
  const rating = ref<number>(props.rating || 0);
  const onLiked = async () => {
    if (rating.value === 1) {
      return;
    }
    await chatRating({
      id: props.id,
      action: 1,
    });
    rating.value = 1;
  };

  const onDisliked = async () => {
    if (rating.value === 2) {
      return;
    }
    await chatRating({
      id: props.id,
      action: 2,
    });
    rating.value = 2;
  };
</script>

<style lang="less" scoped>
  :deep(.n-collapse-item) {
    --n-font-size: 14px;
    --n-bezier: cubic-bezier(0.4, 0, 0.2, 1);
    --n-text-color: rgb(51, 54, 57);
    --n-divider-color: rgb(239, 239, 245);
    --n-title-padding: 16px 0 0 0;
    --n-title-font-size: 14px;
    --n-title-text-color: rgba(194, 194, 194, 1);
    --n-title-text-color-disabled: rgba(194, 194, 194, 1);
    --n-title-font-weight: 400;
    --n-arrow-color: rgba(194, 194, 194, 1);
    --n-arrow-color-disabled: rgba(194, 194, 194, 1);
    --n-item-margin: 16px 0 0 0;
  }
  :deep(
      .n-collapse .n-collapse-item .n-collapse-item__content-wrapper .n-collapse-item__content-inner
    ) {
    padding-top: 5px;
  }
  :deep(.n-alert .n-alert-body) {
    padding: 10px;
  }

  .message_content {
    background-color: var(--n-color-embedded);
  }
</style>
