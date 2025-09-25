<script setup lang="ts">
import { type LucideIcon } from 'lucide-vue-next'
import {
  Collapsible,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

defineProps<{
  items: {
    title: string
    routerName: string
    icon: LucideIcon
  }[]
}>()
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>Platform</SidebarGroupLabel>
    <SidebarMenu>
      <Collapsible v-for="item in items" :key="item.title" as-child>
        <SidebarMenuItem>
          <SidebarMenuButton as-child :tooltip="item.title"
            :class="$route.name === item.routerName && 'bg-[var(--sidebar-accent)]'">
            <RouterLink :to="{ name: item.routerName }">
              <component :is="item.icon" />
              <span>{{ item.title }}</span>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  </SidebarGroup>
</template>
