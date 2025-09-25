<script setup lang="ts">
import IconButton from '@/components/IconButton.vue';
import { ArrowLeft, Download } from 'lucide-vue-next';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

interface ContractTemplate {
  id: number;
  title: string;
  description: string;
  downloadUrl: string;
}

const router = useRouter();

const templates = ref<ContractTemplate[]>([
  {
    id: 1,
    title: '劳动合同',
    description: '标准劳动合同模板，适用于全职员工',
    downloadUrl: ''
  },
  {
    id: 2,
    title: '保密协议',
    description: '员工保密协议模板，保护公司机密信息',
    downloadUrl: ''
  },
  {
    id: 3,
    title: '服务合同',
    description: '服务提供商合同模板',
    downloadUrl: ''
  },
  {
    id: 4,
    title: '租赁合同',
    description: '房屋/设备租赁标准合同',
    downloadUrl: ''
  }
]);

const downloadTemplate = (template: ContractTemplate) => {
  // In a real app, this would trigger the file download
  router.push({
    name: 'contractTemplateDownload',
    query: {
      name: template.title,
      url: template.downloadUrl
    }
  });
};
</script>

<template>
  <div class="flex flex-col justify-between h-[100dvh]"
    style="background: linear-gradient(to bottom, #3d374b, #191b23 20%)">
    <div class="flex-1 overflow-x-hidden overscroll-y-auto p-3 flex flex-col">
      <div>
        <div class="h-5"></div>
        <div class="flex items-center">
          <span class="flex-1">
            <IconButton @click="$router.back()">
              <ArrowLeft class="size-5" />
            </IconButton>
          </span>
          <span class="flex-1 text-center text-xl">合同模板</span>
          <span class="flex-1"></span>
        </div>
        <div class="h-3"></div>
      </div>

      <div class="flex-1">
        <div class="grid gap-4 p-4">
          <div v-for="template in templates" :key="template.id"
            class="bg-white/10 rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium">{{ template.title }}</h3>
              <p class="text-sm text-white/70">{{ template.description }}</p>
            </div>
            <IconButton @click="downloadTemplate(template)" class="bg-primary hover:bg-primary/90">
              <Download class="size-5" />
            </IconButton>
          </div>
        </div>

        <div class="p-4 text-center text-sm text-white/50">
          <p>如需定制合同模板，请联系法务部门</p>
        </div>
      </div>
    </div>
  </div>
</template>