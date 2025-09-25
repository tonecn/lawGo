<script setup lang="ts">
import type { ChatIndex } from '@/lib/types/ChatIndex';
import type { User } from '@/lib/types/User';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

defineProps<{
    data?: {
        indexs: ChatIndex[];
        users: {
            [userId: string]: User;
        };
    },
    errorMessage?: string;
}>()

defineEmits<{
    edit: [string];
    review: [string];
}>()

</script>
<template>
    <Table>
        <TableCaption>{{ data ? (data.indexs.length > 0 ? '' : '暂无数据') : (errorMessage || '加载中...') }}</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead class="w-20">ID</TableHead>
                <TableHead>对话标题</TableHead>
                <TableHead>创建用户</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead class="text-center">操作</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody v-if="data">
            <TableRow v-for="i of data.indexs">
                <TableCell class="font-medium">
                    <div class="w-20 truncate">{{ i.id }}</div>
                </TableCell>
                <TableCell class="whitespace-pre-wrap break-all">{{ i.title }}</TableCell>
                <TableCell>{{ data.users[i.userId]?.username || '未知用户' }}</TableCell>
                <TableCell class="whitespace-pre-wrap break-all">{{ new Date(i.createdAt).toLocaleString() }}
                </TableCell>
                <TableCell class="text-center">
                    <Button variant="outline" size="sm" @click="$emit('review', i.id)">审阅</Button>
                    <Button class="ml-2" size="sm" @click="$emit('edit', i.id)">编辑</Button>
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>
</template>