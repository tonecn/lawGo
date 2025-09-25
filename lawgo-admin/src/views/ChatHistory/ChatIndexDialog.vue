<script setup lang="ts">
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import type { ChatIndex } from '@/lib/types/ChatIndex';
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { chatHistoryVM } from '@/lib/app_vm/chatHistoryVM';
import { toast } from 'vue-sonner';
import { ChatAPI } from '@/lib/api';

const openModel = defineModel<boolean>('open');
const chatIndexModel = defineModel<ChatIndex & { title: string }>('chatIndex');

const emit = defineEmits<{
    refresh: [],
}>()

const deleteDialogOpen = ref(false);

const handleDelete = async () => {
    if (!chatIndexModel.value?.id) {
        return toast.error('数据状态异常');
    }

    const id = chatIndexModel.value.id;
    await ChatAPI.deleteIndex(id).then(() => {
        toast.success('删除成功');
        openModel.value = false;
        emit('refresh');
    })
}

const handleSave = async () => {
    if (!chatIndexModel.value?.id) {
        return toast.error('数据状态异常');
    }

    const id = chatIndexModel.value.id;
    const title = chatIndexModel.value.title;

    // 判断title合法性
    if (title.length > 20 || title.length < 1) {
        return toast.warning('标题长度只能在1～20之间');
    }

    await ChatAPI.updateIndex(id, title).then(() => {
        toast.success('修改成功');
        openModel.value = false;
        emit('refresh');
    }).catch(e => toast.error(`${e.message}`));
}

</script>
<template>
    <Dialog v-model:open="openModel">
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>编辑对话信息</DialogTitle>
                <DialogDescription>
                    请在提交表单前检查填写信息是否有误
                </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4" v-if="chatIndexModel">
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="user-dialog-id" class="text-right">
                        ID
                    </Label>
                    <Input id="user-dialog-id" class="col-span-3" v-model="chatIndexModel.id" disabled />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="user-dialog-username" class="text-right">
                        对话标题
                    </Label>
                    <Input id="user-dialog-username" class="col-span-3  " v-model="chatIndexModel.title" />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="user-dialog-user" class="text-right">
                        所属用户
                    </Label>
                    <Input id="user-dialog-user" class="col-span-3"
                        :model-value="chatHistoryVM.data.chatIndexs?.users[chatIndexModel.userId]?.username || '未知用户'"
                        disabled />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="user-dialog-createdAt" class="text-right">
                        创建时间
                    </Label>
                    <Input id="user-dialog-createdAt" class="col-span-3"
                        :model-value="new Date(chatIndexModel.createdAt).toLocaleString()" disabled />
                </div>
                <div class="grid grid-cols-4 items-center gap-4">
                    <Label for="user-dialog-createdAt" class="text-right">
                        上次对话
                    </Label>
                    <Input id="user-dialog-createdAt" class="col-span-3"
                        :model-value="new Date(chatIndexModel.updatedAt).toLocaleString()" disabled />
                </div>
            </div>
            <DialogFooter>
                <div class="w-full flex justify-between">
                    <AlertDialog v-model="deleteDialogOpen">
                        <AlertDialogTrigger>
                            <Button variant="destructive">删除</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>是否要删除该对话？</AlertDialogTitle>
                                <AlertDialogDescription>
                                    该操作会先进行软删除，彻底清除需要手动从数据库中移除
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction @click="handleDelete">删除</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <div>
                        <Button variant="outline" @click="openModel = false">取消</Button>
                        <Button class="ml-3" @click="handleSave">保存</Button>
                    </div>
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>