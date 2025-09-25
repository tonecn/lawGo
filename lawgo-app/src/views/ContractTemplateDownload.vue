<script setup lang="ts">
import IconButton from '@/components/IconButton.vue';
import { ArrowLeft, CheckCircle, Download } from 'lucide-vue-next';
import { onActivated, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const templateName = ref('');

const goBack = () => {
  router.go(-1);
};

const downloadNow = () => {
  const downloadUrl = route.query.url?.toString();
  if (downloadUrl) {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = '_blank';
    link.click();
  }
};

onActivated(() => {
  // 从路由查询参数获取模板名称
  templateName.value = route.query.name?.toString() || '';

  setTimeout(() => {
    downloadNow();
  }, 1000);
});
</script>
<template>
  <div class="flex flex-col justify-between h-[100dvh]"
    style="background: linear-gradient(to bottom, #3d374b, #191b23 20%)">
    <div class="flex-1 overflow-x-hidden overscroll-y-auto p-3 flex flex-col">
      <div>
        <div class="h-5"></div>
        <div class="flex items-center">
          <span class="flex-1">
            <IconButton @click="goBack">
              <ArrowLeft class="size-5" />
            </IconButton>
          </span>
          <span class="flex-1 text-center text-xl">下载确认</span>
          <span class="flex-1"></span>
        </div>
        <div class="h-3"></div>
      </div>

      <div class="flex-1 flex justify-center items-center">
        <div class="max-w-md w-full p-6 text-center">
          <CheckCircle class="size-16 text-green-500 mx-auto mb-4" />
          <h2 class="text-2xl font-bold mb-2">下载确认</h2>
          <p class="text-white/80 mb-6">
            "{{ templateName }}" 即将开始下载。<br>
            如果下载没有自动开始，请点击下方按钮。
          </p>

          <div class="flex flex-col items-center gap-4">
            <IconButton @click="downloadNow" class="bg-primary hover:bg-primary/90 px-8 py-3 text-lg">
              <div class="flex items-center">
                <Download class="size-5 mr-2" />
                <span>立即下载</span>
              </div>
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>