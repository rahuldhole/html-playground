<script setup>
useHead({
  link: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: "https://playonweb.org/favicon.ico",
    },
  ],
});
</script>
<template>
  <div class="h-screen bg-app overflow-hidden">
    <ClientOnly>
      <slot />
    </ClientOnly>
  </div>
</template>

<style>
/* Global layout styles */
body {
  margin: 0;
  padding: 0;
}
</style>
