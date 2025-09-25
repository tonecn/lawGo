<script setup lang="ts">
import { cn } from '@/lib/utils';
import { nextTick, onBeforeUnmount, onMounted, ref, watch, type HtmlHTMLAttributes } from 'vue';

interface AutoSizeTextareaProps {
    maxRows?: number;
    rows?: number;
    class?: HtmlHTMLAttributes['class'];
}

const props = withDefaults(defineProps<AutoSizeTextareaProps>(), {
    maxRows: 10,
    rows: 1
});

const modelValue = defineModel<string>();

const textareaRef = ref<HTMLTextAreaElement>();

const autoResize = () => {
    const textarea = textareaRef.value;
    if (!textarea) {
        return;
    }

    textarea.style.height = 'auto';
    const maxHeight = parseFloat(getComputedStyle(textarea).lineHeight) * props.maxRows;

    if (textarea.scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
        textarea.style.overflowY = 'scroll';
    } else {
        textarea.style.height = `${textarea.scrollHeight}px`;
        textarea.style.overflowY = 'hidden';
    }
}

onMounted(() => {
    textareaRef.value?.addEventListener('input', autoResize);
})

onBeforeUnmount(() => {
    textareaRef.value?.removeEventListener('input', autoResize);
})

watch(modelValue, () => {
    nextTick(() => {
        autoResize();
    })
})

</script>
<template>
    <textarea type="text" ref="textareaRef" :rows="props.rows" v-model="modelValue"
        :class="cn('w-full outline-none min-h-[1.5em] max-h-[calc(1.5em*10)] resize-none leading-[1.5em]', props.class)"></textarea>
</template>