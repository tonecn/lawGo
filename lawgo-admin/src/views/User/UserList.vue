<script setup lang="ts">
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
import type { User } from '@/lib/types/User';

defineProps<{
    data?: User[]
    errorMessage?: string
}>()

defineEmits<{
    edit: [string]
}>()

</script>
<template>
    <Table>
        <TableCaption>{{ data ? (data.length > 0 ? '' : '暂无数据') : (errorMessage || '加载中...') }}</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead class="w-20">ID</TableHead>
                <TableHead>用户名</TableHead>
                <TableHead>手机号</TableHead>
                <TableHead>注册时间</TableHead>
                <TableHead>角色</TableHead>
                <TableHead class="text-center">操作</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow v-for="u of data">
                <TableCell class="font-medium">
                    <div class="w-20 truncate">{{ u.id }}</div>
                </TableCell>
                <TableCell>{{ u.username }}</TableCell>
                <TableCell>{{ u.phone }}</TableCell>
                <TableCell>{{ new Date(u.createdAt).toLocaleString() }}</TableCell>
                <TableCell>{{ u.roles?.join(',') || '' }}</TableCell>
                <TableCell class="text-center">
                    <Button size="sm" @click="$emit('edit', u.id)">编辑</Button>
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>
</template>