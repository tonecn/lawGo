<script setup lang="ts">
import { chatHistoryVM } from '@/lib/app_vm/chatHistoryVM';
import { onMounted, ref } from 'vue';
import { toast } from 'vue-sonner';
import ChatInexList from './ChatHistory/ChatInexList.vue';
import ChatIndexDialog from './ChatHistory/ChatIndexDialog.vue';
import type { ChatIndex } from '@/lib/types/ChatIndex';
import { ChatAPI } from '@/lib/api';
import type { ChatContent } from '@/lib/types/ChaContent';
import ChatHistory from './ChatHistory/ChatHistory.vue';

const chatHistoryVMData = chatHistoryVM.data;
onMounted(() => {
    handleLoadChatIndexs();
})

const chatIndexLoadErrorMessage = ref('');
const handleLoadChatIndexs = async () => {
    chatIndexLoadErrorMessage.value = '';
    await chatHistoryVM.loadIndexList()
        .catch(e => {
            chatIndexLoadErrorMessage.value = `${e.message}`;
            toast.error(`${e.message}`);
        });
}

const chatHistoryPageOpen = ref(false);
const chatHistory = ref<ChatContent[]>();
const handleReview = async (id: string) => {
    await ChatAPI.getChatHistory(id).then(data => {
        chatHistory.value = data.history;
        chatHistoryPageOpen.value = true;
    }).catch(e => toast.error(`${e.message}`));
}

const chatIndexPageOpen = ref(false);
const chatIndex = ref<ChatIndex & { title: string }>();
const handleEdit = async (id: string) => {
    await ChatAPI.getIndex(id).then((data) => {
        chatIndex.value = {
            ...data.index,
            title: data.index.title || '',
        };
        chatIndexPageOpen.value = true;
    }).catch(e => toast.error(`${e.message}`));
}

</script>
<template>
    <div class="flex-1 overflow-hidden flex flex-col">
        <div>

        </div>
        <div class="flex-1 overflow-x-hidden overflow-y-auto">
            <ChatInexList :data="chatHistoryVMData.chatIndexs" @review="id => handleReview(id)"
                @edit="id => handleEdit(id)" :error-message="chatIndexLoadErrorMessage" />
        </div>
        <ChatIndexDialog v-model:open="chatIndexPageOpen" v-model:chat-index="chatIndex"
            @refresh="handleLoadChatIndexs" />
        <ChatHistory v-model:open="chatHistoryPageOpen" :data="chatHistory" />
    </div>
</template>