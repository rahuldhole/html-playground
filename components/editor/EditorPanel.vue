<template>
  <div id="editor-container" ref="container" class="flex flex-col h-full relative">
    <div class="flex flex-row items-center justify-between p-2 bg-gray-200 dark:bg-gray-700 rounded-t-lg">
      <div class="flex flex-wrap items-center gap-2 sm:gap-3">
        <div class="relative">
          <button class="text-2xl text-red-500" @click.stop="showMenu">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :stroke="isDarkMode ? 'white' : 'black'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu w-6 h-6">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <BoilerplateMenu v-model="showMenuPopup" @select="loadBoilerplate" />
        </div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">HTML Code</h2>
        <!-- Show the switch button if showOutputButton is true -->
        <button @click="handleSwitchToOutput"
          class="bg-yellow-300 hover:bg-yellow-400 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-gray-800 dark:text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm transition-colors">
          View Output
        </button>
        <label v-if="fullScreenStore.isEditorFullscreen" class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="isDarkMode" class="sr-only peer" />
          <div
            class="w-11 h-6 bg-black peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 dark:peer-checked:bg-blue-600">
            <span class="absolute left-1 top-1 text-xs text-gray-600">☀️</span>
            <span class="absolute right-1 top-1 text-xs text-white">🌙</span>
          </div>
        </label>
      </div>
      
      <!-- Desktop Actions -->
      <div class="hidden sm:flex flex-wrap items-center gap-2 sm:gap-3">
        <div class="flex items-center gap-1 sm:gap-2">
          <span class="text-xs sm:text-sm text-gray-700 dark:text-gray-300">Live</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="liveRun" class="sr-only peer" />
            <div
              class="w-9 sm:w-11 h-5 sm:h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 sm:after:h-5 after:w-4 sm:after:w-5 after:transition-all peer-checked:bg-blue-500 dark:peer-checked:bg-blue-600">
            </div>
          </label>
        </div>
        <button @click="runCode" v-show="!liveRun"
          class="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
          Run
        </button>
        <button @click="saveCode"
          class="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm transition-colors">
          Save
        </button>
        <button @click="shareCode"
          class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm transition-colors">
          {{ shareButtonText }}
        </button>
        <button @click="toggleFullscreenHandler"
          class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white px-2 py-1 transition-colors">
          <svg v-if="fullScreenStore.isEditorFullscreen === true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="feather feather-minimize sm:w-6 sm:h-6">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
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
              <span class="text-sm text-gray-700 dark:text-gray-300">Live Updates</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="liveRun" class="sr-only peer" />
                <div
                  class="w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500 dark:peer-checked:bg-blue-600">
                </div>
              </label>
            </div>
          </div>
          <button @click="runCode" v-show="!liveRun"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:hover:bg-white dark:disabled:hover:bg-gray-700 disabled:cursor-not-allowed">
            Run Code
          </button>
          <button @click="saveCode"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
            Save as HTML File
          </button>
          <button @click="shareCode"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
            {{ shareButtonText }}
          </button>
          <button @click="toggleFullscreenHandler"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
            {{ fullScreenStore.isEditorFullscreen ? 'Exit Fullscreen' : 'Fullscreen' }}
          </button>
        </EditorDropdownMenu>
      </div>
    </div>
    
    <!-- CodeMirror Editor with better fullscreen handling -->
    <div
      class="relative w-full h-[300px] sm:h-[400px] md:h-[calc(100vh-300px)] lg:h-[calc(100vh-200px)] border border-gray-300 dark:border-gray-700 rounded-b-lg overflow-hidden flex-grow"
      :class="{ '!h-[calc(100vh-60px)] !max-h-[calc(100vh-60px)]': fullScreenStore.isEditorFullscreen }">
      <ClientOnly>
        <div class="w-full h-full">
          <div ref="editorContainer" class="w-full h-full rounded-b-lg" :class="{'dark-editor': isDarkMode}"></div>
        </div>
        <template #fallback>
          <div class="w-full h-full p-4 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 font-mono text-sm">
            Loading editor...
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue'
import { useEventListener, useMagicKeys, useFullscreen } from '@vueuse/core'
import { useColorMode } from '#imports'
import { EditorView, basicSetup } from 'codemirror'
import { html } from '@codemirror/lang-html'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorState } from '@codemirror/state'
import EditorDropdownMenu from './EditorDropdownMenu.vue'
import BoilerplateMenu from './BoilerplateMenu.vue'
import { useEditorStore } from '~/stores/editor'
import { useEditor } from '~/composables/useEditor'
import { useFullScreenStore } from '~/stores/fullScreenStore'

// Connect to the store
const editorStore = useEditorStore()
const { shareCode, saveCode, runCode, shareButtonText } = useEditor()

// Template refs
const container = ref<HTMLElement | null>(null)
const editorContainer = ref<HTMLElement | null>(null)
const editorView = ref<EditorView | null>(null)

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

// Show menu method - added .stop to prevent event propagation
const showMenu = (event?: MouseEvent) => {
  if (event) {
    event.stopPropagation();
  }
  showMenuPopup.value = !showMenuPopup.value;
}

// Method to load boilerplate content
const loadBoilerplate = (fileName: string) => {
  fetch(`boilerplates/${fileName}`)  // Removed leading slash to make path relative
    .then(res => res.text())
    .then(text => {
      editorStore.setHtmlCode(text);
      runCode(); // Automatically run the code when loading a boilerplate
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
      }
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
