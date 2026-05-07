<template>
  <div id="output-container" ref="container" class="flex flex-col h-full relative">
    <div class="flex flex-row items-center justify-between p-2 bg-gray-200 dark:bg-gray-700 rounded-t-lg">
      <div class="flex flex-wrap items-center gap-2 sm:gap-3">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Output</h2>
        
        <!-- Show the switch button conditionally -->
        <button @click="handleSwitchToEditor"
          class="bg-yellow-300 hover:bg-yellow-400 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-gray-800 dark:text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm transition-colors">
          Edit Code
        </button>
        
        <button @click="toggleOutputTheme"
          class="hidden sm:flex items-center gap-1 sm:gap-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-2 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm transition-colors"
          :class="{ 'bg-gray-500 dark:bg-gray-700': editorStore.isOutputDark }">
          <span>Force Dark</span>
          <div class="relative inline-flex items-center">
            <input type="checkbox" v-model="editorStore.isOutputDark" class="sr-only peer" @change="updateOutput" />
            <div
              class="w-6 sm:w-8 h-3 sm:h-4 bg-gray-400 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-2 sm:after:h-3 after:w-2 sm:after:w-3 after:transition-all peer-checked:bg-blue-500 dark:peer-checked:bg-blue-600">
            </div>
          </div>
        </button>
      </div>
      
      <!-- Desktop Actions -->
      <div class="hidden sm:flex flex-wrap items-center gap-2 sm:gap-3">
        <button @click="takeScreenshot"
          class="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm transition-colors">
          Screenshot
        </button>
        <button @click="shareOutput"
          class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm transition-colors">
          {{ shareButtonText }}
        </button>
        <button @click="openInNewTab" class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white p-1 sm:p-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" height="20" width="20"
            class="feather feather-external-link sm:h-5 sm:w-5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1-2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </button>
        <button @click="toggleFullscreenHandler"
          class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white px-2 py-1 transition-colors">
          <svg v-if="isOutputFullscreen" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="feather feather-minimize sm:w-6 sm:h-6">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1-2 2v3" />
          </svg>
          <svg v-else class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 4H4v4m4-4L3 9m13-5h4v4m-4-4l5 5m-5 11h4v-4m-4 4l5-5m-11 5H4v-4m4 4l-5-5" />
          </svg>
        </button>
      </div>
      
      <!-- Mobile Dropdown Menu -->
      <div class="sm:hidden">
        <EditorDropdownMenu>
          <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
            <div class="flex items-center justify-between gap-2">
              <span class="text-sm text-gray-700 dark:text-gray-300">Force Dark Mode</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="editorStore.isOutputDark" class="sr-only peer" @change="updateOutput" />
                <div
                  class="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500 dark:peer-checked:bg-blue-600">
                </div>
              </label>
            </div>
          </div>
          <button @click="takeScreenshot"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
            Take Screenshot
          </button>
          <button @click="shareOutput"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
            {{ shareButtonText }}
          </button>
          <button @click="openInNewTab"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
            Open in New Tab
          </button>
          <button @click="toggleFullscreenHandler"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
            {{ fullScreenStore.isOutputFullscreen ? 'Exit Fullscreen' : 'Fullscreen' }}
          </button>
        </EditorDropdownMenu>
      </div>
    </div>
    <div class="w-full h-[300px] sm:h-[400px] md:h-[calc(100vh-300px)] lg:h-[calc(100vh-200px)] p-2 sm:p-4 rounded-b-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-auto flex-grow"
      :class="{ '!h-[calc(100vh-60px)] !max-h-[calc(100vh-60px)]': isOutputFullscreen }">
      <iframe ref="outputFrame" class="w-full h-full border-none" />
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