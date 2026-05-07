<template>
  <div id="output-container" ref="container" class="flex flex-col h-full bg-card shadow-sm rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300">
    <!-- Ultra Minimal Header -->
    <div class="group/header flex items-center justify-between px-4 h-10 bg-gray-50/30 dark:bg-gray-950/30 border-b border-gray-100 dark:border-gray-900 transition-colors hover:bg-gray-50 dark:hover:bg-gray-950">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] select-none">
          <Icon name="heroicons:globe-alt" class="w-3.5 h-3.5" />
          <span>Preview</span>
        </div>
        
        <!-- Navigation -->
        <div class="flex items-center gap-1">
          <button v-if="isOutputFullscreen" @click="handleSwitchToEditor"
            class="px-2 py-1 rounded-md text-[10px] font-bold uppercase text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">
            Editor
          </button>
          
          <div v-if="isOutputFullscreen" class="w-[1px] h-3 bg-gray-200 dark:bg-gray-800 mx-1"></div>
          
          <div class="flex items-center gap-0.5">
            <button @click="outputIframe" class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Reload Preview">
              <Icon name="heroicons:arrow-path" class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-1.5">
        <button @click="toggleOutputTheme"
          class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          :class="{ 'text-indigo-500': editorStore.isOutputDark }"
          title="Toggle Force Dark Mode">
          <Icon :name="editorStore.isOutputDark ? 'heroicons:moon' : 'heroicons:sun'" class="w-4 h-4" />
        </button>
        
        <button @click="takeScreenshot"
          class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          title="Take Screenshot">
          <Icon name="heroicons:camera" class="w-4 h-4" />
        </button>
        
        <button @click="openInNewTab"
          class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          title="Open in New Tab">
          <Icon name="heroicons:arrow-top-right-on-square" class="w-4 h-4" />
        </button>
        
        <button @click="shareOutput"
          class="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
          :title="shareButtonText">
          <Icon :name="shareButtonText === 'Copied!' ? 'heroicons:check' : 'heroicons:share'" class="w-4 h-4" />
        </button>
        
        <button @click="toggleFullscreenHandler"
          class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all">
          <Icon :name="isOutputFullscreen ? 'heroicons:arrows-pointing-in' : 'heroicons:arrows-pointing-out'" class="w-4 h-4" />
        </button>
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