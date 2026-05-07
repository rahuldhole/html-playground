<script setup lang="ts">
const layout = useState('layout', () => '');
</script>
<template>
  <div>
    <NuxtLayout :layout="layout" :key="layout">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
