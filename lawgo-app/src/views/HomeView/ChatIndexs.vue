<script setup lang="ts">
import IconButton from '@/components/IconButton.vue';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer'
import { AichatAPI } from '@/lib/api';
import type { ChatIndex } from '@/lib/types/ChatIndex';
import { ArrowRight, X } from 'lucide-vue-next';
import { nextTick, ref, watch } from 'vue';
import { toast } from 'vue-sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

const open = defineModel<boolean>('open');
const chatIndexs = ref<ChatIndex[]>();

const closeButtonRef = ref<HTMLElement>();
watch(open, async () => {
    if (open.value) {
        nextTick(() => {
            closeButtonRef.value?.focus();
        })

        await handleLoadIndexs();
    }
})

const deletingIndexId = ref<string>();
const isDeleteDialogOpen = ref(false);

const handleLoadIndexs = async () => {
    chatIndexs.value = undefined;
    await AichatAPI.listChatIndexs().then(data => {
        chatIndexs.value = data;
    }).catch(e => toast.error(`${e.message}`));
}

const handleDeleteIndex = async (id?: string) => {
    if (!id) {
        return toast.error('数据状态管理异常');
    }

    await AichatAPI.deleteChatIndex(id).then(() => {
        toast.success('删除成功');
        handleLoadIndexs();
    }).catch(e => toast.error(`${e.message}`))
}

</script>
<template>
    <Drawer direction="left" v-model:open="open">
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle class="text-xl flex justify-between">
                    <span>对话历史</span>
                    <IconButton @click="open = false;" ref="closeButtonRef">
                        <X class="size-5 -m-1" />
                    </IconButton>
                </DrawerTitle>
                <DrawerDescription>仅显示智能对话的历史记录</DrawerDescription>
            </DrawerHeader>
            <div class="overflow-x-hidden overscroll-y-auto px-5">
                <div v-if="chatIndexs" class="flex flex-col gap-3">
                    <DropdownMenu v-for="i of chatIndexs">
                        <DropdownMenuTrigger>
                            <div
                                class="w-full flex justify-between items-center text-zinc-300 border border-zinc-700 bg-[#ffffff11] rounded-lg text-sm p-2">
                                <div class="text-left">
                                    <div>{{ i.title || '未命名对话' }}</div>
                                    <div class="text-zinc-400 text-xs font-light mt-2">{{
                                        new Date(i.updatedAt).toLocaleString() }}</div>
                                </div>
                                <div>
                                    <ArrowRight
                                        @click="open = false; $router.push({ name: 'intelligentConversation', params: { indexId: i.id } });"
                                        class="size-5" />
                                </div>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                @click="open = false; $router.push({ name: 'intelligentConversation', params: { indexId: i.id } });">
                                查看</DropdownMenuItem>
                            <DropdownMenuItem @click="deletingIndexId = i.id; isDeleteDialogOpen = true;">删除
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div class="h-5"></div>
            </div>
        </DrawerContent>
    </Drawer>

    <AlertDialog v-model:open="isDeleteDialogOpen">
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>是否要删除该对话</AlertDialogTitle>
                <AlertDialogDescription>
                    该操作不可撤销，将会永久删除该对话
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction @click="handleDeleteIndex(deletingIndexId)">确定</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>