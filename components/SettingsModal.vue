<script setup lang="ts">
import { useEditorStore } from '~/stores/editor'
import { SYSTEM_PROMPT } from '~/shared/prompt'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const editorStore = useEditorStore()
const localPrompt = ref(editorStore.systemPrompt)

watch(() => editorStore.systemPrompt, (newPrompt) => {
  localPrompt.value = newPrompt
})

const handleSave = () => {
  editorStore.setSystemPrompt(localPrompt.value)
  emit('update:modelValue', false)
}

const handleReset = () => {
  if (confirm('Are you sure you want to reset the system prompt to the default?')) {
    localPrompt.value = SYSTEM_PROMPT
  }
}

const handleClear = () => {
  if (confirm('Are you sure you want to clear the system prompt?')) {
    localPrompt.value = ''
  }
}

const handleClose = () => {
  localPrompt.value = editorStore.systemPrompt
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="modelValue" class="fixed inset-0 z-[999] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="handleClose"></div>
        
        <!-- Modal Content -->
        <div class="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col max-h-[90vh]">
          <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">AI System Architect</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">Configure how the AI behaves and what libraries it uses.</p>
            </div>
            <button @click="handleClose" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
              <Icon name="heroicons:x-mark" class="w-6 h-6 text-gray-400" />
            </button>
          </div>
          
          <div class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">System Prompt</label>
                <div class="flex gap-4">
                  <button @click="handleClear" class="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline transition-all">Clear Prompt</button>
                  <button @click="handleReset" class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline transition-all">Reset to Default</button>
                </div>
              </div>
              <div class="relative group">
                <textarea 
                  v-model="localPrompt"
                  class="w-full h-[400px] bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-sm font-mono text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Enter custom system instructions..."
                ></textarea>
                <div class="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span class="text-[10px] text-gray-400 font-mono">{{ localPrompt.length }} chars</span>
                </div>
              </div>
              <p class="text-[10px] text-gray-400 italic">
                * This prompt defines the AI's identity, technical constraints, and design philosophy. Changes will apply to all future AI requests.
              </p>
            </div>
          </div>
          
          <div class="p-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-gray-950/50 rounded-b-3xl">
            <button @click="handleClose" class="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              Discard
            </button>
            <button @click="handleSave" class="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all">
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
}
</style>
