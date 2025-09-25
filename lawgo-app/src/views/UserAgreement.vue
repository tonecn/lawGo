<template>
  <div class="h-[100dvh] bg-gray-900 p-4 text-gray-200 flex flex-col">
    <!-- 头部 -->
    <div class="flex items-center mb-6 sticky top-0 bg-gray-900 py-4 z-10 border-b border-gray-700">
      <button @click="goBack" class="mr-3 p-1 rounded-full hover:bg-gray-700 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 class="text-2xl font-bold text-white">用户协议</h1>
    </div>

    <!-- 协议内容容器 -->
    <div class="bg-gray-800 rounded-lg p-6 overflow-y-auto border border-gray-700 flex-1">
      <article class="legal-document">
        <header class="mb-8 text-center border-b border-gray-700 pb-4">
          <h2 class="text-xl font-bold text-white mb-2">《用户协议》</h2>
          <p class="text-gray-400">最后更新日期：2025年07月02日</p>
        </header>

        <p class="mb-6 leading-relaxed text-gray-300">
          欢迎阅读《用户协议》(以下简称"本协议")。本协议阐述之条款和条件适用于您（以下简称"用户"）使用APP的各种产品和服务。
        </p>

        <section class="mb-8">
          <h3 class="text-lg font-semibold mb-3 text-white border-b border-gray-700 pb-2">1. 服务协议的确认</h3>
          <div class="pl-4 space-y-4">
            <p class="leading-relaxed text-gray-300">
              <strong class="text-gray-200"></strong>
              重庆LawGo科技有限公司及相关关联企业（以下合称"本公司"）同意按照本协议的规定及其不时发布的操作规则提供基于互联网移动网的相关服务（以下简称"网络服务"）。
            </p>
            <p class="leading-relaxed text-gray-300">
              <strong class="text-gray-200"></strong>
              网络服务使用人（以下简称"用户"）应当基于了解本协议全部内容、在独立思考的基础上认可、同意本协议的全部条款并按照页面上的提示完成全部的注册程序，用户的注册、登录、使用等行为将视为完全接受本协议及本公司公示的各项规则、规范。
            </p>
            <p class="leading-relaxed text-gray-300">
              <strong class="text-gray-200"></strong> 本公司享有对APP、官方网站上一切活动的监督、提示、检查、纠正等权利。
            </p>
          </div>
        </section>

        <section class="mb-8">
          <h3 class="text-lg font-semibold mb-3 text-white border-b border-gray-700 pb-2">2. 服务内容</h3>
          <div class="pl-4 space-y-4">
            <p class="leading-relaxed text-gray-300">
              <strong class="text-gray-200">2.1</strong>
              网络服务的具体内容由本公司根据实际情况提供，包括但不限于授权用户通过其帐号上传、搜索相关内容。本公司保留随时变更、中断或终止部分或全部网络服务的权利。
            </p>
          </div>
        </section>

        <section class="text-sm text-gray-500 mt-12 border-t border-gray-700 pt-4">
          <p>重庆LawGo科技有限公司 版权所有</p>
          <p>©2025 CQ LawGo Technology Co., Ltd. All Rights Reserved.</p>
        </section>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.legal-document {
  counter-reset: section;
}

.legal-document h3 {
  counter-increment: section;
  counter-reset: subsection;
}

.legal-document p strong::before {
  content: counter(section) "." counter(subsection, decimal) " ";
  counter-increment: subsection;
}

/* 暗色模式滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #374151;
}

::-webkit-scrollbar-thumb {
  background: #4B5563;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6B7280;
}
</style>