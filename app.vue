<script setup lang="ts">
const layout = useState('layout', () => '');
</script>
<template>
  <div class="antialiased selection:bg-indigo-100 dark:selection:bg-indigo-900/50">
    <NuxtLayout :layout="layout" :key="layout">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(0.5rem);
}
</style>
