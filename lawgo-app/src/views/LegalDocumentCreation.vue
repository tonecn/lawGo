<script setup lang="ts">
import { ArrowLeft, ArrowRight, Send } from "lucide-vue-next";
import IconButton from "@/components/IconButton.vue";
import { app } from "@/lib/app-vm/app";
import { toast } from "vue-sonner";
import { computed, reactive, ref } from "vue";
import { cn } from "@/lib/utils";
import { useRouter } from "vue-router";
import ChatHistory from "@/components/ChatHistory.vue";
import AutoSizeTextarea from "@/components/AutoSizeTextarea.vue";

const router = useRouter();
const legalDocumentVM = app.legalDocument;
const chatHistory = computed(() => {
  return [...legalDocumentVM.data.chatHistory.filter(c => c.isHidden !== true)].reverse();
});
const userInput = ref('');

const services = [
  {
    title: '起诉状',
    description: '为您起草一份起诉状',
  },
  {
    title: '答辩状',
    description: '为您起草一份答辩状',
  },
  {
    title: '催款函',
    description: '为您起草一份催款函',
  },
  {
    title: '承诺函',
    description: '为您起草一份承诺函',
  },
  {
    title: '告知函',
    description: '为您起草一份告知函',
  },
  {
    title: '律师函',
    description: '为您起草一份律师函',
  },
  {
    title: '合同协议',
    description: '为您起草各类合同协议',
  },
  {
    title: '声明书',
    description: '为您起草一份声明书',
  },
  {
    title: '授权委托书',
    description: '为您起草一份授权委托书',
  },
  {
    title: '证明书',
    description: '为您起草一份证明书',
  },
  {
    title: '申请书',
    description: '为您起草各类申请书',
  },
  {
    title: '上诉状',
    description: '为您起草一份上诉状',
  },
  {
    title: '反诉状',
    description: '为您起草一份反诉状',
  },
  {
    title: '调解协议',
    description: '为您起草一份调解协议',
  },
  {
    title: '和解协议',
    description: '为您起草一份和解协议',
  },
  {
    title: '其他',
    description: '为您提供其他撰写服务',
  }
]

const state = reactive({
  createdMode: false,
  generating: false,
})

const handleSelectType = (type: string) => {
  legalDocumentVM.setDocumentType(type);
  state.createdMode = true;
  state.generating = true;
  legalDocumentVM.initChat().then(() => {
  }).catch((e) => {
    toast.error(`${e.message}`);
  }).finally(() => { state.generating = false; });
}

const handleSubmitChat = async () => {
  if (state.generating) {
    return toast.error('AI生成中，请稍后')
  }

  const content = userInput.value.trim();
  if (!content) {
    return toast.error(`输入不得为空`);
  }

  userInput.value = '';
  state.generating = true;
  legalDocumentVM.chat(content).catch(() => {

  }).catch(e => toast.error(`${e.message}`)).finally(() => {
    state.generating = false;
  });
}

const handleBack = () => {
  if (state.generating) {
    return toast.error('AI生成中，请等待生成结束后再返回')
  }

  if (state.createdMode) {
    // 创造模式，返回到选择
    state.createdMode = false;
    return;
  } else {
    router.back();
  }
}

</script>

<template>
  <div class="flex flex-col justify-between h-[100dvh] p-3"
    style="background: linear-gradient(to bottom, #3d374b, #191b23 20%)">
    <div>
      <div class="h-5"></div>
      <div class="flex items-center">
        <span class="flex-1">
          <IconButton @click="handleBack">
            <ArrowLeft class="size-5" />
          </IconButton>
        </span>
        <span class="flex-1 text-center text-xl">文书撰写</span>
        <span class="flex-1"></span>
      </div>
      <div class="h-3"></div>
    </div>

    <div v-if="state.createdMode" class="flex-1 flex flex-col overflow-hidden">
      <div ref="chatHistoryContainer" class="flex-1 overflow-x-hidden overflow-y-auto flex flex-col-reverse">
        <div class="flex-1"></div>
        <ChatHistory :data="chatHistory" />
      </div>
      <div>
        <div class="h-2"></div>
        <div class="flex items-end">
          <div class="flex-1 flex items-end border border-zinc-500 rounded-xl py-1">
            <div class="flex-1 ml-3">
              <AutoSizeTextarea placeholder="请输入你的问题..." v-model="userInput" />
            </div>
            <IconButton type="no-border" class="mx-1" @click="handleSubmitChat">
              <Send :class="cn('size-5', state.generating && 'text-zinc-400')" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full flex-1 overflow-y-auto overflow-x-hidden" v-else>
      <div v-for="item, index in services" :key="index" @click="handleSelectType(item.title)" class="
  hover:bg-gray-800/10 
    rounded-lg p-6 transition-all duration-300
    border border-gray-500 hover:border-blue-500 bg-[#ffffff11]
    group flex items-center justify-between mb-3 last:mb-0
  ">
        <div>
          <h3 class="text-white font-medium">{{ item.title }}</h3>
          <p class="text-gray-400 mt-2">{{ item.description }}</p>
        </div>
        <span class="
    text-gray-400 group-hover:text-blue-500
    transition-transform duration-300 group-hover:translate-x-1
    font-bold text-lg
  ">
          <ArrowRight />
        </span>
      </div>
    </div>
  </div>
</template>