<template>
  <div class="flex-1 flex flex-col md:flex-row h-full p-2 md:p-4 gap-2 md:gap-0 overflow-hidden bg-gray-50 dark:bg-gray-950" 
    ref="containerRef"
    :class="{ 'pointer-events-none-iframes': isResizing }">
    <ClientOnly>
      <!-- Editor Panel -->
      <div 
        class="min-w-0 h-full flex flex-col transition-all duration-75"
        :style="isMobile ? 'height: 50%; width: 100%' : { width: splitPercent + '%' }"
      >
        <EditorPanel />
      </div>
      
      <!-- Resize Handle (Desktop Only) -->
      <div 
        v-if="!isMobile"
        class="group relative w-2 h-full flex items-center justify-center cursor-col-resize hover:bg-indigo-500/10 transition-colors z-10"
        @mousedown="startResize"
      >
        <div class="w-[1px] h-8 bg-gray-200 dark:bg-gray-800 group-hover:bg-indigo-500 group-hover:h-12 transition-all rounded-full"></div>
      </div>

      <!-- Output Panel -->
      <div 
        class="min-w-0 h-full flex flex-col transition-all duration-75"
        :style="isMobile ? 'height: 50%; width: 100%' : { width: (100 - splitPercent) + '%' }"
      >
        <EditorOutputPanel />
      </div>
      
      <template #fallback>
        <div class="flex-1 flex items-center justify-center">
          <Icon name="heroicons:arrow-path" class="w-10 h-10 text-indigo-500 animate-spin" />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

const containerRef = ref<HTMLElement | null>(null)
const splitPercent = ref(50)
const isResizing = ref(false)
const { width } = useWindowSize()

const isMobile = computed(() => width.value < 768)

const startResize = (e: MouseEvent) => {
  isResizing.value = true
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}

const handleResize = (e: MouseEvent) => {
  if (!isResizing.value || !containerRef.value) return
  
  const containerRect = containerRef.value.getBoundingClientRect()
  const newPercent = ((e.clientX - containerRect.left) / containerRect.width) * 100
  
  // Constraints: 15% to 85%
  if (newPercent > 15 && newPercent < 85) {
    splitPercent.value = newPercent
  }
}

const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

onUnmounted(() => {
  stopResize()
})
</script>

<style scoped>
/* Prevent iframe from stealing mouse events during resize */
.pointer-events-none-iframes :deep(iframe) {
  pointer-events: none !important;
}
</style>