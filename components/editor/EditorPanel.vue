<template>
  <div id="editor-container" ref="container" class="flex flex-col h-full bg-card shadow-sm rounded-2xl border border-gray-200 dark:border-gray-800 transition-all duration-300 relative">
    <!-- Ultra Minimal Header -->
    <div class="group/header relative z-[60] flex items-center justify-between px-2 md:px-4 h-10 bg-gray-50/30 dark:bg-gray-950/30 border-b border-gray-100 dark:border-gray-900 transition-colors hover:bg-gray-50 dark:hover:bg-gray-950 rounded-t-2xl">
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
              <button @click.stop="showAIPopup = !showAIPopup"
                class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all shadow-sm"
                :class="showAIPopup ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400'">
                <Icon name="heroicons:sparkles" class="w-3.5 h-3.5" :class="{ 'animate-pulse': isAILoading }" />
                <span v-if="!isCompact">AI</span>
              </button>
              
              <!-- AI Prompt Popup -->
              <div v-if="showAIPopup" class="absolute top-full left-0 mt-2 w-72 md:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-3 z-50">
                <!-- Settings Modal -->
                <SettingsModal v-model="showSettings" />

                <div v-if="aiReasoning || (isAILoading && aiStatusText !== 'Thinking...')" class="mb-3 p-2 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100/50 dark:border-indigo-800/50 max-h-32 overflow-y-auto custom-scrollbar">
                  <div class="flex items-center gap-2 mb-1 sticky top-0 bg-transparent">
                    <Icon name="heroicons:light-bulb" class="w-3 h-3 text-indigo-500 animate-pulse" />
                    <span class="text-[9px] font-bold uppercase text-indigo-500 tracking-wider">AI Thinking</span>
                  </div>
                  <p class="text-[10px] text-gray-600 dark:text-gray-400 italic">
                    {{ aiReasoning || aiStatusText }}
                  </p>
                </div>

                <div class="mb-2">
                  <div class="mb-1">
                    <label class="text-[9px] font-bold uppercase text-gray-400 dark:text-gray-500 block">What should AI do?</label>
                  </div>
                  <textarea 
                    ref="aiInput"
                    v-model="aiPrompt"
                    @keydown.enter.exact.prevent="handleAISubmit"
                    :disabled="isAILoading"
                    placeholder="e.g. Add a dark theme button or fix the layout..."
                    class="w-full h-20 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg p-2 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none disabled:opacity-50"
                  ></textarea>
                </div>

                <!-- Model Selection Nuxt UI -->
                <div class="mb-3">
                  <label class="text-[9px] font-bold uppercase text-gray-400 dark:text-gray-500 mb-1 block">AI Model</label>
                  <USelectMenu 
                    v-model="selectedModel" 
                    :items="modelOptions" 
                    value-key="id"
                    placeholder="Select a model"
                    class="w-full"
                    :ui="{ 
                      base: 'bg-gray-50 dark:bg-gray-900 rounded-lg ring-0 border border-gray-100 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500'
                    }"
                    :popper="{ zIndex: 100 }"
                  >
                    <div class="flex items-center gap-2 min-w-0">
                      <div class="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-md bg-indigo-600 text-white">
                        <Icon :name="currentModel?.icon || 'heroicons:cpu-chip'" class="w-3 h-3" />
                      </div>
                      <span class="text-[10px] font-bold text-gray-700 dark:text-gray-200 truncate">{{ currentModel?.name }}</span>
                    </div>

                    <template #item="{ item: model }">
                      <div class="flex items-center gap-2.5 min-w-0">
                        <div class="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md bg-gray-100 dark:bg-gray-700 text-gray-400">
                          <Icon :name="model.icon || 'heroicons:cpu-chip'" class="w-4 h-4" />
                        </div>
                        <div class="min-w-0 flex-grow">
                          <div class="text-[10px] font-bold text-gray-700 dark:text-gray-300 truncate">
                            {{ model.label }}
                          </div>
                          <div class="text-[8px] text-gray-400 dark:text-gray-500 truncate leading-tight">
                            {{ model.description }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </USelectMenu>
                </div>
                <div class="flex items-center justify-between gap-2 mt-1">
                  <button @click="showSettings = true" class="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-all" title="AI System Settings">
                    <Icon name="heroicons:cog-6-tooth" class="w-4 h-4" />
                  </button>
                  <div class="flex items-center gap-2">
                    <button 
                      v-if="isAILoading"
                      @click="handleCancelAI"
                      class="px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1.5"
                    >
                      <Icon name="heroicons:x-mark" class="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                    <button 
                      @click="handleAISubmit"
                      :disabled="isAILoading || !aiPrompt"
                      class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      <Icon v-if="isAILoading" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
                      <span>{{ isAILoading ? 'Processing...' : 'Generate Update' }}</span>
                    </button>
                  </div>
                </div>
              </div>
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
              <button @click.stop="showAIPopup = !showAIPopup"
                class="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all shadow-sm"
                :class="showAIPopup ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'">
                <Icon name="heroicons:sparkles" class="w-3.5 h-3.5" :class="{ 'animate-pulse': isAILoading }" />
              </button>
              
              <!-- AI Prompt Popup (Mobile specific adjustments) -->
              <div v-if="showAIPopup" class="absolute top-full left-0 mt-2 w-[calc(100vw-2rem)] max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-3 z-50">
                <!-- Settings Modal -->
                <SettingsModal v-model="showSettings" />
                
                <div v-if="aiReasoning || (isAILoading && aiStatusText !== 'Thinking...')" class="mb-3 p-2 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100/50 dark:border-indigo-800/50 max-h-24 overflow-y-auto">
                  <div class="flex items-center gap-2 mb-1">
                    <Icon name="heroicons:light-bulb" class="w-3 h-3 text-indigo-500 animate-pulse" />
                    <span class="text-[9px] font-bold uppercase text-indigo-500 tracking-wider">AI Thinking</span>
                  </div>
                  <p class="text-[10px] text-gray-600 dark:text-gray-400 italic">
                    {{ aiReasoning || aiStatusText }}
                  </p>
                </div>

                <div class="mb-2">
                  <div class="mb-1">
                    <label class="text-[9px] font-bold uppercase text-gray-400 dark:text-gray-500 block">What should AI do?</label>
                  </div>
                  <textarea 
                    ref="aiInputMobile"
                    v-model="aiPrompt"
                    @keydown.enter.exact.prevent="handleAISubmit"
                    :disabled="isAILoading"
                    placeholder="e.g. Add a dark theme button..."
                    class="w-full h-20 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg p-2 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none disabled:opacity-50"
                  ></textarea>
                </div>

                <!-- Model Selection Mobile Nuxt UI -->
                <div class="mb-3">
                  <label class="text-[9px] font-bold uppercase text-gray-400 dark:text-gray-500 mb-1.5 block">AI Model</label>
                  <USelectMenu 
                    v-model="selectedModel" 
                    :items="modelOptions" 
                    value-key="id"
                    class="w-full"
                    :ui="{ 
                      base: 'bg-gray-50 dark:bg-gray-900 rounded-xl ring-0 border border-gray-100 dark:border-gray-700'
                    }"
                    :popper="{ zIndex: 100 }"
                  >
                    <div class="flex items-center gap-3">
                      <div class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md bg-indigo-600 text-white">
                        <Icon :name="currentModel?.icon || 'heroicons:cpu-chip'" class="w-4 h-4" />
                      </div>
                      <span class="text-xs font-bold text-gray-700 dark:text-gray-200">{{ currentModel?.name }}</span>
                    </div>

                    <template #item="{ item: model }">
                      <div class="flex items-center gap-3 min-w-0">
                        <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400">
                          <Icon :name="model.icon || 'heroicons:cpu-chip'" class="w-4.5 h-4.5" />
                        </div>
                        <div class="min-w-0 flex-grow">
                          <div class="text-xs font-bold text-gray-700 dark:text-gray-300 truncate">
                            {{ model.label }}
                          </div>
                          <div class="text-[10px] text-gray-400 dark:text-gray-500 truncate leading-tight">
                            {{ model.description }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </USelectMenu>
                </div>
                <div class="flex items-center justify-between gap-2 mt-1">
                  <button @click="showSettings = true" class="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-all" title="AI System Settings">
                    <Icon name="heroicons:cog-6-tooth" class="w-4 h-4" />
                  </button>
                  <div class="flex items-center gap-2">
                    <button 
                      v-if="isAILoading"
                      @click="handleCancelAI"
                      class="px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1.5"
                    >
                      <Icon name="heroicons:x-mark" class="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                    <button 
                      @click="handleAISubmit"
                      :disabled="isAILoading || !aiPrompt"
                      class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase disabled:opacity-50 flex items-center gap-2"
                    >
                      <Icon v-if="isAILoading" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
                      <span>{{ isAILoading ? 'Processing...' : 'Generate Update' }}</span>
                    </button>
                  </div>
                </div>
              </div>
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
          
          <div v-if="fullScreenStore.isEditorFullscreen" class="w-[1px] h-3 bg-gray-200 dark:bg-gray-800 mx-1"></div>
          
          <button v-if="fullScreenStore.isEditorFullscreen" @click="handleSwitchToOutput"
            class="px-2 py-1 rounded-md text-[10px] font-bold uppercase text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">
            Preview
          </button>
        </div>
      </div>
      
      <!-- Right Actions -->
      <div class="flex items-center gap-1.5">
        <button @click="isDarkMode = !isDarkMode"
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
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue'
import { useMagicKeys, useFullscreen, useClipboard, useElementSize } from '@vueuse/core'
import { useColorMode } from '#imports'
import { basicSetup } from 'codemirror'
import { EditorView } from '@codemirror/view'
import { html } from '@codemirror/lang-html'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorState } from '@codemirror/state'
import js_beautify from 'js-beautify'
import BoilerplateMenu from './BoilerplateMenu.vue'
import EditorSharePopover from './SharePopover.vue'
import { useEditorStore } from '~/stores/editor'
import { useEditor } from '~/composables/useEditor'
import { useFullScreenStore } from '~/stores/fullScreenStore'
import { MODELS, DEFAULT_MODEL, type ModelId } from '~/shared/models'

// Connect to the store
const editorStore = useEditorStore()
const { shareCode, shareOutput, saveCode, runCode, shareButtonText } = useEditor()

// Responsiveness
const container = ref<HTMLElement | null>(null)
const { width: containerWidth } = useElementSize(container)
const isCompact = computed(() => containerWidth.value < 650)
const isNarrow = computed(() => containerWidth.value < 400)
const isMobile = isNarrow 
const showMobileMenu = ref(false)
const showShareMenu = ref(false)

// AI Assistant
const showAIPopup = ref(false)
const aiPrompt = ref('')
const selectedModel = ref<ModelId>(DEFAULT_MODEL)
const isAILoading = ref(false)
const aiStatusText = ref('Thinking...')
const aiReasoning = ref('')
const showSettings = ref(false)
const currentModel = computed(() => Object.values(MODELS).find(m => m.id === selectedModel.value) || Object.values(MODELS)[0])
const abortController = ref<AbortController | null>(null)
const currentRunId = ref<string | null>(null)
const userHasScrolledUp = ref(false)

const modelOptions = Object.values(MODELS).map(m => ({
  id: m.id as ModelId,
  label: m.name,
  description: m.description,
  icon: m.icon
}))

const handleCancelAI = async () => {
  if (abortController.value) {
    abortController.value.abort()
    abortController.value = null
  }

  if (currentRunId.value) {
    try {
      await fetch("/api/ai-cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runId: currentRunId.value })
      })
    } catch (err) {
      console.error("Failed to cancel background job:", err)
    }
    currentRunId.value = null
  }

  isAILoading.value = false
  aiStatusText.value = 'Thinking...'
}

const handleAISubmit = async () => {
  if (isAILoading.value || !aiPrompt.value) return
  
  // Abort any previous ongoing request
  if (abortController.value) {
    abortController.value.abort()
  }

  isAILoading.value = true
  aiStatusText.value = 'Thinking...'
  aiReasoning.value = ''
  userHasScrolledUp.value = false
  
  const controller = new AbortController()
  abortController.value = controller
  const signal = controller.signal
  
  try {
    console.log('Initiating AI request...')
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal,
      body: JSON.stringify({
        prompt: aiPrompt.value,
        code: editorStore.htmlCode,
        model: selectedModel.value,
        systemPrompt: editorStore.systemPrompt
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ statusMessage: 'Unknown error' }))
      throw new Error(errorData.statusMessage || `API request failed with status ${response.status}`)
    }

    const contentType = response.headers.get("content-type") || ""
    
    // Check if it's a Trigger.dev runId response (JSON) or a Stream (Text)
    if (contentType.includes("application/json")) {
      const { runId, publicToken } = await response.json()
      console.log('Trigger.dev run initiated:', runId)
      currentRunId.value = runId
      
      // Configure the SDK with the public token for this session
      const sdk = await import("@trigger.dev/sdk/v3")
      const { runs, auth } = sdk
      const streams = (sdk as any).streams

      aiStatusText.value = 'Initializing...'

      try {
        let accumulatedCode = ''
        
        await auth.withAuth({ accessToken: publicToken }, async () => {
          // Start reading the reasoning stream
          const reasoningStreamPromise = (async () => {
            try {
              console.log('Starting reasoning stream for:', runId)
              const stream = await streams.read(runId, "ai-reasoning", { timeoutInSeconds: 3600 })
              for await (const chunk of stream) {
                if (signal.aborted) {
                  console.log('Reasoning stream aborted')
                  break
                }
                aiReasoning.value += chunk
              }
            } catch (err) {
              console.error("Error reading reasoning stream:", err)
            }
          })()

          // Start reading the code stream in parallel to the run subscription
          const streamPromise = (async () => {
            try {
              console.log('Starting output stream for:', runId)
              const stream = await streams.read(runId, "ai-output", { timeoutInSeconds: 3600 })
              let hasStarted = false
              for await (const chunk of stream) {
                if (signal.aborted) {
                  console.log('Output stream aborted')
                  break
                }
                
                if (!hasStarted) {
                  hasStarted = true
                  showAIPopup.value = false
                  aiPrompt.value = ''
                }
                accumulatedCode += chunk
                
                let displayCode = accumulatedCode
                // Clean up markdown blocks if they appear in the stream
                if (displayCode.includes('```')) {
                  displayCode = displayCode.replace(/```(?:html|css|js|javascript|vue|typescript|ts|jsx|tsx|json)?\n?/gi, '').replace(/```$/g, '')
                }
                editorStore.setHtmlCode(displayCode)
              }
            } catch (err) {
              console.error("Error reading output stream:", err)
            }
          })()

          // This is an Async Iterator that yields updates via WebSockets
          for await (const run of runs.subscribeToRun(runId)) {
            console.log('Run status update:', run.status)
            aiStatusText.value = run.status || 'Thinking...'

            if (run.status === 'COMPLETED') {
              console.log('Run completed:', runId)
              const finalCode = (run.output as any)?.code
              if (finalCode) {
                editorStore.setHtmlCode(finalCode)
              }
              break 
            } else if (['FAILED', 'CANCELED', 'CRASHED', 'SYSTEM_FAILURE', 'EXPIRED', 'TIMED_OUT'].includes(run.status)) {
              throw new Error(`Task failed with status: ${run.status}`)
            }
            
            if (signal.aborted) break
          }
        });
      } catch (err: any) {
        if (err.message?.includes('429') || err.message?.toLowerCase().includes('rate-limited')) {
          alert(`Rate Limited: The selected model is temporarily unavailable. Please try again in a few seconds or switch to a different model.`)
        } else {
          alert(`AI Error: ${err.message}`)
        }
      } finally {
        isAILoading.value = false
        aiStatusText.value = 'Thinking...'
        // Keep abortController so it can be aborted if a new request starts before old loops finish
        currentRunId.value = null
      }
    } else {
      // Direct Stream implementation
      const reader = response.body?.getReader()
      if (!reader) throw new Error('Response body is null')

      let accumulatedCode = ''
      const decoder = new TextDecoder()
      
      aiStatusText.value = 'Generating...'

      try {
        let hasStarted = false
        while (true) {
          const { done, value } = await reader.read()
          if (done || signal.aborted) break
          
          if (!hasStarted) {
            hasStarted = true
            showAIPopup.value = false
            aiPrompt.value = ''
          }

          const chunk = decoder.decode(value, { stream: true })
          accumulatedCode += chunk
          
          let displayCode = accumulatedCode
          if (displayCode.startsWith('```')) {
              displayCode = displayCode.replace(/^```[a-z]*\n/i, '').replace(/\n```$/m, '')
          }
          editorStore.setHtmlCode(displayCode)
        }
      } finally {
        reader.releaseLock()
      }
    }

    isAILoading.value = false
    aiStatusText.value = 'Thinking...'
    abortController.value = null
    currentRunId.value = null
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('AI Generation cancelled by user')
      return
    }
    console.error('AI Error:', error)
    const msg = (error.message?.includes('429') || error.message?.toLowerCase().includes('rate-limited'))
      ? "Rate Limited: This model is busy. Try again soon or switch models."
      : (error.message || 'Failed to connect to AI')
    alert(`Error: ${msg}`)
    isAILoading.value = false
    aiStatusText.value = 'Thinking...'
    currentRunId.value = null
  }
}


// Clipboard logic
const { copy, copied: isCopied } = useClipboard({ legacy: true })
const copyIcon = computed(() => isCopied.value ? 'heroicons:check' : 'heroicons:clipboard-document')

const handleUndo = () => {
  if (editorView.value) {
    editorView.value.focus()
    const isMac = /Mac/.test(navigator.platform)
    const event = new KeyboardEvent('keydown', {
      key: 'z',
      code: 'KeyZ',
      ctrlKey: !isMac,
      metaKey: isMac,
      bubbles: true,
      cancelable: true
    })
    editorView.value.contentDOM.dispatchEvent(event)
  }
}

const handleRedo = () => {
  if (editorView.value) {
    editorView.value.focus()
    const isMac = /Mac/.test(navigator.platform)
    const isShift = isMac // Mac uses Cmd+Shift+Z for redo, Windows uses Ctrl+Y
    const event = new KeyboardEvent('keydown', {
      key: isMac ? 'z' : 'y',
      code: isMac ? 'KeyZ' : 'KeyY',
      ctrlKey: !isMac,
      metaKey: isMac,
      shiftKey: isShift,
      bubbles: true,
      cancelable: true
    })
    editorView.value.contentDOM.dispatchEvent(event)
  }
}

const handleCopy = () => {
  if (editorView.value) {
    copy(editorView.value.state.doc.toString())
  } else {
    copy(editorStore.htmlCode)
  }
}

const handleClear = () => {
  editorStore.setHtmlCode('')
}

const handleBeautify = () => {
  if (editorStore.htmlCode) {
    const formatted = js_beautify.html(editorStore.htmlCode, {
      indent_size: 2,
      wrap_line_length: 0,
      preserve_newlines: true,
      max_preserve_newlines: 2,
      end_with_newline: false
    })
    editorStore.setHtmlCode(formatted)
  }
}

// Template refs
// container ref is already defined above in Responsiveness section
const editorContainer = ref<HTMLElement | null>(null)
const editorView = ref<EditorView | null>(null)
const aiInput = ref<HTMLTextAreaElement | null>(null)
const aiInputMobile = ref<HTMLTextAreaElement | null>(null)

// Watch for AI popup to focus input
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

// Use the fullscreen store
const fullScreenStore = useFullScreenStore()

// Fullscreen handling using vueuse
const { isFullscreen: isEditorFullscreen, toggle: toggleFullscreen } = useFullscreen(container)

// Replace toggleFullscreen function
const toggleFullscreenHandler = () => {
  toggleFullscreen()
  fullScreenStore.isEditorFullscreen = isEditorFullscreen.value
}

// Replace handleSwitchToOutput function
const handleSwitchToOutput = async () => {
  const success = await fullScreenStore.handleSwitchToOutput()
  if (success) {
    setTimeout(() => {
      runCode()
    }, 150)
  }
}

// Color mode
const colorMode = useColorMode()
const isDarkMode = computed({
  get: () => colorMode.value === 'dark',
  set: (value) => {
    colorMode.preference = value ? 'dark' : 'light'
  }
})

// Directly connect to the liveRun property in the store
const liveRun = computed({
  get: () => editorStore.liveRun,
  set: (value) => {
    editorStore.setLiveRun(value)
    if(value==true) runCode();
  }
})

// Add keyboard monitoring only for paste event
const keys = useMagicKeys()

// Just monitor Ctrl+V for paste events
const isPaste = computed(() => (keys.ctrl_v?.value || keys.meta_v?.value) || false)

watch(isPaste, (newValue) => {
  if (newValue && liveRun.value) {
    // Small delay to allow editor to update with pasted content
    setTimeout(() => {
      runCode();
    }, 100);
  }
})

// Setup CodeMirror editor with more explicit theme handling
const setupEditor = () => {
  if (!editorContainer.value) return;
  
  // Define extensions array based on dark mode
  const extensions = [
    basicSetup,
    html(),
    EditorView.theme({
      "&": {
        backgroundColor: isDarkMode.value ? "#282c34" : "#ffffff",
        color: isDarkMode.value ? "#abb2bf" : "#24292e",
        height: "100%", // Ensure editor takes full height
        overflow: "auto" // Enable scrolling
      },
      ".cm-content": {
        caretColor: isDarkMode.value ? "#528bff" : "#000000"
      },
      ".cm-cursor": {
        borderLeftColor: isDarkMode.value ? "#528bff" : "#000000"
      },
      "&.cm-focused .cm-cursor": {
        borderLeftColor: isDarkMode.value ? "#528bff" : "#000000"
      },
      ".cm-selectionBackground": {
        backgroundColor: isDarkMode.value ? "#3E4451" : "#b3d4fc"
      },
      ".cm-gutters": {
        backgroundColor: isDarkMode.value ? "#282c34" : "#f6f8fa",
        color: isDarkMode.value ? "#495162" : "#6e7781",
        border: "none"
      },
      ".cm-scroller": {
        scrollbarWidth: "thin",
        scrollbarColor: isDarkMode.value ? "#4b5563 transparent" : "#cbd5e1 transparent"
      },
      ".cm-scroller::-webkit-scrollbar": {
        width: "8px",
        height: "8px",
      },
      ".cm-scroller::-webkit-scrollbar-track": {
        background: "transparent",
      },
      ".cm-scroller::-webkit-scrollbar-thumb": {
        background: isDarkMode.value ? "#4b5563" : "#cbd5e1",
        borderRadius: "10px",
      },
      ".cm-scroller::-webkit-scrollbar-thumb:hover": {
        background: isDarkMode.value ? "#6b7280" : "#94a3b8",
      }
    }),
    EditorView.updateListener.of(update => {
      if (update.docChanged) {
        const newValue = update.state.doc.toString();
        editorStore.setHtmlCode(newValue);
        
        if (liveRun.value) {
          runCode();
        }
      }
    })
  ];
  
  // Update editor when fullscreen changes
  watch(() => editorStore.fullscreenSwitch, async () => {
    await nextTick();
    if (editorView.value) {
      // Allow time for the DOM to update before triggering a remeasure
      setTimeout(() => {
        if (editorView.value) {
          editorView.value.requestMeasure();
          // Force a refresh of the editor layout
          const view = editorView.value;
          view.dispatch({});
        }
      }, 100);
    }
  });

  // Only add oneDark theme when in dark mode
  if (isDarkMode.value) {
    extensions.push(oneDark);
  }
  
  // Create the editor state with the appropriate extensions
  const startState = EditorState.create({
    doc: editorStore.htmlCode,
    extensions: extensions
  });

  // Create the editor view
  editorView.value = new EditorView({
    state: startState,
    parent: editorContainer.value
  });

  // Ensure scrolling works in fullscreen
  editorView.value.scrollDOM.style.height = "100%";
  editorView.value.scrollDOM.style.overflow = "auto";

  // Add scroll listener to detect manual scroll
  editorView.value.scrollDOM.addEventListener('scroll', () => {
    if (!editorView.value) return;
    const { scrollTop, scrollHeight, clientHeight } = editorView.value.scrollDOM;
    // If the user is more than 100px away from the bottom, consider they've scrolled up
    // We use a bit larger threshold to avoid accidental triggers
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    if (isAILoading.value && !isAtBottom) {
      userHasScrolledUp.value = true;
    } else if (isAtBottom) {
      userHasScrolledUp.value = false;
    }
  });
}

// Boilerplate menu toggle
const showMenuPopup = ref(false)

// Method to load boilerplate content
const loadBoilerplate = (fileName: string) => {
  fetch(`/boilerplates/${fileName}`)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to fetch ${fileName}`);
      return res.text();
    })
    .then(text => {
      editorStore.setHtmlCode(text);
      // Small delay to ensure store update propagates before running
      setTimeout(() => {
        runCode();
      }, 50);
    })
    .catch(err => {
      console.error('Error loading boilerplate:', err);
    });
}

// Watch for fullscreen switch events
watch(() => editorStore.fullscreenSwitch, async (newVal, oldVal) => {
  if (newVal !== oldVal && fullScreenStore.isEditorFullscreen) {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    }
    // Request fullscreen on this container after a brief delay
    setTimeout(() => {
      if (container.value && container.value.requestFullscreen) {
        container.value.requestFullscreen()
          .catch(err => console.error("Error attempting to enable fullscreen:", err))
      }
    }, 100)
  }
})

// Update editor content when htmlCode in store changes
watch(() => editorStore.htmlCode, (newValue) => {
  if (editorView.value && newValue !== editorView.value.state.doc.toString()) {
    const view = editorView.value;
    const currentScrollTop = view.scrollDOM.scrollTop;
    
    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: newValue
      },
      userEvent: 'input'
    });

    // Handle scrolling
    if (isAILoading.value) {
      if (!userHasScrolledUp.value) {
        // Auto-scroll to bottom during AI streaming
        nextTick(() => {
          view.scrollDOM.scrollTop = view.scrollDOM.scrollHeight;
        });
      }
    } else {
      // Preserve scroll position for non-AI updates (like manual edits or boilerplate loads)
      // Only if it's not a complete replacement that should reset scroll (like boilerplate)
      // But wait, the dispatch might have already moved the scroll.
      // If it's a manual edit, CodeMirror handles it.
      // If it's an external update (this watch), we might want to keep the scroll.
      view.scrollDOM.scrollTop = currentScrollTop;
    }
  }
});

// Update editor theme when dark mode changes
watch(isDarkMode, async () => {
  if (editorView.value) {
    // Store cursor position and selection
    const currentValue = editorView.value.state.doc.toString();
    const selection = editorView.value.state.selection;
    
    // Destroy and recreate with new theme
    editorView.value.destroy();
    await nextTick();
    setupEditor();
    
    // Try to restore cursor position if possible
    if (editorView.value) {
      try {
        editorView.value.dispatch({
          selection: selection as any
        });
      } catch (e) {
        console.warn('Could not restore selection after theme change', e);
      }
    }

    // Ensure theme is applied correctly in fullscreen
    editorView.value.scrollDOM.style.height = "100%";
    editorView.value.scrollDOM.style.overflow = "auto";
  }
});

// Watch for fullscreen changes to update editor layout
watch(() => fullScreenStore.isEditorFullscreen, async (newValue) => {
  await nextTick()
  if (editorView.value) {
    // Allow time for the DOM to update before triggering a remeasure
    setTimeout(() => {
      if (editorView.value) {
        editorView.value.requestMeasure()
        // Force a refresh of the editor layout
        const view = editorView.value
        view.dispatch({})
      }
    }, 100)
  }
})

// Initialize editor on component mount
onMounted(() => {
  nextTick(() => {
    setupEditor();
  });
});

// Clean up only the editor view on unmount
onUnmounted(() => {
  handleCancelAI();
  if (editorView.value) {
    editorView.value.destroy();
  }
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
