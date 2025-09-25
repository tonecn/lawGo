<script setup lang="ts">
import { cn } from '@/lib/utils';
import { ref, type HtmlHTMLAttributes } from 'vue';

const props = defineProps<{
    class?: HtmlHTMLAttributes['class'];
    type?: 'default' | 'no-border' | 'highlight';
}>()

const buttonRef = ref<HTMLButtonElement>()

defineExpose({
    focus: () => buttonRef.value?.focus(),
    blur: () => buttonRef.value?.blur(),
    click: () => buttonRef.value?.click(),
})
</script>
<template>
    <button ref="buttonRef" :class="cn('w-fit p-2 text-zinc-200', props.class,
        ([undefined, 'default', 'highlight'].includes(type)) && 'border rounded-full border-zinc-500 bg-[#ffffff11]',
        type === 'highlight' && '!bg-[#ffffff33]')">
        <slot />
    </button>
</template>