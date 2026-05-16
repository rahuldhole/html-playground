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
              <UPopover 
                :popper="{ placement: 'bottom-start', offsetDistance: 12, strategy: 'fixed' }" 
                :ui="{ 
                  content: 'w-80 md:w-96 rounded-[1.5rem] shadow-2xl bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border border-gray-100 dark:border-gray-800/50 ring-1 ring-black/5 dark:ring-white/5'
                }"
              >
                <button
                  class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all shadow-sm"
                  :class="showAIPopup ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400'">
                  <Icon name="heroicons:sparkles" class="w-3.5 h-3.5" :class="{ 'animate-pulse': isAILoading }" />
                  <span v-if="!isCompact">AI</span>
                </button>

                <template #content>
                  <div class="p-5 space-y-5">
                    <!-- Header -->
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                          <Icon name="heroicons:sparkles" class="w-4.5 h-4.5 text-white" />
                        </div>
                        <div>
                          <h3 class="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            AI Assistant
                            <span class="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[8px] font-bold uppercase tracking-wider border border-indigo-100/50 dark:border-indigo-500/20">
                              {{ isEditMode ? 'Edit' : 'New' }}
                            </span>
                          </h3>
                          <p class="text-[10px] text-gray-500 dark:text-gray-400 leading-none mt-0.5">How can I help you today?</p>
                        </div>
                      </div>
                    </div>

                    <!-- Thinking Status -->
                    <div v-if="aiReasoning || (isAILoading && aiStatusText !== 'Thinking...')" 
                      class="p-3 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-2xl border border-indigo-500/10 dark:border-indigo-500/20">
                      <div class="flex items-center gap-2 mb-1.5">
                        <div class="flex gap-0.5">
                          <span class="w-1 h-1 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></span>
                          <span class="w-1 h-1 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]"></span>
                          <span class="w-1 h-1 rounded-full bg-indigo-500 animate-bounce"></span>
                        </div>
                        <span class="text-[9px] font-bold uppercase text-indigo-600 dark:text-indigo-400 tracking-widest">Reasoning</span>
                      </div>
                      <p class="text-[11px] text-gray-600 dark:text-gray-300 italic leading-snug">
                        {{ aiReasoning || aiStatusText }}
                      </p>
                    </div>

                    <!-- Input Area -->
                    <div class="space-y-2">
                      <div class="flex items-center justify-between">
                        <label class="text-[9px] font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider">Instruction</label>
                      </div>
                      <textarea 
                        ref="aiInput"
                        v-model="aiPrompt"
                        @keydown.enter.exact.prevent="handleAISubmit"
                        :disabled="isAILoading"
                        placeholder="e.g. Add a dark theme or fix the layout..."
                        class="w-full h-28 bg-gray-50/50 dark:bg-gray-950/50 border border-gray-100 dark:border-gray-800 rounded-2xl p-3.5 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all resize-none disabled:opacity-50 placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-inner"
                      ></textarea>
                    </div>

                    <!-- Model Row -->
                    <div class="flex items-center gap-3">
                      <div class="flex-1">
                        <USelectMenu 
                          v-model="selectedModel" 
                          :items="modelOptions" 
                          value-key="id"
                          class="w-full"
                          :ui="{ 
                            base: 'bg-white dark:bg-gray-950 rounded-xl border border-gray-100 dark:border-gray-800 h-10 transition-all hover:border-indigo-500/50',
                            content: 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl rounded-2xl'
                          }"
                          :popper="{ zIndex: 10001, strategy: 'fixed' }"
                        >
                          <template #default>
                            <div class="flex items-center gap-2 px-3 py-2">
                              <Icon :name="currentModel?.icon || 'heroicons:cpu-chip'" class="w-4 h-4 text-indigo-500" />
                              <span class="text-[11px] font-bold text-gray-700 dark:text-gray-200 truncate">{{ currentModel?.name }}</span>
                            </div>
                          </template>
                          <template #item="{ item: model }">
                            <div class="flex items-center gap-2.5 py-1.5 w-full">
                              <div class="w-7 h-7 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                <Icon :name="model.icon || 'heroicons:cpu-chip'" class="w-4 h-4" />
                              </div>
                              <p class="text-[11px] font-bold text-gray-700 dark:text-gray-200 truncate">{{ model.label }}</p>
                            </div>
                          </template>
                        </USelectMenu>
                      </div>
                      <button @click="showSettings = true" 
                        class="h-10 px-3.5 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center">
                        <Icon name="heroicons:cog-6-tooth" class="w-5 h-5" />
                      </button>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center justify-between pt-1">
                      <p class="text-[9px] text-gray-400 italic hidden sm:block">Press Enter to sync</p>
                      <div class="flex items-center gap-2 w-full sm:w-auto">
                        <button 
                          v-if="isAILoading"
                          @click="handleCancelAI"
                          class="flex-1 sm:flex-none px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2"
                        >
                          <Icon name="heroicons:stop-circle" class="w-4 h-4" />
                          <span>Stop</span>
                        </button>
                        <button 
                          @click="handleAISubmit"
                          :disabled="isAILoading || !aiPrompt"
                          class="flex-1 sm:flex-none px-6 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-[10px] font-bold uppercase shadow-xl shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <Icon v-if="isAILoading" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
                          <Icon v-else name="heroicons:bolt" class="w-4 h-4" />
                          <span>{{ isAILoading ? 'Generating...' : 'Generate' }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </template>
              </UPopover>
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
              <UPopover 
                :popper="{ placement: 'bottom-start', offsetDistance: 12, strategy: 'fixed' }" 
                :ui="{ 
                  content: 'w-[calc(100vw-2rem)] max-w-sm rounded-[1.5rem] shadow-2xl bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border border-gray-100 dark:border-gray-800/50 ring-1 ring-black/5 dark:ring-white/5'
                }"
              >
                <button
                  class="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all shadow-sm"
                  :class="showAIPopup ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'">
                  <Icon name="heroicons:sparkles" class="w-3.5 h-3.5" :class="{ 'animate-pulse': isAILoading }" />
                </button>

                <template #content>
                  <div class="p-5 space-y-4">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                          <Icon name="heroicons:sparkles" class="w-4.5 h-4.5 text-white" />
                        </div>
                        <span class="text-xs font-bold text-gray-900 dark:text-white">Magic Assistant</span>
                      </div>
                      <span class="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[8px] font-bold uppercase tracking-wider">
                        {{ isEditMode ? 'Edit' : 'New' }}
                      </span>
                    </div>

                    <textarea 
                      v-model="aiPrompt"
                      @keydown.enter.exact.prevent="handleAISubmit"
                      :disabled="isAILoading"
                      placeholder="Instruction..."
                      class="w-full h-28 bg-gray-50/50 dark:bg-gray-950/50 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none disabled:opacity-50"
                    ></textarea>

                    <div class="flex items-center gap-3">
                      <USelectMenu 
                        v-model="selectedModel" 
                        :items="modelOptions" 
                        value-key="id"
                        class="flex-1"
                        :ui="{ 
                          base: 'bg-white dark:bg-gray-950 rounded-xl border border-gray-100 dark:border-gray-800 h-10',
                          content: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-2xl'
                        }"
                        :popper="{ zIndex: 10001, strategy: 'fixed' }"
                      />
                    </div>

                    <button 
                      @click="handleAISubmit"
                      :disabled="isAILoading || !aiPrompt"
                      class="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-xs font-bold uppercase shadow-xl shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Icon v-if="isAILoading" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
                      <Icon v-else name="heroicons:bolt" class="w-4 h-4" />
                      <span>{{ isAILoading ? 'Syncing...' : 'Magic Sync' }}</span>
                    </button>
                  </div>
                </template>
              </UPopover>
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
const isEditMode = computed(() => !!editorStore.htmlCode)
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

const applyDiffsToCode = (baseCode: string, diffStream: string, onStatus?: (status: string) => void) => {
  if (!diffStream.includes('<<<<<<< SEARCH') && diffStream.length > 50) {
    // If we're in edit mode but the AI isn't sending search blocks, fallback
    return diffStream.replace(/```(?:html|css|js|javascript|vue|typescript|ts|jsx|tsx|json)?\n?/gi, '').replace(/```$/g, '');
  }

  const blocks = diffStream.split('<<<<<<< SEARCH');
  let currentCode = baseCode;
  let hasFoundMatch = false;
  
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    if (block && block.includes('=======')) {
      const parts = block.split('=======');
      const searchPart = parts[0];
      const rest = parts[1];
      
      if (searchPart !== undefined && rest !== undefined) {
        // Strip only the leading/trailing newline from the markers, preserve interior whitespace
        const search = searchPart.replace(/^\n/, '').replace(/\n$/, '');
        
        if (rest.includes('>>>>>>> REPLACE')) {
          const replacement = rest.split('>>>>>>> REPLACE')[0]?.replace(/^\n/, '').replace(/\n$/, '');
          if (replacement !== undefined && currentCode.includes(search)) {
            currentCode = currentCode.replace(search, replacement);
            hasFoundMatch = true;
          }
        } else {
          // Still writing the replacement for this block
          const partialReplacement = rest.replace(/^\n/, '');
          if (currentCode.includes(search)) {
             // We use a temporary replace for the live preview
             currentCode = currentCode.replace(search, partialReplacement);
             hasFoundMatch = true;
          }
        }
      }
    } else if (block && onStatus && !hasFoundMatch) {
       onStatus('Identifying lines to change...');
    }
  }
  return currentCode;
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
  const originalCode = editorStore.htmlCode
  
  try {
    console.log('[AI Client] Initiating AI request with mode:', isEditMode.value ? 'edit' : 'full')
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
        systemPrompt: editorStore.systemPrompt,
        mode: isEditMode.value ? 'edit' : 'full'
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
      const { runs, auth, streams } = await import("@trigger.dev/sdk/v3")

      aiStatusText.value = 'Initializing...'

      try {
        let accumulatedCode = ''
        // Flag to prevent stream chunks from overwriting the authoritative final code
        let runCompleted = false
        let finalRunCode: string | null = null
        
        await auth.withAuth({ accessToken: publicToken }, async () => {
          console.log('Authentication successful, starting streams for:', runId)
          
          // Start reading the reasoning stream
          const reasoningStreamPromise = (async () => {
            try {
              console.log('Reading reasoning stream for:', runId)
              const stream = await streams.read(runId, "ai-reasoning", { timeoutInSeconds: 600 })
              for await (const chunk of (stream as AsyncIterable<string>)) {
                if (signal.aborted) {
                  console.log('[AI Client] Reasoning stream aborted');
                  break
                }
                aiReasoning.value += chunk
              }
              console.log('[AI Client] Reasoning stream finished')
            } catch (err) {
              console.error("Error reading reasoning stream:", err)
            }
          })()

          // Start reading the code stream
          const outputStreamPromise = (async () => {
            try {
              console.log('Reading output stream for:', runId)
              const stream = await streams.read(runId, "ai-output", { timeoutInSeconds: 600 })
              let hasStarted = false
              console.log('[AI Client] Output stream connected, waiting for chunks...');
              for await (const chunk of (stream as AsyncIterable<string>)) {
                if (signal.aborted || runCompleted) {
                  console.log('[AI Client] Output stream stopped (aborted or run completed)');
                  break
                }
                
                if (!hasStarted) {
                  console.log('[AI Client] First chunk received');
                  hasStarted = true
                  showAIPopup.value = false
                  aiPrompt.value = ''
                }
                console.log(`[AI Client] Received chunk of length: ${chunk.length}`);
                accumulatedCode += chunk
                
                let displayCode = accumulatedCode
                if (isEditMode.value) {
                  displayCode = applyDiffsToCode(originalCode, accumulatedCode, (s) => {
                    aiStatusText.value = s
                  })
                } else if (displayCode.includes('```')) {
                  displayCode = displayCode.replace(/```(?:html|css|js|javascript|vue|typescript|ts|jsx|tsx|json)?\n?/gi, '').replace(/```$/g, '')
                }
                editorStore.setHtmlCode(displayCode)
              }
              console.log('[AI Client] Output stream finished')
            } catch (err) {
              console.error("Error reading output stream:", err)
            }
          })()

          // Subscribe to run updates
          const runSubscriptionPromise = (async () => {
            try {
              for await (const run of runs.subscribeToRun(runId)) {
                console.log('Run status update:', run.status)
                aiStatusText.value = run.status || 'Thinking...'

                if (run.status === 'COMPLETED') {
                  console.log('Run completed successfully')
                  // Set flag FIRST to stop the output stream from writing more chunks
                  runCompleted = true
                  
                  const code = (run.output as any)?.code
                  if (code) {
                    finalRunCode = code
                    console.log('[AI Client] Final code from run output received, length:', code.length)
                  }
                  
                  // Reset loading state for UI feedback
                  isAILoading.value = false
                  aiStatusText.value = 'Ready'
                  
                  // Abort streams immediately since we have the authoritative final code
                  controller.abort()
                  break 
                } else if (['FAILED', 'CANCELED', 'CRASHED', 'SYSTEM_FAILURE', 'EXPIRED', 'TIMED_OUT'].includes(run.status)) {
                  isAILoading.value = false
                  controller.abort()
                  throw new Error(`Task failed with status: ${run.status}`)
                }
                
                if (signal.aborted) break
              }
            } catch (err) {
              console.error("Error in run subscription:", err)
              controller.abort()
              throw err
            }
          })()

          // Wait for everything to finish
          await Promise.allSettled([
            reasoningStreamPromise,
            outputStreamPromise,
            runSubscriptionPromise
          ])
          
          // Apply the authoritative final code AFTER all streams have stopped,
          // so no stale stream chunk can overwrite it
          if (finalRunCode) {
            console.log('[AI Client] Applying authoritative final code from run output')
            editorStore.setHtmlCode(finalRunCode)
          } else if (runCompleted && accumulatedCode) {
            // Fallback: run completed but output was empty — apply client-side diff result
            console.warn('[AI Client] Run completed but no output code; applying client-side accumulated result')
            let displayCode = accumulatedCode
            if (isEditMode.value) {
              displayCode = applyDiffsToCode(originalCode, accumulatedCode)
            } else if (displayCode.includes('```')) {
              displayCode = displayCode.replace(/```(?:html|css|js|javascript|vue|typescript|ts|jsx|tsx|json)?\n?/gi, '').replace(/```$/g, '')
            }
            editorStore.setHtmlCode(displayCode)
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
          if (isEditMode.value) {
            displayCode = applyDiffsToCode(originalCode, accumulatedCode, (s) => {
              aiStatusText.value = s
            })
          } else if (displayCode.startsWith('```')) {
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
