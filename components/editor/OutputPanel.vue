<template>
  <div id="output-container" ref="container" class="flex flex-col h-full bg-card shadow-sm rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-300">
    <!-- Ultra Minimal Header -->
    <div class="group/header flex items-center justify-between px-2 md:px-4 h-10 bg-gray-50/30 dark:bg-gray-950/30 border-b border-gray-100 dark:border-gray-900 transition-colors hover:bg-gray-50 dark:hover:bg-gray-950">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] select-none">
          <Icon name="heroicons:globe-alt" class="w-3.5 h-3.5" />
          <span v-if="!isCompact">Preview</span>
        </div>
        
        <!-- Navigation -->
        <div class="flex items-center gap-1">
          <button v-if="isOutputFullscreen" @click="handleSwitchToEditor"
            class="px-2 py-1 rounded-md text-[10px] font-bold uppercase text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">
            Editor
          </button>
          
          <div v-if="isOutputFullscreen" class="w-[1px] h-3 bg-gray-200 dark:bg-gray-800 mx-1"></div>
          
          <div class="flex items-center gap-0.5">
            <button @click="updateOutput" class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Reload Preview">
              <Icon name="heroicons:arrow-path" class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-1.5">
        <template v-if="!isMobile">
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
        </template>
        
        <template v-else>
          <div class="relative">
            <button @click.stop="showMobileMenu = !showMobileMenu"
              class="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <Icon name="heroicons:bars-3-bottom-right" class="w-4 h-4" />
            </button>
            
            <!-- Mobile Actions Dropdown -->
            <div v-if="showMobileMenu" class="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-1.5 z-50">
              <button @click="toggleOutputTheme(); showMobileMenu = false" class="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-[11px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                <Icon :name="editorStore.isOutputDark ? 'heroicons:moon' : 'heroicons:sun'" class="w-4 h-4" />
                <span>{{ editorStore.isOutputDark ? 'Light' : 'Dark' }} Mode Preview</span>
              </button>
              <button @click="takeScreenshot(); showMobileMenu = false" class="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-[11px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                <Icon name="heroicons:camera" class="w-4 h-4" />
                <span>Take Screenshot</span>
              </button>
            </div>
          </div>
        </template>
        
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
    <div class="flex-grow relative overflow-hidden"
      :class="[editorStore.isOutputDark ? 'bg-[#15171e]' : 'bg-white', { 'fixed inset-0 z-50': isOutputFullscreen }]">
      <div class="absolute inset-0">
        <iframe 
          ref="iframe1" 
          class="absolute inset-0 w-full h-full border-none"
          :class="activeIframe === 1 ? 'z-10 opacity-100' : 'z-0 opacity-0'"
          sandbox="allow-same-origin allow-scripts allow-modals allow-popups allow-forms"
        />
        <iframe 
          ref="iframe2" 
          class="absolute inset-0 w-full h-full border-none"
          :class="activeIframe === 2 ? 'z-10 opacity-100' : 'z-0 opacity-0'"
          sandbox="allow-same-origin allow-scripts allow-modals allow-popups allow-forms"
        />
      </div>
      
      <!-- Loading Overlay -->
      <div v-if="!editorStore.htmlCode" class="absolute inset-0 flex items-center justify-center bg-gray-50/80 z-20">
        <div class="text-center">
          <Icon name="heroicons:document-text" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500 font-medium">Waiting for code...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, onUnmounted } from 'vue'
import EditorDropdownMenu from './EditorDropdownMenu.vue'
import html2canvas from 'html2canvas'
import { useEditorStore } from '~/stores/editor'
import { useEditor } from '~/composables/useEditor'
import { useFullScreenStore } from '~/stores/fullScreenStore'
import { useFullscreen, useElementSize, useThrottleFn } from '@vueuse/core'

const container = ref<HTMLElement | null>(null)
const iframe1 = ref<HTMLIFrameElement | null>(null)
const iframe2 = ref<HTMLIFrameElement | null>(null)
const editorStore = useEditorStore()

// Double buffering state
const activeIframe = ref(1)
const lastBlobUrl = ref<string | null>(null)

// Responsiveness
const { width: containerWidth } = useElementSize(container)
const isCompact = computed(() => containerWidth.value < 500)
const isNarrow = computed(() => containerWidth.value < 400)
const isMobile = isNarrow
const showMobileMenu = ref(false)

const { getCodeFromUrl, shareOutput, shareButtonText } = useEditor()

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

// Function to wrap code in a template with theme support
const wrapHtml = (code: string) => {
  return `
    <!DOCTYPE html>
    <html style="height: 100%;">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          background-color: ${editorStore.isOutputDark ? '#15171e' : '#ffffff'};
          color: ${editorStore.isOutputDark ? '#ffffff' : '#000000'};
          font-family: Arial, sans-serif;
          transition: background-color 0.3s, color 0.3s;
        }
      </style>
    </head>
    <body>
    ${code}
    </body>
    </html>
  `
}

const updateOutput = () => {
  const content = editorStore.htmlCode || '<h1>No content available</h1>'
  const fullHtml = wrapHtml(content)
  
  const nextIframeNum = activeIframe.value === 1 ? 2 : 1
  const nextIframe = nextIframeNum === 1 ? iframe1.value : iframe2.value
  
  if (!nextIframe) return

  const blob = new Blob([fullHtml], { type: 'text/html' })
  const url = URL.createObjectURL(blob)

  // Track the current update to avoid race conditions
  const currentUpdateUrl = url

  const onLoad = () => {
    // Only swap if this is still the latest update
    if (nextIframe.src === currentUpdateUrl) {
      activeIframe.value = nextIframeNum
      
      // Clean up previous blob URL after a short delay to ensure swap is smooth
      if (lastBlobUrl.value) {
        const oldUrl = lastBlobUrl.value
        setTimeout(() => URL.revokeObjectURL(oldUrl), 1000)
      }
      lastBlobUrl.value = currentUpdateUrl
    }
    nextIframe.removeEventListener('load', onLoad)
  }

  nextIframe.addEventListener('load', onLoad)
  nextIframe.src = url
}

// Throttled version for streaming and rapid edits
const throttledUpdate = useThrottleFn(() => {
  updateOutput()
}, 250) // Update at most every 250ms during streaming

// Watch for code changes to update automatically
watch(() => editorStore.htmlCode, () => {
  if (editorStore.liveRun) {
    throttledUpdate()
  }
})

// Watch for manual refresh triggers
watch(() => editorStore.refreshCounter, () => {
  updateOutput()
})

// Initialize iframe content on mount
onMounted(async () => {
  const code = await getCodeFromUrl()
  if (code) {
    editorStore.htmlCode = code
  }
  updateOutput()
})

onUnmounted(() => {
  if (lastBlobUrl.value) {
    URL.revokeObjectURL(lastBlobUrl.value)
  }
})

const toggleOutputTheme = () => {
  editorStore.setOutputDark(!editorStore.isOutputDark)
  updateOutput()
}

const openInNewTab = async () => {
  const content = editorStore.htmlCode || '<h1>No content available</h1>'
  const blob = new Blob([wrapHtml(content)], { type: 'text/html' })
  window.open(URL.createObjectURL(blob), '_run')
}

const takeScreenshot = () => {
  // Get the active iframe for screenshot
  const iframe = activeIframe.value === 1 ? iframe1.value : iframe2.value;
  if (iframe && iframe.contentDocument?.body) {
    html2canvas(iframe.contentDocument.body).then(canvas => {
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

iframe {
  background-color: v-bind('editorStore.isOutputDark ? "#15171e" : "#ffffff"');
}
</style>