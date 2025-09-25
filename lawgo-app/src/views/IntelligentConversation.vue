<script setup lang="ts">
import AutoSizeTextarea from '@/components/AutoSizeTextarea.vue';
import ChatHistory from '@/components/ChatHistory.vue';
import IconButton from '@/components/IconButton.vue';
import { app } from '@/lib/app-vm/app';
import type { ChatContent } from '@/lib/types/ChatContent';
import { cn } from '@/lib/utils';
import { ArrowLeft, Mic, Send } from 'lucide-vue-next';
import { computed, onActivated, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

const route = useRoute();
const router = useRouter();
const indexId = computed(() => route.params.indexId);

const aichatVM = app.aichat;

const generateFirstAssistantChatContent = () => {
    return {
        id: 'id',
        role: 'assistant' as ChatContent['role'],
        content: '您好，我是你的专属智能法律顾问，你希望我帮你解决什么问题？',
        createdAt: new Date(),
    };;
}

/** @todo 暂时通过flex-col-reverse实现保持最新内容，可能会有浏览器兼容问题，待修改 */
let firstAssistantChat = generateFirstAssistantChatContent()
const chatHistory = computed(() => {
    if (!aichatVM.data.currentIndexId) {
        return [firstAssistantChat];
    }

    const h = [
        ...([...aichatVM.data.chatHistorys[aichatVM.data.currentIndexId]].reverse() || []),
    ];
    if (h.length === 0) {
        h.push(firstAssistantChat);
    }
    return h;
});

const userInput = ref('');
const isGenerating = ref(false);
const handleSubmit = async () => {
    if (isGenerating.value) {
        return toast.warning('正在生成中，请稍后');
    }

    try {
        isGenerating.value = true;

        const content = userInput.value.trim();
        if (!content) {
            return toast.warning('请输入问题');
        }

        if (!indexId.value) {
            // 先初始化，再发送请求
            const newIndexId = await aichatVM.initChat({
                initHistory: [firstAssistantChat],
            }).catch(e => {
                toast.error(`${e.message}`);
                return;
            });

            if (!newIndexId) {
                return;
            }

            await router.replace({
                name: 'intelligentConversation',
                params: { indexId: newIndexId }
            })

            if (!indexId.value) {
                return toast.warning('初始化失败，请刷新界面重试');
            }
        }

        // 初始化完成，移动用户输入到历史
        userInput.value = '';

        // 处理用户输入
        await aichatVM.chat(`${indexId.value}`, content)
            .then(async () => {
                if (aichatVM.data.currentIndexId) {
                    const index = aichatVM.data.chatIndexs[aichatVM.data.currentIndexId];
                    if (!index) {
                        return;
                    }

                    if (!index.title) {
                        // 将当前用户输入的字符作为输入
                        await aichatVM.updateChatIndexTitle(
                            `${indexId.value}`,
                            content.slice(0, 20),
                        )
                    }
                }
            })
            .catch(e => toast.error(`${e.message}`));
    } finally {
        isGenerating.value = false;
    }
}

const loadingState = ref(false);
onActivated(async () => {
    if (indexId.value) {
        loadingState.value = true;

        // 加载历史记录
        await aichatVM.loadChatHistory(`${indexId.value}`).then(() => {
            // 调整指针
            aichatVM.setCurrentIndexId(`${indexId.value}`);
        }).catch((e) => {
            toast.error(`${e.message}`)
            if (`${e.message === '对话不存在'}`) {
                router.replace({ name: 'intelligentConversation' })
            }
        }).finally(() => {
            loadingState.value = false;
        });
    } else {
        // 新对话
        // 初始化对话记录
        firstAssistantChat = generateFirstAssistantChatContent();
        // 调整指针
        aichatVM.setCurrentIndexId(null);
    }
})

</script>
<template>
    <div class="flex flex-col justify-between h-[100dvh] p-3"
        style="background: linear-gradient(to bottom, #3d374b, #191b23 20%)">
        <div>
            <div class="h-5"></div>
            <div class="flex items-center">
                <span class="flex-1">
                    <IconButton @click="$router.push({ name: 'home' })">
                        <ArrowLeft class="size-5" />
                    </IconButton>
                </span>
                <span class="flex-1 text-center text-xl">AI法律咨询</span>
                <span class="flex-1"></span>
            </div>
            <div class="h-3"></div>
        </div>
        <div class="w-full flex-1" v-show="loadingState">
            <div class="text-center mt-15 text-zinc-300">加载中，请稍后...</div>
        </div>
        <div ref="chatHistoryContainer" class="flex-1 overflow-x-hidden overflow-y-auto flex flex-col-reverse"
            v-show="!loadingState">
            <div class="flex-1"></div>
            <ChatHistory :data="chatHistory" />
        </div>
        <div>
            <div class="h-2"></div>
            <div class="flex items-end">
                <IconButton type="highlight" @click="$router.push({ name: 'voiceConversation' })">
                    <Mic class="size-7" />
                </IconButton>
                <div class="flex-1 flex items-end ml-3 border border-zinc-500 rounded-xl py-1">
                    <div class="flex-1 ml-3">
                        <AutoSizeTextarea placeholder="请输入你的问题..." v-model="userInput" />
                    </div>
                    <IconButton type="no-border" class="mx-1" @click="handleSubmit">
                        <Send :class="cn('size-5', isGenerating && 'text-zinc-400')" />
                    </IconButton>
                </div>
            </div>
        </div>
    </div>
</template>