<script setup lang="ts">
defineRouteRules({
  prerender: true
})
import { ClientOnly } from '#components';

</script>

<template>
  <div class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 p-6">
    <div class="max-w-4xl mx-auto space-y-8">
      <header class="text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Icon name="heroicons:bolt" class="w-4 h-4" />
          <span>Optimization Tool</span>
        </div>
        <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Brotli Compression
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          High-performance text compression using the Brotli algorithm. Fast, efficient, and optimized for modern web standards.
        </p>
      </header>

      <ClientOnly>
        <BrotliDemo />
        <template #fallback>
          <div class="flex items-center justify-center py-20">
            <Icon name="heroicons:arrow-path" class="w-10 h-10 text-indigo-500 animate-spin" />
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>