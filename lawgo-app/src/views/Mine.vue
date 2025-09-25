<script setup lang="ts">
import Footer from '@/components/Footer.vue';
import { ArrowRight, BookCheck, Headset, ReceiptText, Share2, UserRound } from 'lucide-vue-next';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { computed, onActivated, onMounted, ref, toRefs } from 'vue';
import { toast } from 'vue-sonner';
import { app } from '@/lib/app-vm/app';
import { useRouter } from 'vue-router';

const router = useRouter();
const logoutDialogOpen = ref(false);
const { user } = toRefs(app.user.data);

onMounted(() => {
    localStorage.getItem('token') && loadUserMe();
})

onActivated(() => {
    if (!user.value) {
        localStorage.getItem('token') && loadUserMe();
    }
})

/** 带本地缓存的UserMe */
const loadUserMe = () => app.user.loadUserMe().catch(e => toast.error(`${e.message}`));

const options = [
    {
        icon: BookCheck,
        text: '合同审查',
        clickFunc: () => { router.push({ name: 'contract' }) },
    },
    {
        icon: ReceiptText,
        text: '合同下载',
        clickFunc: () => { router.push({ name: 'contractTemplates' }) },
    },
    {
        icon: Headset,
        text: '联系客服',
        clickFunc: () => { toast.info('暂时还没有客服捏：）') },
    },
    {
        icon: Share2,
        text: '分享',
        clickFunc: () => {
            navigator.clipboard.writeText(`${window.location.origin}`)
                .then(() => { toast.success('链接复制成功，快去分享吧～') })
                .catch(() => { toast.success('链接复制失败，请手动复制：（') })
        },
    },
]

const handleLogout = () => {
    app.user.logout()
    toast.success('退出成功');
}


</script>
<template>
    <div class="flex flex-col justify-between h-[100dvh]"
        style="background: linear-gradient(to bottom, #3d374b, #191b23 20%)">
        <div class="flex-1 overflow-x-hidden overscroll-y-auto p-3">
            <div class="h-5"></div>
            <div class="flex items-center">
                <div class="rounded-full size-14 bg-[#f0f7ff] overflow-hidden">
                    <div class="w-full h-full flex justify-center items-center">
                        <UserRound class="text-[#3f86f5] size-8" />
                    </div>
                </div>
                <div class="flex-1 ml-4">
                    <div class="text-lg font-bold">{{ user?.username || '亲爱的用户' }}</div>
                    <div class="text-sm font-light">{{ user?.phone || '请登录' }}</div>
                </div>
                <button class="border rounded-full border-[#e3c6a3] text-[#dcc4a7] text-sm px-4 py-1"
                    @click="$router.push({ name: 'login' })" v-if="!user">登录</button>
            </div>
            <div class="h-5"></div>
            <div class="border border-zinc-600 bg-[#ffffff22] flex justify-around py-4 rounded-xl">
                <div v-for="o of options" class="flex flex-col items-center" @click="o.clickFunc">
                    <div class="bg-[#ffffff22] p-3 rounded-full">
                        <component :is="o.icon" class="size-6 text-zinc-200" />
                    </div>
                    <div class="text-sm mt-3 text-zinc-300 font-light">{{ o.text }}</div>
                </div>
            </div>
            <div class="h-5"></div>
            <div class="flex flex-col gap-3">
                <div v-for="o of [{
                    text: '个人资料',
                    clickFunc: () => { user ? $router.push({ name: 'userProfile' }) : toast.warning('请先登录') }
                }, {
                    text: '用户协议',
                    clickFunc: () => $router.push({ name: 'userAgreement' })
                }, {
                    text: '隐私政策',
                    clickFunc: () => $router.push({ name: 'userPrivacyPolicy' })
                }, {
                    text: '退出登录',
                    clickFunc: () => { user && (logoutDialogOpen = true); },
                    isHidden: computed(() => !user)
                },]"
                    class="text-zinc-300 flex items-center bg-[#ffffff22] px-5 py-4 rounded-lg hover:bg-[#ffffff33] transition-colors cursor-pointer"
                    @click="o.clickFunc" v-show="o.isHidden?.value !== true">
                    <span class="mr-auto font-light">{{ o.text }}</span>
                    <span>
                        <ArrowRight class="size-5" />
                    </span>
                </div>
            </div>
        </div>
        <Footer />
        <AlertDialog v-model:open="logoutDialogOpen">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>是否要退出登录？</AlertDialogTitle>
                    <AlertDialogDescription>
                        退出后可稍后再进行登录
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction @click="handleLogout">确定</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>