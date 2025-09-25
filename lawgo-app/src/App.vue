<script setup lang="ts">
import { Toaster } from './components/ui/sonner';
import 'vue-sonner/style.css';

</script>
<template>
  <Toaster />
  <router-view v-slot="{ Component }">
    <KeepAlive>
      <component :is="Component" />
    </KeepAlive>
  </router-view>
</template>
