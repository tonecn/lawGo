<script setup lang="ts">
import {
  // BadgeCheck,
  ChevronsUpDown,
  LogOut,
} from 'lucide-vue-next'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { computed, nextTick, ref } from 'vue'
import { userVM } from '@/lib/app_vm/userVM'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter();
const user = computed(() => {
  return {
    name: userVM.data.user?.username,
    phone: userVM.data.user?.phone,
  }
})

const { isMobile } = useSidebar()
const logoutDialogOpen = ref(false);
const handleLogout = () => {
  userVM.logout();
  toast.success('退出成功');
  router.push({ name: 'login' });
}
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage :src="''" :alt="user.name" />
              <AvatarFallback class="rounded-lg">
                CN
              </AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ user.name }}</span>
              <span class="truncate text-xs">{{ user.phone }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'" align="end" :side-offset="4">
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage :src="''" :alt="user.name" />
                <AvatarFallback class="rounded-lg">
                  CN
                </AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ user.name }}</span>
                <span class="truncate text-xs">{{ user.phone }}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <!-- <DropdownMenuGroup>
            <DropdownMenuItem>
              <BadgeCheck />
              账户
            </DropdownMenuItem>
          </DropdownMenuGroup> -->
          <DropdownMenuItem @click="nextTick(() => logoutDialogOpen = true)">
            <LogOut />
            登出
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
  <AlertDialog v-model:open="logoutDialogOpen">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>是否要退出登录？</AlertDialogTitle>
        <AlertDialogDescription>
          该操作会暂时移除您的登录态，可稍后再重新登录
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>取消</AlertDialogCancel>
        <AlertDialogAction @click="handleLogout">确定</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
