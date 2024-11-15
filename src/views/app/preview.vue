<template>
  <div>
    <n-grid x-gap="5">
      <n-gi span="6">
        <n-card :bordered="false" class="h-full">
          <template #header>
            <n-flex align="center">
              <n-avatar>{{ appInfo.name }}</n-avatar>
              <n-text>{{ appInfo.name }}</n-text>
            </n-flex>
          </template>
          <n-button class="w-full mb-5" @click="onCreate">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            新建对话
          </n-button>
          <n-text class="text-base" strong>历史记录</n-text>
          <div class="my-5">
            <n-virtual-list
              class="w-full"
              v-if="appInfo.chatList && appInfo.chatList.length >= 1"
              :item-size="40"
              :items="appInfo.chatList"
            >
              <template #default="{ item }">
                <n-flex
                  :wrap="false"
                  class="h-10 hover:bg-gray-100 pt-1 px-3 mr-5 mb-1 rounded-lg chat-item"
                  :class="selectedChat.chatId == item.chatId ? 'bg-slate-100' : ''"
                  justify="space-between"
                  align="center"
                  :size="4"
                >
                  <div
                    class="w-full"
                    @click="
                      () => {
                        selectedChat = Object.assign({}, item);
                      }
                    "
                  >
                    <n-ellipsis :line-clamp="1" :tooltip="false">
                      <n-text depth="2"> {{ item.title }} </n-text>
                    </n-ellipsis>
                  </div>
                  <div class="w-4">
                    <n-popconfirm @positive-click="onRemove(item.chatId)">
                      <template #trigger>
                        <n-button
                          :class="
                            appInfo.chatList && appInfo.chatList.length > 1
                              ? 'chat-item-action'
                              : 'hidden'
                          "
                          text
                          size="tiny"
                        >
                          <template #icon>
                            <n-icon>
                              <DeleteOutlined />
                            </n-icon>
                          </template>
                        </n-button>
                      </template>
                      确认删除此回话？
                    </n-popconfirm>
                  </div>
                </n-flex>
              </template>
            </n-virtual-list>
            <n-empty description="暂无历史记录" />
          </div>
        </n-card>
      </n-gi>
      <n-gi span="18">
        <n-card
          header-class="py-3"
          :title="selectedChat.title"
          :bordered="false"
          :segmented="{
            content: true,
          }"
        >
          <StreamingChat
            style="height: calc(100vh - 180px)"
            :app-id="appId"
            :chat-id="selectedChat.chatId"
            :prologue="appInfo.prologue"
            :suggest-enabled="appInfo.suggestEnabled"
            @refresh-chat="fetchData"
          />
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>
<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { DeleteOutlined, PlusOutlined } from '@vicons/antd';
  import { useRoute } from 'vue-router';
  import { StreamingChat, ChatProps } from '@/components/AiChat';

  import { openChat, chatHistoryList, remove } from '@/api/chat';

  const DEFAULT_CHAT = {
    chatId: '',
    appId: '',
    title: '新建对话',
  };

  const selectedChat = ref<ChatProps>({ ...DEFAULT_CHAT });

  const route = useRoute();
  const appId = `${route.params.id}`;

  const appInfo = ref<any>({
    id: '',
    name: '',
    description: '',
    prologue: '',
    chatList: [],
    suggestEnabled: 0,
  });

  const onCreate = async () => {
    const { chatList } = appInfo.value;
    if (chatList.findIndex((item) => item.chatId === DEFAULT_CHAT.chatId) >= 0) {
      return;
    }
    const { data } = await openChat({
      appId: appId,
    });
    selectedChat.value = Object.assign({ ...DEFAULT_CHAT }, { chatId: data });
    chatList.unshift(selectedChat.value);
  };

  const onRemove = async (id: any) => {
    await remove(id);
    await fetchData();

    const { chatList } = appInfo.value;
    if (chatList && chatList.length >= 1) {
      selectedChat.value = chatList[0];
    } else {
      selectedChat.value = { ...DEFAULT_CHAT };
    }
  };
  const fetchData = async () => {
    const { data } = await chatHistoryList(appId);
    appInfo.value = { ...data };
    const { chatList } = appInfo.value;
    if (chatList && chatList.length >= 1) {
      selectedChat.value = chatList[0];
    } else {
      selectedChat.value = { ...DEFAULT_CHAT };
    }
  };
  onMounted(async () => {
    await fetchData();
  });
</script>

<style lang="less" scoped>
  .chat-item-action {
    display: none;
  }
  .chat-item:hover .chat-item-action {
    display: block;
  }
</style>
