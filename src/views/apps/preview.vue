<script setup lang="ts">
  import { Chat, ChatProps } from '@/components/Chat';
  import { onMounted, ref } from 'vue';
  import { DeleteOutlined, RobotOutlined, PlusOutlined } from '@vicons/antd';
  import { useRoute } from 'vue-router';

  const DEFAULT_CHAT = {
    id: 0,
    name: '新建对话',
  };

  const chatList = ref<ChatProps[]>([]);
  const selectedChat = ref<ChatProps>(Object.assign({}, DEFAULT_CHAT));

  const route = useRoute();
  const appId = `${route.params.id}`;

  const openChat = (data: ChatProps) => {
    if (selectedChat.value.id <= 0) {
      onCreate();
    }
    selectedChat.value = Object.assign({}, data);
    chatList.value[0] = selectedChat.value;
  };

  const onCreate = () => {
    if (chatList.value.findIndex((item) => item.id === DEFAULT_CHAT.id) >= 0) {
      return;
    }
    selectedChat.value = Object.assign({}, DEFAULT_CHAT);
    chatList.value.unshift(selectedChat.value);
  };

  const onRemove = (id: any) => {
    chatList.value = chatList.value.filter((item) => item.id !== id);
  };
  const fetchData = () => {
    chatList.value = [
      {
        id: 1,
        name: '对话1对话1对话1对话1对话1对话1对话1对话1对话1对话1对话1对话1',
      },
      {
        id: 2,
        name: '对话2',
      },
    ];
  };
  onMounted(async () => {
    await fetchData();
  });
</script>

<template>
  <div>
    <n-card :bordered="false" content-class="py-1">
      <n-grid x-gap="12" class="w-full h-full">
        <n-gi span="6" class="py-5" style="border-right: 1px solid #ebebeb">
          <div class="mr-5">
            <n-h6>
              <n-flex align="center">
                <n-avatar>
                  <n-icon>
                    <RobotOutlined />
                  </n-icon>
                </n-avatar>
                <n-text>测试应用</n-text>
              </n-flex>
            </n-h6>
            <n-button class="w-full" @click="onCreate">
              <template #icon>
                <n-icon>
                  <PlusOutlined />
                </n-icon>
              </template>
              新建对话
            </n-button>
            <div class="my-3">
              <n-text class="text-base" strong>历史记录</n-text>
            </div>
          </div>
          <n-virtual-list
            style="max-height: calc(100vh - 45px)"
            v-if="chatList && chatList.length >= 1"
            :item-size="40"
            :items="chatList"
          >
            <template #default="{ item }">
              <n-flex
                :wrap="false"
                class="h-10 hover:bg-gray-100 pt-1 px-3 mr-5 mb-1 rounded-lg chat-item"
                :class="selectedChat.id == item.id ? 'bg-slate-100' : ''"
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
                    <n-text depth="2"> {{ item.name }} </n-text>
                  </n-ellipsis>
                </div>
                <div class="w-4">
                  <n-popconfirm @positive-click="onRemove(item.id)">
                    <template #trigger>
                      <n-button
                        :class="chatList && chatList.length > 1 ? 'chat-item-action' : 'hidden'"
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
          <div style="height: calc(100vh - 230px)" v-else>
            <n-empty description="暂无历史记录" />
          </div>
          <n-divider>
            <n-text depth="3" class="text-sm font-normal"> 仅显示最近 20 条会话 </n-text>
          </n-divider>
        </n-gi>
        <n-gi span="18" class="p-5">
          <n-h6>
            {{ selectedChat.name }}
          </n-h6>
          <n-divider />
          <Chat
            style="height: calc(100vh - 245px)"
            :app-id="appId"
            :chat-id="selectedChat.id"
            @open-chat="openChat"
          />
        </n-gi>
      </n-grid>
    </n-card>
  </div>
</template>

<style lang="less" scoped>
  .chat-item-action {
    display: none;
  }
  .chat-item:hover .chat-item-action {
    display: block;
  }
</style>
