<script setup lang="ts">
import Footer from '@/components/Footer.vue';
import SubMenuCard, { type SubMenuCardData } from './HomeView/SubMenuCard.vue';
import { FolderClock } from 'lucide-vue-next';
import IconButton from '@/components/IconButton.vue';
import ChatIndexs from './HomeView/ChatIndexs.vue';
import { ref } from 'vue';
import { app } from '@/lib/app-vm/app';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

const router = useRouter();
const chatIndexsOpen = ref(false);
const subMenus: SubMenuCardData[] = [
    {
        title: '智能对话',
        description: '为您解答各种法律问题',
        style: 'primary',
        name: 'intelligentConversation',
    },
    {
        title: '合同模板',
        description: '海量法律模板一键下载',
        name: 'contractTemplates',
    },
    {
        title: '文书撰写',
        description: '智能撰写专属法律文书',
        name: 'legalDocumentCreation',
    },
    {
        title: '法规检索',
        description: '法条法典罗列',
        name: 'regulatorySearch',
    },
    {
        title: '类判案例检索',
        description: '检索同类事件法院判例',
        name: 'caseLawSearch',
    },
]

const handleOpenChatIndexs = async () => {
    // 需要为该组件做独立于router的组件级鉴权处理
    if (!app.user.data.user) {
        if (!localStorage.getItem('token')) {
            return router.push({ name: 'login' });
        }

        await app.user.loadUserMe({ withCache: false }).catch(e => {
            return toast.error(`${e.message}`)
        });
        if (!app.user.data.user) {
            return router.push({ name: 'login' });
        }
    }

    // 已有登录态，直接访问
    chatIndexsOpen.value = true;
}

</script>
<template>
    <div class="flex flex-col justify-between h-[100dvh]"
        style="background: linear-gradient(to bottom, #3d374b, #191b23 20%)">
        <div class="flex-1 overflow-x-hidden overscroll-y-auto p-3">
            <div class="h-full flex flex-col justify-between">
                <div class="mt-5">
                    <IconButton @click="handleOpenChatIndexs">
                        <FolderClock class="size-5" />
                    </IconButton>
                </div>
                <div class="relative">
                    <div class="relative z-10">
                        <div class="font-light">Hi，您好！</div>
                        <div class="font-light text-zinc-300 bg-[#383a43] w-fit p-3 rounded-lg mt-2 rounded-tl-none">
                            智能法律顾问随时为您服务</div>
                    </div>
                    <div class="relative h-0 w-full">
                        <!-- Cover -->
                        <div class="absolute -bottom-15 text-[250px] text-center w-full">
                            <img src="../assets/luo.png" />
                        </div>
                    </div>
                    <div class="grid grid-cols-2 grid-rows-3 gap-x-3 gap-y-2.5 mt-5">
                        <SubMenuCard v-for="(d, i) of subMenus" :data="d" :class="[i === 0 && 'row-span-2']" />
                    </div>
                </div>
            </div>
        </div>
        <Footer />
        <ChatIndexs v-model:open="chatIndexsOpen" />
    </div>
</template>