<script setup lang="ts">
import AutoSizeTextarea from '@/components/AutoSizeTextarea.vue';
import ChatHistory from '@/components/ChatHistory.vue';
import IconButton from '@/components/IconButton.vue';
import { app } from '@/lib/app-vm/app';
import { cn } from '@/lib/utils';
import { ArrowLeft, Send } from 'lucide-vue-next';
import { computed, onActivated, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

const contractVM = app.contract;
const router = useRouter();

/** @todo 暂时通过flex-col-reverse实现保持最新内容，可能会有浏览器兼容问题，待优化 */
const chatHistory = computed(() => {
    return [...contractVM.data.chatHistory.filter(c => c.isHidden !== true)].reverse();
});

const userInput = ref('');
const handleSubmit = async () => {
    if (status.generating) {
        return toast.warning('正在生成中，请稍后');
    }

    try {
        status.generating = true;

        const content = userInput.value.trim();
        if (!content) {
            return toast.warning('请输入问题');
        }

        userInput.value = '';
        await contractVM.chat(`${content}`)
            .then(async () => { })
            .catch(e => toast.error(`${e.message}`));
    } finally {
        status.generating = false;
    }
}

const status = reactive({
    generating: false,
})

onActivated(async () => {
    status.generating = true;
    await contractVM.initChat().then(() => {

    }).catch(e => {
        toast.error(`${e.message}`);
        setTimeout(() => {
            router.back();
        }, 1000);
    }).finally(() => {
        status.generating = false;
    })
})

</script>
<template>
    <div class="flex flex-col justify-between h-[100dvh] p-3"
        style="background: linear-gradient(to bottom, #3d374b, #191b23 20%)">
        <div>
            <div class="h-5"></div>
            <div class="flex items-center">
                <span class="flex-1">
                    <IconButton @click="$router.back()">
                        <ArrowLeft class="size-5" />
                    </IconButton>
                </span>
                <span class="flex-1 text-center text-xl">合同审查结果</span>
                <span class="flex-1"></span>
            </div>
            <div class="h-3"></div>
        </div>
        <div ref="chatHistoryContainer" class="flex-1 overflow-x-hidden overflow-y-auto flex flex-col-reverse">
            <div class="flex-1"></div>
            <ChatHistory :data="chatHistory" />
        </div>
        <div>
            <div class="h-2"></div>
            <div class="flex items-end">
                <div class="flex-1 flex items-end border border-zinc-500 rounded-xl py-1">
                    <div class="flex-1 ml-3">
                        <AutoSizeTextarea placeholder="请输入你的问题..." v-model="userInput" />
                    </div>
                    <IconButton type="no-border" class="mx-1" @click="handleSubmit">
                        <Send :class="cn('size-5', status.generating && 'text-zinc-400')" />
                    </IconButton>
                </div>
            </div>
        </div>
    </div>
</template>