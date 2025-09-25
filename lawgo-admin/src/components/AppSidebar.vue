<script setup lang="ts">
import {
  Command,
  // Gauge,
  MessageSquare,
  User,
} from 'lucide-vue-next'

import NavMain from '@/components/NavMain.vue'
import NavUser from '@/components/NavUser.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  type SidebarProps,
} from '@/components/ui/sidebar'

const props = withDefaults(defineProps<SidebarProps>(), {
  variant: 'inset',
})

const data = {
  navMain: [
    // {
    //   title: '概况',
    //   routerName: 'home',
    //   icon: Gauge,
    // },
    {
      title: '用户管理',
      routerName: 'user',
      icon: User,
    },
    {
      title: '对话管理',
      routerName: 'chatHistory',
      icon: MessageSquare,
    },
  ],
}
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child>
            <a>
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Command class="size-4" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-medium">LawGo</span>
                <span class="truncate text-xs">AI法律援助助手 管理后台</span>
              </div>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser />
    </SidebarFooter>
  </Sidebar>
</template>
