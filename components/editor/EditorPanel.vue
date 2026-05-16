<template>
  <div id="editor-container" ref="container" class="flex flex-col h-full bg-card shadow-sm rounded-2xl border border-gray-200 dark:border-gray-800 transition-all duration-300 relative">
    <!-- Ultra Minimal Header -->
    <div class="group/header relative z-[100] flex items-center justify-between px-2 md:px-4 h-10 bg-gray-50/30 dark:bg-gray-950/30 border-b border-gray-100 dark:border-gray-900 transition-colors hover:bg-gray-50 dark:hover:bg-gray-950 rounded-t-2xl">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] select-none">
          <Icon name="heroicons:code-bracket" class="w-3.5 h-3.5" />
          <span v-if="!isCompact">Editor</span>
        </div>
        
        <!-- Actions -->
        <div class="flex items-center gap-1">
          <!-- Desktop View: Show everything -->
          <template v-if="!isMobile">
            <div class="relative">
              <button @click.stop="showMenuPopup = !showMenuPopup"
                class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm">
                <Icon name="heroicons:squares-plus" class="w-3.5 h-3.5" />
                <span v-if="!isCompact">Templates</span>
              </button>
              <BoilerplateMenu v-model="showMenuPopup" @select="loadBoilerplate" />
            </div>

            <div class="relative ml-1">
              <AIPopover
                :is-mobile="false"
                :is-compact="isCompact"
                :is-edit-mode="isEditMode"
                :is-a-i-loading="isAILoading"
                :ai-reasoning="aiReasoning"
                :ai-status-text="aiStatusText"
                :model-options="modelOptions"
                :current-model="currentModel"
                v-model:show-a-i-popup="showAIPopup"
                v-model:ai-prompt="aiPrompt"
                v-model:selected-model="selectedModel"
                @submit="handleAISubmit"
                @cancel="handleCancelAI"
                @open-settings="showSettings = true"
              />
            </div>

            <div class="w-[1px] h-3 bg-gray-200 dark:bg-gray-800 mx-1"></div>

            <div class="flex items-center gap-0.5">
              <button @click="handleUndo" title="Undo"
                class="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">
                <Icon name="heroicons:arrow-uturn-left" class="w-3.5 h-3.5" />
              </button>
              <button @click="handleRedo" title="Redo"
                class="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">
                <Icon name="heroicons:arrow-uturn-right" class="w-3.5 h-3.5" />
              </button>
            </div>

            <div class="w-[1px] h-3 bg-gray-200 dark:bg-gray-800 mx-1"></div>

            <div class="flex items-center gap-0.5">
              <button @click="handleCopy" :title="isCopied ? 'Copied!' : 'Copy All'"
                class="p-1.5 rounded-md transition-all"
                :class="isCopied ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'">
                <Icon :name="copyIcon" class="w-3.5 h-3.5" />
              </button>
              <button @click="handleBeautify" title="Beautify Code"
                class="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">
                <Icon name="lucide:wand-2" class="w-3.5 h-3.5" />
              </button>
              <button @click="handleClear" title="Clear Editor"
                class="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                <Icon name="heroicons:trash" class="w-3.5 h-3.5" />
              </button>
            </div>
          </template>

          <!-- Mobile View: Show only Templates and a "More" menu if needed, or just More -->
          <template v-else>
            <div class="relative">
              <button @click.stop="showMenuPopup = !showMenuPopup"
                class="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                <Icon name="heroicons:squares-plus" class="w-3.5 h-3.5" />
              </button>
              <BoilerplateMenu v-model="showMenuPopup" @select="loadBoilerplate" />
            </div>

            <div class="relative ml-1">
              <AIPopover
                :is-mobile="true"
                :is-compact="isCompact"
                :is-edit-mode="isEditMode"
                :is-a-i-loading="isAILoading"
                :ai-reasoning="aiReasoning"
                :ai-status-text="aiStatusText"
                :model-options="modelOptions"
                :current-model="currentModel"
                v-model:show-a-i-popup="showAIPopup"
                v-model:ai-prompt="aiPrompt"
                v-model:selected-model="selectedModel"
                @submit="handleAISubmit"
                @cancel="handleCancelAI"
              />
            </div>
            
            <div class="relative ml-1">
              <button @click.stop="showMobileMenu = !showMobileMenu"
                class="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                <Icon name="heroicons:bars-3-bottom-right" class="w-4 h-4" />
              </button>
              
              <!-- Mobile Actions Dropdown -->
              <div v-if="showMobileMenu" class="absolute top-full left-0 mt-1 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-1.5 z-50">
                <button @click="handleUndo(); showMobileMenu = false" class="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-[11px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                  <Icon name="heroicons:arrow-uturn-left" class="w-3.5 h-3.5" />
                  <span>Undo</span>
                </button>
                <button @click="handleRedo(); showMobileMenu = false" class="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-[11px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                  <Icon name="heroicons:arrow-uturn-right" class="w-3.5 h-3.5" />
                  <span>Redo</span>
                </button>
                <button @click="handleBeautify(); showMobileMenu = false" class="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-[11px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                  <Icon name="lucide:wand-2" class="w-3.5 h-3.5" />
                  <span>Beautify Code</span>
                </button>
                <div class="h-[1px] bg-gray-100 dark:bg-gray-700 my-1 mx-1"></div>
                <button @click="handleCopy(); showMobileMenu = false" class="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-[11px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                  <Icon :name="copyIcon" class="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </button>
                <button @click="handleClear(); showMobileMenu = false" class="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-[11px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                  <Icon name="heroicons:trash" class="w-3.5 h-3.5" />
                  <span>Clear Editor</span>
                </button>
              </div>
            </div>
          </template>
          
          <SettingsModal v-model="showSettings" />

          <div v-if="fullScreenStore.isEditorFullscreen" class="w-[1px] h-3 bg-gray-200 dark:bg-gray-800 mx-1"></div>
          
          <button v-if="fullScreenStore.isEditorFullscreen" @click="handleSwitchToOutput"
            class="px-2 py-1 rounded-md text-[10px] font-bold uppercase text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">
            Preview
          </button>
        </div>
      </div>
      
      <!-- Right Actions -->
      <div class="flex items-center gap-1.5">
        <button @click="toggleGlobalTheme"
          class="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
          title="Toggle Dark Mode">
          <Icon :name="isDarkMode ? 'heroicons:sun' : 'heroicons:moon'" class="w-4 h-4" />
        </button>

        <button @click="runCode" v-show="!liveRun"
          class="p-1.5 rounded-md text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
          title="Run Code">
          <Icon name="heroicons:play" class="w-4 h-4" />
        </button>
        
        <button @click="saveCode"
          class="p-1.5 rounded-md text-gray-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
          title="Save HTML">
          <Icon name="heroicons:arrow-down-tray" class="w-4 h-4" />
        </button>

        <div class="relative">
          <button @click.stop="showShareMenu = !showShareMenu"
            class="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
            :title="shareButtonText">
            <Icon :name="shareButtonText === 'Copied!' ? 'heroicons:check' : 'heroicons:share'" class="w-4 h-4" />
          </button>
          
          <EditorSharePopover v-model="showShareMenu" />
        </div>

        <button @click="toggleFullscreenHandler"
          class="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all">
          <Icon :name="fullScreenStore.isEditorFullscreen ? 'heroicons:arrows-pointing-in' : 'heroicons:arrows-pointing-out'" class="w-4 h-4" />
        </button>
      </div>
    </div>
    
    <!-- CodeMirror Editor Container -->
    <div
      class="relative flex-grow overflow-hidden bg-white dark:bg-[#282c34] rounded-b-2xl"
      :class="{ 'fixed inset-0 z-50': fullScreenStore.isEditorFullscreen }">
      <ClientOnly>
        <div ref="editorContainer" class="w-full h-full" :class="{'dark-editor': isDarkMode}"></div>
        <template #fallback>
          <div class="flex items-center justify-center w-full h-full">
             <Icon name="heroicons:arrow-path" class="w-5 h-5 text-gray-300 animate-spin" />
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { useMagicKeys, useFullscreen, useElementSize } from '@vueuse/core'
import { useColorMode } from '#imports'

import BoilerplateMenu from './BoilerplateMenu.vue'
import EditorSharePopover from './SharePopover.vue'
import AIPopover from './AIPopover.vue'

import { useEditorStore } from '~/stores/editor'
import { useEditor } from '~/composables/useEditor'
import { useFullScreenStore } from '~/stores/fullScreenStore'
import { useAIAssistant } from '~/composables/useAIAssistant'
import { useCodeMirrorEditor } from '~/composables/useCodeMirrorEditor'
import { useEditorCommands } from '~/composables/useEditorCommands'

const editorStore = useEditorStore()
const fullScreenStore = useFullScreenStore()
const { shareCode, shareOutput, saveCode, runCode, shareButtonText } = useEditor()

// Responsiveness
const container = ref<HTMLElement | null>(null)
const { width: containerWidth } = useElementSize(container)
const isCompact = computed(() => containerWidth.value < 650)
const isNarrow = computed(() => containerWidth.value < 400)
const isMobile = isNarrow 
const showMobileMenu = ref(false)
const showShareMenu = ref(false)
const showSettings = ref(false)
const showAIPopup = ref(false)
const userHasScrolledUp = ref(false)

const {
  aiPrompt,
  selectedModel,
  isAILoading,
  isEditMode,
  aiStatusText,
  aiReasoning,
  currentModel,
  modelOptions,
  handleAISubmit,
  handleCancelAI
} = useAIAssistant(showAIPopup, userHasScrolledUp)

const colorMode = useColorMode()
const isDarkMode = computed(() => colorMode.value === 'dark')

const liveRun = computed({
  get: () => editorStore.liveRun,
  set: (value) => {
    editorStore.setLiveRun(value)
    if(value==true) runCode();
  }
})

const editorContainer = ref<HTMLElement | null>(null)

const { editorView } = useCodeMirrorEditor(
  editorContainer,
  isDarkMode,
  liveRun,
  isAILoading,
  userHasScrolledUp,
  runCode
)

const {
  isCopied,
  copyIcon,
  handleUndo,
  handleRedo,
  handleCopy,
  handleClear,
  handleBeautify
} = useEditorCommands(() => editorView.value)

const aiInput = ref<HTMLTextAreaElement | null>(null)
const aiInputMobile = ref<HTMLTextAreaElement | null>(null)

watch(showAIPopup, async (val) => {
  if (val) {
    await nextTick()
    if (isMobile.value) {
      aiInputMobile.value?.focus()
    } else {
      aiInput.value?.focus()
    }
  }
})

const { isFullscreen: isEditorFullscreen, toggle: toggleFullscreen } = useFullscreen(container)

const toggleFullscreenHandler = () => {
  toggleFullscreen()
  fullScreenStore.isEditorFullscreen = isEditorFullscreen.value
}

const handleSwitchToOutput = async () => {
  const success = await fullScreenStore.handleSwitchToOutput()
  if (success) {
    setTimeout(() => {
      runCode()
    }, 150)
  }
}

const toggleGlobalTheme = () => {
  const newTheme = colorMode.value === 'dark' ? 'light' : 'dark'
  colorMode.preference = newTheme
  
  if (process.client) {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

const keys = useMagicKeys()
const isPaste = computed(() => (keys.ctrl_v?.value || keys.meta_v?.value) || false)

watch(isPaste, (newValue) => {
  if (newValue && liveRun.value) {
    setTimeout(() => {
      runCode();
    }, 100);
  }
})

const showMenuPopup = ref(false)

const loadBoilerplate = (fileName: string) => {
  fetch(`/boilerplates/${fileName}`)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to fetch ${fileName}`);
      return res.text();
    })
    .then(text => {
      editorStore.setHtmlCode(text);
      setTimeout(() => {
        runCode();
      }, 50);
    })
    .catch(err => {
      console.error('Error loading boilerplate:', err);
    });
}

watch(() => editorStore.fullscreenSwitch, async (newVal, oldVal) => {
  if (newVal !== oldVal && fullScreenStore.isEditorFullscreen) {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    }
    setTimeout(() => {
      if (container.value && container.value.requestFullscreen) {
        container.value.requestFullscreen()
          .catch(err => console.error("Error attempting to enable fullscreen:", err))
      }
    }, 100)
  }
})

onUnmounted(() => {
  handleCancelAI();
});
</script>
<style scoped>
/* Dirty fix editor scrollbar */
.cm-editor {
  height: 100%;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>
