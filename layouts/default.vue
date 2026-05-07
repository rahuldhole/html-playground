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
  <div class="flex h-screen overflow-hidden">
    <AppSidebar />
    <main class="flex-1 flex flex-col min-w-0 bg-app overflow-hidden">
      <ClientOnly>
        <slot />
      </ClientOnly>
    </main>
  </div>
</template>

<style>
/* Global layout styles */
body {
  margin: 0;
  padding: 0;
}
</style>
