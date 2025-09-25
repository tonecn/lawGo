<script setup lang="ts">
import { cn } from '@/lib/utils';
import { ChevronsRight } from 'lucide-vue-next';
import type { HTMLAttributes } from 'vue';

export type SubMenuCardData = {
    title: string,
    description: string,
    style?: 'primary',
    name: string,
}

const props = defineProps<{
    class?: HTMLAttributes['class'];
    data: SubMenuCardData
}>();
</script>
<template>
    <div :class="cn(props.class, 'p-2 rounded-xl relative overflow-hidden')"
        style="background: linear-gradient(to bottom right, #3f2d62, #2a3f64)" v-if="!data.style"
        @click="$router.push({ name: data.name })">
        <div class="text-zinc-200">{{ data.title }}</div>
        <div class="text-zinc-400 text-xs mt-2">{{ data.description }}</div>
        <div>
            <div class="size-12 rounded-full absolute -right-1 -bottom-3"
                style="background: linear-gradient(to bottom right, #ffffff11, #00000000);">
                <ChevronsRight class="size-6 text-[#476eb1] ml-3 mt-2" />
            </div>
            <div class="size-3 rounded-full absolute right-11 bottom-8 bg-[#ffffff0a]"></div>
        </div>
    </div>
    <div :class="cn(props.class, 'p-2 rounded-xl pt-0')" style="background: linear-gradient(to right,#4781d6,#ba5df0);"
        v-if="data.style === 'primary'" @click="$router.push({ name: data.name })">
        <div>
            <div class="text-zinc-600 text-xs bg-amber-400 rounded-full px-2 w-fit ml-auto -mr-2">New</div>
        </div>
        <div class="text-zinc-200">{{ data.title }}</div>
        <div class="text-zinc-300 text-xs mt-2">{{ data.description }}</div>
        <div>
            <svg t="1751166708799" class="icon" viewBox="0 0 2090 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="8538" fill="#ddd">
                <path
                    d="M96 336h64v384h-64v-384zM0 450.986667h64v186.026666H0v-186.026666z m224-178.986667h64v512h-64v-512z m128 176h64v160h-64V448z m128-48h64v256h-64v-256z m128-64h64v384h-64v-384z m128 128h64v128h-64v-128z m128-64h64v256h-64v-256zM960 448H1024v160h-64V448zM1162.666667 336h64v384h-64v-384zM1066.666667 450.986667h64v186.026666H1066.666667v-186.026666z m224-178.986667h64v512h-64v-512z m128 176h64v160h-64V448z m128-48h64v256h-64v-256z m128-64h64v384h-64v-384z m128 128h64v128h-64v-128z m128-64h64v256h-64v-256zM2026.666667 448H2090.666667v160h-64V448z"
                    p-id="8539"></path>
            </svg>
        </div>
    </div>
</template>