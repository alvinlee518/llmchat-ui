<template>
  <div class="chat-room">
    <n-scrollbar
      ref="scrollRef"
      v-if="
        (messageList && messageList.length >= 1) || (props.prologue && props.prologue.trim() != '')
      "
    >
      <template #default>
        <div id="chat-content">
          <n-list :show-divider="false" class="w-full">
            <n-list-item v-if="props.prologue && props.prologue.trim() != ''">
              <Message
                :role="ChatMessageType.AI"
                :content="props.prologue"
                :create-at="currentTime()"
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
                :citations="item.citations"
                :rating="item.rating"
                :id="item.id"
              />
            </n-list-item>
          </n-list>
        </div>
        <div class="h-14"></div>
      </template>
    </n-scrollbar>
    <n-empty class="w-full h-full" v-else description="暂无会话记录" />
    <n-flex vertical class="chat-send px-12 pt-3">
      <n-flex justify="center">
        <n-button size="small" v-if="loading" @click="() => ctrl.abort()">
          <n-icon :size="24">
            <StopCircleOutline />
          </n-icon>
          停止响应
        </n-button>
        <n-space v-if="suggestedList && suggestedList.length >= 1">
          <n-button
            size="small"
            text
            type="primary"
            :key="idx"
            v-for="(item, idx) in suggestedList"
            @click="selectQuestion(item)"
          >
            {{ item }}
          </n-button>
        </n-space>
      </n-flex>
      <n-form
        ref="formRef"
        :model="form_data"
        :show-label="false"
        :show-feedback="false"
        :rules="{
          instruction: [
            {
              required: true,
              message: '请输入您的指令',
              trigger: ['blur', 'change'],
            },
          ],
        }"
      >
        <n-form-item path="instruction">
          <n-input
            v-model:value="form_data.instruction"
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
                <n-spin v-if="loading" />
                <n-icon :size="24" v-else>
                  <SendOutlined />
                </n-icon>
              </n-button>
            </template>
          </n-input>
        </n-form-item>
      </n-form>
    </n-flex>
  </div>
</template>
<script setup lang="ts">
  import { nextTick, ref } from 'vue';
  import { SendOutlined } from '@vicons/antd';
  import { StopCircleOutline } from '@vicons/ionicons5';
  import dayjs from 'dayjs';
  import Message from './Message.vue';
  import { ChatMessage, ChatMessageType, TestingChatProps } from './types';

  import { debugChat, suggestedQuestions } from '@/api/chat';

  const messageList = ref<ChatMessage[]>([]);
  const scrollRef: any = ref(null);

  const props = withDefaults(defineProps<TestingChatProps>(), {
    temperature: 0.8,
    maxTokens: 1024,
    maxMemory: 5,
    sourceEnabled: 0,
    rewriteEnabled: 1,
    topK: 3,
    score: 0.5,
  });

  const formRef: any = ref(null);
  const form_data = ref<any>({
    instruction: '',
    chatId: props.chatId,
  });
  const loading = ref<boolean>(false);
  const suggestedList = ref<string[]>([]);
  const currentTime = () => dayjs().format('YYYY-MM-DD HH:mm:ss');
  let ctrl = new AbortController();
  const onPressEnter = (e) => {
    e.preventDefault();
    onSend();
  };
  const onSend = () => {
    formRef.value.validate(async (errors) => {
      if (!errors) {
        if (loading.value === true) {
          return;
        }
        loading.value = true;
        suggestedList.value = [];
        messageList.value.push({
          role: ChatMessageType.USER,
          content: form_data.value.instruction,
          createAt: currentTime(),
        } as ChatMessage);

        messageList.value.push({
          role: ChatMessageType.AI,
          content: '',
          loading: true,
          createAt: currentTime(),
        } as ChatMessage);

        nextTick(scrollToBottom);

        ctrl = new AbortController();
        try {
          await debugChat(
            {
              ...props,
              instruction: form_data.value.instruction,
              chatId: form_data.value.chatId,
            },
            async (message: ChatMessage) => {
              form_data.value.chatId = message.chatId;
              form_data.value.instruction = '';

              const lastIndex = messageList.value.length - 1;
              if (!message.usage) {
                const latestMessage = messageList.value[lastIndex];
                messageList.value[lastIndex] = {
                  ...message,
                  content: latestMessage.content + message.content,
                };
              } else {
                messageList.value[lastIndex] = { ...message };
                if (props.suggestEnabled === 1) {
                  const { data } = await suggestedQuestions(form_data.value.chatId);
                  suggestedList.value = [...data];
                }
              }
              nextTick(scrollToBottom);
            },
            ctrl
          );
        } finally {
          loading.value = false;
        }
      }
    });
  };
  const selectQuestion = (question) => {
    form_data.value.instruction = question;
    onSend();
  };
  const scrollToBottom = () => {
    nextTick(() => {
      scrollRef.value &&
        scrollRef.value.scrollTo({
          top: document.querySelector('#chat-content')?.scrollHeight,
        });
    });
  };
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
