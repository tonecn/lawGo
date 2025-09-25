<script setup lang="ts">
import type { ChatContent } from '@/lib/types/ChatContent';
import { cn } from '@/lib/utils';
import { toast } from 'vue-sonner';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

defineProps<{
    data: ChatContent[];
}>()

const handleCopyText = (t: string) => {
    navigator.clipboard.writeText(t)
        .then(() => {
            toast.success('复制成功');
        })
        .catch(() => {
            toast.error('复制失败，请手动进行复制');
        });
}

const renderMarkdown = (content: string) => {
    if (!content) return '';
    const html = marked.parse(content);
    return DOMPurify.sanitize(html as string);
}

</script>
<template>
    <div v-for="c of data" :key="c.id" :class="cn('my-3')" v-longpress="() => handleCopyText(c.content)">
        <div :class="cn(
            'text-zinc-500 text-sm text-center mb-2',
            c.role === 'assistant' && '',
            c.role === 'user' && '',
        )">{{ c.createdAt.toLocaleTimeString() }}</div>
        <div :class="cn(
            'rounded-xl p-3 w-fit markdown-content max-w-[100%] overflow-hidden',
            $style.markdownContent,
            c.role === 'assistant' && 'bg-[#ffffff22] border border-zinc-500 text-zinc-200 mr-auto',
            c.role === 'user' && 'bg-zinc-200 text-zinc-700 ml-auto',
        )">
            <div v-if="c.content" v-html="renderMarkdown(c.content)"></div>
            <span v-else>...</span>
        </div>
    </div>
</template>
<style module>
.markdownContent {
    line-height: 1.6;
}

.markdownContent :global(h1),
.markdownContent :global(h2),
.markdownContent :global(h3),
.markdownContent :global(h4),
.markdownContent :global(h5),
.markdownContent :global(h6) {
    @apply font-semibold mb-3 mt-4 first:mt-0;
}

.markdownContent :global(h1) {
    @apply text-xl;
}

.markdownContent :global(h2) {
    @apply text-lg;
}

.markdownContent :global(h3) {
    @apply text-base;
}

.markdownContent :global(p) {
    @apply mb-3 last:mb-0;
}

.markdownContent :global(ul),
.markdownContent :global(ol) {
    @apply mb-3 pl-4;
}

.markdownContent :global(li) {
    @apply mb-1;
}

.markdownContent :global(blockquote) {
    @apply border-l-4 border-zinc-400 pl-4 italic mb-3 text-zinc-300;
}

.markdownContent :global(code) {
    @apply bg-zinc-700 text-zinc-100 px-1.5 py-0.5 rounded text-sm font-mono;
}

.markdownContent :global(pre) {
    @apply bg-zinc-800 text-zinc-100 p-4 rounded-lg mb-3;
    overflow-x: auto;
    max-width: 100%;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
}

.markdownContent :global(pre code) {
    @apply bg-transparent p-0;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.markdownContent :global(table) {
    @apply border-collapse border border-zinc-600 mb-3;
}

.markdownContent :global(th),
.markdownContent :global(td) {
    @apply border border-zinc-600 px-3 py-2;
}

.markdownContent :global(th) {
    @apply bg-zinc-700 font-semibold;
}

.markdownContent :global(a) {
    @apply text-blue-400 underline hover:text-blue-300;
}

.markdownContent :global(strong) {
    @apply font-semibold;
}

.markdownContent :global(em) {
    @apply italic;
}
</style>