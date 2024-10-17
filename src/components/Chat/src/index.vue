<template>
  <div class="chat-room">
    <n-scrollbar ref="scrollRef" v-if="messageList && messageList.length >= 1">
      <template #default>
        <div id="chat-content">
          <n-list :show-divider="false">
            <n-list-item v-if="props.prologue && props.prologue.trim() != ''">
              <Message
                :role="RoleProps.Assistant"
                :content="props.prologue"
                :create-at="new Date().getTime()"
              />
            </n-list-item>
            <n-list-item v-for="(item, idx) in messageList" :key="idx">
              <Message
                :role="item.role"
                :content="item.content"
                :error="item.error"
                :loading="item.loading"
                :create-at="item.createAt"
                :usage="item.usage"
                :resources="item.resources"
              />
            </n-list-item>
          </n-list>
        </div>
        <div class="h-14"></div>
      </template>
    </n-scrollbar>
    <n-empty class="w-full h-full" v-else description="暂无会话记录" />
    <n-form
      class="chat-send px-12"
      ref="formRef"
      :model="form_data"
      :show-label="false"
      :show-feedback="false"
      :rules="{
        question: [
          {
            required: true,
            message: '请输入您的问题',
            trigger: ['blur', 'change'],
          },
        ],
      }"
    >
      <n-form-item path="question" class="pt-3">
        <n-input
          v-model:value="form_data.question"
          placeholder="请输入您的问题"
          type="textarea"
          size="large"
          clearable
          round
          :autosize="{
            minRows: 1,
            maxRows: 5,
          }"
          @keydown.enter="onPressEnter"
        >
          <template #suffix>
            <n-button text @click="onPressEnter" class="ml-3">
              <n-icon :size="24">
                <SendOutlined />
              </n-icon>
            </n-button>
          </template>
        </n-input>
      </n-form-item>
    </n-form>
  </div>
</template>
<script setup lang="ts">
  import { nextTick, onMounted, ref, watch } from 'vue';
  import { SendOutlined } from '@vicons/antd';
  import Message from './Message.vue';
  import { MessageProps, RoleProps, ChatProps } from './types';
  const messageList = ref<MessageProps[]>([]);
  const scrollRef: any = ref(null);
  const emit = defineEmits(['openChat']);

  const props = defineProps({
    chatId: {
      type: [Number],
      default: 0,
    },
    appId: {
      type: [String, Number],
      default: 0,
    },
    prompt: {
      type: String,
      default: '',
    },
    prologue: {
      type: String,
      default: '',
    },
    model: {
      type: Object,
      default: () => ({
        model: '',
        temperature: 0.8,
        max_tokens: 1024,
        maxMemory: 5,
      }),
    },
    dataset: {
      type: Object,
      default: () => ({
        ids: [],
        sourceEnabled: 0,
        rewriteEnabled: 1,
        rerankModel: '',
        topk: 3,
        score: 0.5,
      }),
    },
  });

  const formRef: any = ref(null);
  const form_data = ref<any>({
    question: '',
    chatId: props.chatId,
    appId: props.appId,
  });

  const onPressEnter = (e) => {
    e.preventDefault();
    formRef.value.validate(async (errors) => {
      if (!errors) {
        await openChat();
        messageList.value.push({
          role: RoleProps.User,
          content: form_data.value.question,
          createAt: Date.now(),
        });
        messageList.value.push({
          role: RoleProps.Assistant,
          content: '',
          loading: true,
          createAt: Date.now(),
        });
        scrollToBottom();
        form_data.value.question = '';
      }
    });
  };
  const scrollToBottom = () => {
    nextTick(() => {
      scrollRef.value &&
        scrollRef.value.scrollTo({
          top: document.querySelector('#chat-content')?.scrollHeight,
        });
    });
  };

  const openChat = () => {
    if (props.chatId && props.chatId >= 1) {
      return;
    }
    // TODO: open new chat from server
    form_data.value.chatId = new Date().getTime();
    emit('openChat', { id: form_data.value.chatId, name: form_data.value.question } as ChatProps);
  };

  const fetchData = () => {
    if (!props.chatId || props.chatId <= 0) {
      messageList.value = [];
      return;
    }
    // TODO: fetch history data from server
    messageList.value = [];
    scrollToBottom();
  };

  watch(
    () => props.chatId,
    async (value, oldValue) => {
      if (value != oldValue) {
        await fetchData();
      }
    },
    {
      immediate: true,
    }
  );
</script>

<style lang="less" scoped>
  .chat-room {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    z-index: 10;
    .chat-send {
      background-color: #fff;
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 0px;
    }
  }
</style>
