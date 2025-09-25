<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'

</script>
<template>
  <Toaster />
  <SidebarProvider v-if="$route.meta.withSideBar === true">
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2">
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <div class="h-4 mr-2 border-r border-zinc-400"></div>
          <span class="text-sm text-zinc-700">{{ new Date().toLocaleDateString() }}</span>
        </div>
      </header>
      <div class="flex-1 flex flex-col overflow-hidden p-4 pt-0">
        <router-view v-slot="{ Component }">
          <KeepAlive>
            <component :is="Component" />
          </KeepAlive>
        </router-view>
      </div>
    </SidebarInset>
  </SidebarProvider>
  <div v-else class="w-full h-[100vh] flex flex-col">
    <router-view />
  </div>
</template>
