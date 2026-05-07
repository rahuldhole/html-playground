<template>
  <div class="flex-1 flex flex-col md:flex-row h-full p-4 gap-4 overflow-hidden bg-gray-50 dark:bg-gray-950">
    <ClientOnly>
      <!-- Editor Panel -->
      <div id="editor-container" class="flex-1 min-w-0 h-full">
        <EditorPanel />
      </div>
      
      <!-- Output Panel -->
      <div id="output-container" class="flex-1 min-w-0 h-full">
        <EditorOutputPanel />
      </div>
      
      <!-- Fallback while client is loading -->
      <template #fallback>
        <div class="flex-1 flex items-center justify-center">
          <Icon name="heroicons:arrow-path" class="w-10 h-10 text-indigo-500 animate-spin" />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
</script>