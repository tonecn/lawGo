<template>
  <div class="flex flex-col justify-between h-[100dvh] p-3"
       style="background: linear-gradient(to bottom, #3d374b, #191b23 20%)">
    <!-- 顶部导航栏 -->
    <div>
      <div class="h-5"></div>
      <div class="flex items-center">
        <span class="flex-1">
          <IconButton @click="$router.push({ name: 'mine' })">
            <ArrowLeft class="size-5" />
          </IconButton>
        </span>
        <span class="flex-1 text-center text-xl text-white">隐私政策</span>
        <span class="flex-1"></span>
      </div>
      <div class="h-3"></div>
    </div>

    <!-- 隐私政策内容 -->
    <div class="flex-1 overflow-x-hidden overflow-y-auto">
      <div class="text-white p-4">
        <!-- <h1 class="text-2xl font-bold mb-6 text-center">隐私政策</h1> -->
        
        <section class="mb-6">
          <h2 class="text-xl font-semibold mb-3">1. 信息收集</h2>
          <p class="text-gray-300">我们可能会收集您在使用我们服务时提供的个人信息，包括但不限于姓名、电子邮件地址、联系方式等。</p>
        </section>
        
        <section class="mb-6">
          <h2 class="text-xl font-semibold mb-3">2. 信息使用</h2>
          <p class="text-gray-300 mb-2">我们收集的信息可能用于：</p>
          <ul class="list-disc pl-5 text-gray-300">
            <li class="mb-1">提供、维护和改进我们的服务</li>
            <li class="mb-1">响应您的请求和问题</li>
            <li class="mb-1">发送重要的通知，如政策变更</li>
            <li>用于分析和研究，以改进用户体验</li>
          </ul>
        </section>
        
        <section class="mb-6">
          <h2 class="text-xl font-semibold mb-3">3. 信息共享</h2>
          <p class="text-gray-300 mb-2">我们不会将您的个人信息出售给第三方。仅在以下情况下，我们可能会共享您的信息：</p>
          <ul class="list-disc pl-5 text-gray-300">
            <li class="mb-1">获得您的明确同意</li>
            <li class="mb-1">根据法律法规要求</li>
            <li>为保护我们或他人的权利、财产或安全</li>
          </ul>
        </section>
        
        <section class="mb-6">
          <h2 class="text-xl font-semibold mb-3">4. Cookie和类似技术</h2>
          <p class="text-gray-300">我们使用Cookie和类似技术来增强用户体验，分析趋势和管理网站。</p>
        </section>
        
        <section class="mb-6">
          <h2 class="text-xl font-semibold mb-3">5. 数据安全</h2>
          <p class="text-gray-300">我们采取合理的安全措施保护您的信息，但请注意没有任何互联网传输或电子存储方法是100%安全的。</p>
        </section>
        
        <section class="mb-6">
          <h2 class="text-xl font-semibold mb-3">6. 政策变更</h2>
          <p class="text-gray-300">我们可能会不时更新本隐私政策。更新后的政策将在本页面发布，并更新顶部的"最后更新"日期。</p>
        </section>
        
        <section class="mb-6">
          <h2 class="text-xl font-semibold mb-3">7. 联系我们</h2>
          <p class="text-gray-300">如果您对本隐私政策有任何疑问，请通过以下方式联系我们：</p>
          <!-- <p class="text-gray-300">邮箱：privacy@example.com</p> -->
        </section>
        
        <!-- <p class="text-gray-400 text-right italic">最后更新日期：2023年11月1日</p> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconButton from '@/components/IconButton.vue';
import { ArrowLeft } from 'lucide-vue-next';
</script>

<style scoped>
/* 可以保留原有的样式或根据需要调整 */
</style>