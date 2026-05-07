<template>
  <div id="editor-container" ref="container" class="flex flex-col h-full bg-card shadow-sm rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
    <!-- Premium Header -->
    <div class="flex items-center justify-between px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 backdrop-blur-sm">
      <div class="flex items-center gap-3">
        <div class="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
          <Icon name="heroicons:code-bracket" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Editor</h2>
        
        <div class="h-4 w-[1px] bg-gray-200 dark:border-gray-700 mx-1"></div>
        
        <button @click="handleSwitchToOutput"
          class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all shadow-sm">
          <Icon name="heroicons:eye" class="w-4 h-4" />
          <span>Preview</span>
        </button>
      </div>
      
      <div class="flex items-center gap-2">
        <!-- Live Run Toggle -->
        <div class="flex items-center gap-2 mr-2 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <span class="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400">Live</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="liveRun" class="sr-only peer" />
            <div class="w-7 h-4 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-1.5">
          <button @click="runCode" v-show="!liveRun"
            class="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
            title="Run Code">
            <Icon name="heroicons:play" class="w-5 h-5" />
          </button>
          
          <button @click="saveCode"
            class="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
            title="Save HTML">
            <Icon name="heroicons:arrow-down-tray" class="w-5 h-5" />
          </button>

          <button @click="shareCode"
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 text-xs font-semibold">
            <Icon name="heroicons:share" class="w-4 h-4" />
            <span>{{ shareButtonText === 'Share' ? 'Share' : shareButtonText }}</span>
          </button>

          <button @click="toggleFullscreenHandler"
            class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Icon :name="fullScreenStore.isEditorFullscreen ? 'heroicons:arrows-pointing-in' : 'heroicons:arrows-pointing-out'" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- CodeMirror Editor Container -->
    <div
      class="relative flex-grow overflow-hidden"
      :class="{ 'fixed inset-0 z-50': fullScreenStore.isEditorFullscreen }">
      <ClientOnly>
        <div ref="editorContainer" class="w-full h-full" :class="{'dark-editor': isDarkMode}"></div>
        <template #fallback>
          <div class="flex items-center justify-center w-full h-full bg-card">
            <div class="flex flex-col items-center gap-3">
              <Icon name="heroicons:arrow-path" class="w-8 h-8 text-indigo-500 animate-spin" />
              <span class="text-sm text-gray-500 font-medium">Initializing Editor...</span>
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>

    <!-- Status Bar -->
    <div class="px-4 py-1.5 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1.5 text-[10px] font-medium text-gray-500">
          <Icon name="heroicons:document-text" class="w-3 h-3" />
          <span>HTML5</span>
        </div>
        <div class="flex items-center gap-1.5 text-[10px] font-medium text-gray-500">
          <Icon name="heroicons:cursor-arrow-rays" class="w-3 h-3" />
          <span>Live Preview: {{ liveRun ? 'ON' : 'OFF' }}</span>
        </div>
      </div>
      <div class="text-[10px] font-mono text-gray-400">
        UTF-8
      </div>
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
