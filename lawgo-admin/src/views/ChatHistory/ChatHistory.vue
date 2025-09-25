<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { X } from 'lucide-vue-next';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import type { ChatContent } from '@/lib/types/ChaContent';

const openModel = defineModel<boolean>('open');
defineProps<{
    data?: ChatContent[];
}>()

</script>
<template>
    <Drawer v-model:open="openModel">
        <DrawerContent>
            <DrawerHeader>
                <div class="flex justify-between items-start">
                    <div>
                        <DrawerTitle>审阅对话</DrawerTitle>
                        <DrawerDescription>该界面数据与用户端同步，请谨慎操作 </DrawerDescription>
                    </div>
                    <div>
                        <Button variant="outline" @click="openModel = false">
                            <X />
                        </Button>
                    </div>
                </div>
            </DrawerHeader>
            <div class="px-5 overflow-x-hidden overflow-y-auto">
                <Table>
                    <TableCaption>{{ '' }}</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="w-20">ID</TableHead>
                            <TableHead>角色</TableHead>
                            <TableHead>对话内容</TableHead>
                            <TableHead>对话时间</TableHead>
                            <TableHead>用户可见</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody v-if="data">
                        <TableRow v-for="c of data">
                            <TableCell class="font-medium">
                                <div class="w-20 truncate">{{ c.id }}</div>
                            </TableCell>
                            <TableCell>
                                {{ c.role === 'user' ? '用户' :
                                    c.role === 'assistant' ? 'AI' :
                                        c.role === 'system' ? '系统' : '未知' }}</TableCell>
                            <TableCell class="whitespace-pre-wrap break-all">{{ c.content }}</TableCell>
                            <TableCell class="whitespace-pre-wrap">{{
                                new Date(c.createdAt).toLocaleString() }}</TableCell>
                            <TableCell>{{ c.isHidden ? '否' : '是' }}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </DrawerContent>
    </Drawer>
</template>