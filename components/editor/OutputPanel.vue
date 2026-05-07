<template>
  <div id="output-container" ref="container" class="flex flex-col h-full bg-card shadow-sm rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
    <!-- Browser Window Header -->
    <div class="flex flex-col bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 backdrop-blur-sm">
      <!-- Window Controls & Tabs -->
      <div class="flex items-center justify-between px-4 py-2">
        <div class="flex items-center gap-6">
          <!-- Dots -->
          <div class="flex gap-1.5">
            <div class="w-3 h-3 rounded-full bg-red-400"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div class="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          
          <div class="flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-800 rounded-t-lg border-x border-t border-gray-200 dark:border-gray-700 -mb-[9px] relative z-10">
            <Icon name="heroicons:globe-alt" class="w-3.5 h-3.5 text-gray-400" />
            <span class="text-[11px] font-medium text-gray-600 dark:text-gray-300">Live Preview</span>
            <Icon name="heroicons:x-mark" class="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-pointer" />
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button @click="handleSwitchToEditor"
            class="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors">
            <Icon name="heroicons:pencil-square" class="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          
          <button @click="toggleFullscreenHandler"
            class="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <Icon :name="isOutputFullscreen ? 'heroicons:arrows-pointing-in' : 'heroicons:arrows-pointing-out'" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Address Bar Area -->
      <div class="flex items-center gap-3 px-4 py-2 border-t border-gray-200 dark:border-gray-800">
        <div class="flex items-center gap-2">
          <button class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <Icon name="heroicons:arrow-left" class="w-4 h-4" />
          </button>
          <button class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <Icon name="heroicons:arrow-right" class="w-4 h-4" />
          </button>
          <button @click="outputIframe" class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <Icon name="heroicons:arrow-path" class="w-4 h-4" />
          </button>
        </div>

        <!-- URL Bar -->
        <div class="flex-1 flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-inner">
          <Icon name="heroicons:lock-closed" class="w-3 h-3 text-green-500" />
          <span class="text-xs text-gray-400 select-none">localhost:3000/preview</span>
        </div>

        <div class="flex items-center gap-1.5">
          <button @click="toggleOutputTheme"
            class="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all shadow-sm"
            :class="{ 'bg-gray-800 text-white': editorStore.isOutputDark }"
            title="Toggle Force Dark Mode">
            <Icon name="heroicons:moon" class="w-4 h-4" />
          </button>
          
          <button @click="takeScreenshot"
            class="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all shadow-sm"
            title="Take Screenshot">
            <Icon name="heroicons:camera" class="w-4 h-4" />
          </button>
          
          <button @click="openInNewTab"
            class="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all shadow-sm"
            title="Open in New Tab">
            <Icon name="heroicons:arrow-top-right-on-square" class="w-4 h-4" />
          </button>
          
          <button @click="shareOutput"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 text-xs font-semibold">
            <Icon name="heroicons:share" class="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Output Content -->
    <div class="flex-grow bg-white relative overflow-hidden"
      :class="{ 'fixed inset-0 z-50': isOutputFullscreen }">
      <iframe ref="outputFrame" class="w-full h-full border-none" />
      
      <!-- Loading Overlay -->
      <div v-if="!editorStore.htmlCode" class="absolute inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm">
        <div class="text-center">
          <Icon name="heroicons:document-text" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500 font-medium">Waiting for code...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import EditorDropdownMenu from './EditorDropdownMenu.vue'
import html2canvas from 'html2canvas'
import { useEditorStore } from '~/stores/editor'
import { useEditor } from '~/composables/useEditor'
import { useFullScreenStore } from '~/stores/fullScreenStore'
import { useFullscreen } from '@vueuse/core'

const container = ref<HTMLElement | null>(null)
const outputFrame = ref<HTMLIFrameElement | null>(null)
const editorStore = useEditorStore()

const { getCodeFromUrl, shareOutput, updateOutput, shareButtonText } = useEditor()

// Use the fullscreen store
const fullScreenStore = useFullScreenStore()

// Fullscreen handling using vueuse
const { isFullscreen: isOutputFullscreen, toggle: toggleFullscreen } = useFullscreen(container)

// Fullscreen handlers
const toggleFullscreenHandler = () => {
  toggleFullscreen()
  fullScreenStore.isOutputFullscreen = isOutputFullscreen.value
}

const handleSwitchToEditor = async () => {
  await fullScreenStore.handleSwitchToEditor()
}

const outputIframe = async () => {
  const htmlContent = editorStore.htmlCode || '<h1>No content available</h1>'
  const blob = new Blob([htmlContent], { type: 'text/html' })
  if (outputFrame.value) {
    outputFrame.value.src = URL.createObjectURL(blob)
  }
}

// Initialize iframe content on mount
onMounted(async () => {
  const code = await getCodeFromUrl()
  if (code) {
    editorStore.htmlCode = code
  }
  outputIframe()
})

const toggleOutputTheme = () => {
  editorStore.setOutputDark(!editorStore.isOutputDark)
  updateOutput()
}

const openInNewTab = async () => {
  const htmlContent = editorStore.htmlCode || '<h1>No content available</h1>'
  const blob = new Blob([htmlContent], { type: 'text/html' })
  window.open(URL.createObjectURL(blob), '_run')
}

const takeScreenshot = () => {
  // Get the iframe content for screenshot
  const iframe = outputFrame.value;
  if (iframe && iframe.contentDocument?.body) {
    html2canvas(iframe.contentDocument.body).then(canvas => {
      // Create download link
      const link = document.createElement('a');
      link.download = 'output-screenshot.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }
}

// Expose methods for parent component
defineExpose({
  updateOutput
})
</script>

<style scoped>
/* Ensure fullscreen container takes full height */
.flex-col {
  display: flex;
  flex-direction: column;
}

.flex-grow {
  flex-grow: 1;
}
</style>