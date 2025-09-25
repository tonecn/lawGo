<script setup lang="ts">
import { BookText, Home, User } from 'lucide-vue-next';
const pages = [
    {
        text: '首页',
        icon: Home,
        name: 'home'
    },
    {
        text: '合同',
        icon: BookText,
        name: 'contract'
    },
    // {
    //     text: '律师',
    //     icon: SquareUserRound,
    //     name: 'lawyer'
    // },
    {
        text: '我的',
        icon: User,
        name: 'mine'
    },
]
</script>
<template>
    <footer class="bg-[#060f19] h-18">
        <div class="w-full h-full flex justify-around">
            <RouterLink v-for="i of pages" :key="i.name" :to="{ name: i.name }"
                :class="['text-zinc-400', $route.name === i.name && '!text-orange-300']">
                <div class="flex flex-col items-center mt-3">
                    <component :is="i.icon" class="size-6" />
                    <span class="text-sm">{{ i.text }}</span>
                </div>
            </RouterLink>
        </div>
    </footer>
</template>