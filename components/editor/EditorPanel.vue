<template>
  <div id="editor-container" ref="container" class="flex flex-col h-full bg-card shadow-sm rounded-2xl border border-gray-200 dark:border-gray-800 transition-all duration-300 relative">
    <!-- Ultra Minimal Header -->
    <div class="group/header relative z-20 flex items-center justify-between px-2 md:px-4 h-10 bg-gray-50/30 dark:bg-gray-950/30 border-b border-gray-100 dark:border-gray-900 transition-colors hover:bg-gray-50 dark:hover:bg-gray-950 rounded-t-2xl">
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
                <div class="mb-2">
                  <label class="text-[9px] font-bold uppercase text-gray-400 dark:text-gray-500 mb-1 block">What should AI do?</label>
                  <textarea 
                    ref="aiInput"
                    v-model="aiPrompt"
                    @keydown.enter.exact.prevent="handleAISubmit"
                    placeholder="e.g. Add a dark theme button or fix the layout..."
                    class="w-full h-20 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg p-2 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                  ></textarea>
                </div>
                <div class="flex items-center justify-end gap-2">
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
                    <span>{{ isAILoading ? aiStatusText : 'Generate Update' }}</span>
                  </button>
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
                <div class="mb-2">
                  <label class="text-[9px] font-bold uppercase text-gray-400 dark:text-gray-500 mb-1 block">What should AI do?</label>
                  <textarea 
                    ref="aiInputMobile"
                    v-model="aiPrompt"
                    @keydown.enter.exact.prevent="handleAISubmit"
                    placeholder="e.g. Add a dark theme button..."
                    class="w-full h-20 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-lg p-2 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                  ></textarea>
                </div>
                <div class="flex items-center justify-end gap-2">
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
                    <span>{{ isAILoading ? aiStatusText : 'Generate Update' }}</span>
                  </button>
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

        <button @click="shareCode"
          class="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
          :title="shareButtonText">
          <Icon :name="shareButtonText === 'Copied!' ? 'heroicons:check' : 'heroicons:share'" class="w-4 h-4" />
        </button>

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
import BoilerplateMenu from './BoilerplateMenu.vue'
import { useEditorStore } from '~/stores/editor'
import { useEditor } from '~/composables/useEditor'
import { useFullScreenStore } from '~/stores/fullScreenStore'

// Connect to the store
const editorStore = useEditorStore()
const { shareCode, saveCode, runCode, shareButtonText } = useEditor()

// Responsiveness
const container = ref<HTMLElement | null>(null)
const { width: containerWidth } = useElementSize(container)
const isCompact = computed(() => containerWidth.value < 650)
const isNarrow = computed(() => containerWidth.value < 400)
const isMobile = isNarrow 
const showMobileMenu = ref(false)

// AI Assistant
const showAIPopup = ref(false)
const aiPrompt = ref('')
const isAILoading = ref(false)
const aiStatusText = ref('Thinking...')
const abortController = ref<AbortController | null>(null)

const handleCancelAI = () => {
  if (abortController.value) {
    abortController.value.abort()
    abortController.value = null
    isAILoading.value = false
  }
}

const handleAISubmit = async () => {
  if (isAILoading.value || !aiPrompt.value) return
  
  isAILoading.value = true
  abortController.value = new AbortController()
  
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: abortController.value.signal,
      body: JSON.stringify({
        prompt: aiPrompt.value,
        code: editorStore.htmlCode
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.statusMessage || 'API request failed')
    }

    const contentType = response.headers.get("content-type") || ""
    
    // Check if it's a Trigger.dev runId response (JSON) or a Stream (Text)
    if (contentType.includes("application/json")) {
      const { runId, publicToken } = await response.json()
      
      // Configure the SDK with the public token for this session
      const { runs, streams, configure } = await import("@trigger.dev/sdk/v3")
      configure({ accessToken: publicToken })

      showAIPopup.value = false
      aiPrompt.value = ''
      aiStatusText.value = 'Initializing...'

      try {
        let accumulatedCode = ''
        
        // Start reading the stream in parallel to the run subscription
        const streamPromise = (async () => {
          try {
            const stream = await streams.read(runId, "ai-output")
            for await (const chunk of stream) {
              accumulatedCode += chunk
              
              let displayCode = accumulatedCode
              // Clean up markdown blocks if they appear in the stream
              if (displayCode.includes('```')) {
                displayCode = displayCode.replace(/```(?:html|css|js|javascript|vue|typescript|ts|jsx|tsx|json)?\n?/gi, '').replace(/```$/g, '')
              }
              editorStore.setHtmlCode(displayCode)
              
              if (abortController.value?.signal.aborted) break
            }
          } catch (err) {
            console.error("Error reading stream:", err)
          }
        })()

        // This is an Async Iterator that yields updates via WebSockets
        for await (const run of runs.subscribeToRun(runId)) {
          aiStatusText.value = run.status || 'Thinking...'

          if (run.status === 'COMPLETED') {
            // Wait for the stream to finish processing just in case
            await streamPromise
            
            const finalCode = (run.output as any)?.code
            if (finalCode) {
              editorStore.setHtmlCode(finalCode)
            }
            break // Stop listening once finished
          } else if (['FAILED', 'CANCELED', 'CRASHED', 'SYSTEM_FAILURE', 'EXPIRED', 'TIMED_OUT'].includes(run.status)) {
            throw new Error(`Task failed with status: ${run.status}`)
          }
          
          // Check if user cancelled via the abort controller
          if (abortController.value?.signal.aborted) break
        }
      } catch (err: any) {
        alert(`AI Error: ${err.message}`)
      } finally {
        isAILoading.value = false
        aiStatusText.value = 'Thinking...'
        abortController.value = null
      }
    } else {
      // Direct Stream implementation
      const reader = response.body?.getReader()
      if (!reader) throw new Error('Response body is null')

      let accumulatedCode = ''
      const decoder = new TextDecoder()
      
      showAIPopup.value = false
      aiPrompt.value = ''
      aiStatusText.value = 'Generating...'

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
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


  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('AI Generation cancelled by user')
      return
    }
    console.error('AI Error:', error)
    alert(`Error: ${error.message || 'Failed to connect to AI'}`)
    isAILoading.value = false
    aiStatusText.value = 'Thinking...'
    abortController.value = null
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
    editorView.value.dispatch({
      changes: {
        from: 0,
        to: editorView.value.state.doc.length,
        insert: newValue
      },
      userEvent: 'input'
    });
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
</style>
