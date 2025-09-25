<script setup lang="ts">
import { ArrowLeft, KeyRound, LogOut } from 'lucide-vue-next';
import { onActivated, onMounted, reactive, toRefs } from 'vue';
import { toast } from 'vue-sonner';
import { app } from '@/lib/app-vm/app';
import { useRouter } from 'vue-router';
import IconButton from '@/components/IconButton.vue';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UserAPI } from '@/lib/api';

const router = useRouter();
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

const handleLogout = () => {
    app.user.logout()
    router.push({ name: 'home' })
    toast.success('退出成功');
}

const dialogOpen = reactive({
    username: false,
    password: false,
    logout: false,
})

const formData = reactive({
    username: '',
    password: '',
})

const handleSaveProfile = async (type: 'username' | 'password') => {
    if (type === 'username') {
        if (formData.username.length < 1 || formData.username.length > 20) {
            return toast.warning('账户名不符合规范');
        }
    }

    if (type === 'password') {
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,20}$/.test(formData.password)) {
            return toast.warning('密码不符合规范');
        }
    }

    await UserAPI.updateProfile(type === 'username' ? { username: formData.username } : { password: formData.password }).then(() => {
        toast.success('修改成功');
        dialogOpen.logout = false;
        dialogOpen.username = false;
        dialogOpen.password = false;
        if (type === 'username') app.user.loadUserMe({ withCache: false });
    }).catch(e => {
        toast.error(`${e.message}`);
    })
}

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
                <span class="flex-1 text-center text-xl">个人资料</span>
                <span class="flex-1"></span>
            </div>
            <div class="h-5"></div>
        </div>

        <div class="flex-1 flex flex-col gap-3 overflow-hidden overflow-y-auto" v-if="user">
            <div @click="formData.username = ''; dialogOpen.username = true"
                class="text-zinc-300 flex justify-between items-center bg-[#ffffff22] px-5 py-4 rounded-md hover:bg-[#ffffff33] transition-colors cursor-pointer border border-zinc-500">
                <span class="font-light">账户名</span>
                <span class="text-zinc-200">{{ user.username }}</span>
            </div>
            <div @click="toast.info('手机号暂时不支持修改哟～')"
                class="text-zinc-300 flex justify-between items-center bg-[#ffffff22] px-5 py-4 rounded-md hover:bg-[#ffffff33] transition-colors cursor-pointer border border-zinc-500">
                <span class="font-light">手机号</span>
                <span class="text-zinc-200">{{ user.phone }}</span>
            </div>
            <div @click="toast.info(`ID: ${user.id}`)"
                class="text-zinc-300 flex justify-between items-center bg-[#ffffff22] px-5 py-4 rounded-md hover:bg-[#ffffff33] transition-colors cursor-pointer border border-zinc-500">
                <span class="font-light w-30">ID</span>
                <span class="text-zinc-200 truncate">{{ user.id }}</span>
            </div>
            <div @click="toRefs.bind(`注册时间：${new Date(user.createdAt).toLocaleString()}`)"
                class="text-zinc-300 flex justify-between items-center bg-[#ffffff22] px-5 py-4 rounded-md hover:bg-[#ffffff33] transition-colors cursor-pointer border border-zinc-500">
                <span class="font-light w-30">注册时间</span>
                <span class="text-zinc-200 truncate">{{ new Date(user.createdAt).toLocaleString() }}</span>
            </div>
            <div @click="formData.password = ''; dialogOpen.password = true"
                class="text-zinc-300 flex justify-between items-center bg-[#ffffff22] px-5 py-4 rounded-md hover:bg-[#ffffff33] transition-colors cursor-pointer border border-zinc-500">
                <span class="font-light w-30">修改密码</span>
                <KeyRound class="size-5" />
            </div>
            <div @click="dialogOpen.logout = true"
                class="text-zinc-300 flex justify-between items-center bg-[#ffffff22] px-5 py-4 rounded-md hover:bg-[#ffffff33] transition-colors cursor-pointer border border-zinc-500">
                <span class="font-light w-30">退出登录</span>
                <LogOut class="size-5" />
            </div>
        </div>

        <Dialog v-model:open="dialogOpen.username">
            <DialogContent class="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>修改用户名</DialogTitle>
                    <DialogDescription>
                        用户名长度要求在1～20个字符之间，允许任意字符
                    </DialogDescription>
                </DialogHeader>
                <div class="flex items-center justify-between">
                    <Label for="username" class="text-right">
                        用户名
                    </Label>
                    <Input id="username" type="text" class="flex-1 ml-2" v-model="formData.username" />
                </div>
                <DialogFooter>
                    <Button @click="handleSaveProfile('username')">
                        保存
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        <Dialog v-model:open="dialogOpen.password">
            <DialogContent class="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>修改密码</DialogTitle>
                    <DialogDescription>
                        密码长度必须在6-20位之间，要求至少包含字母和数字，允许包含字母大小写及特殊字符
                    </DialogDescription>
                </DialogHeader>
                <div class="flex items-center justify-between">
                    <Label for="password" class="text-right">
                        新密码
                    </Label>
                    <Input id="password" type="password" class="flex-1 ml-2" v-model="formData.password" />
                </div>
                <DialogFooter>
                    <Button @click="handleSaveProfile('password')">
                        保存
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        <AlertDialog v-model:open="dialogOpen.logout">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>是否要退出登录？</AlertDialogTitle>
                    <AlertDialogDescription>
                        该操作会移除当前登录状态，稍后您可以再次登录
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction @click="handleLogout">退出</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>