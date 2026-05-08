<template>
  <div v-if="modelValue" class="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 p-3 z-50 overflow-hidden transform origin-top-right transition-all">
    <div class="flex items-center justify-between mb-3 px-1">
      <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Share Project</span>
      <button @click="close" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
        <Icon name="heroicons:x-mark" class="w-4 h-4" />
      </button>
    </div>

    <!-- Selection Stage -->
    <div v-if="!activeUrl" class="space-y-1.5">
      <button @click="handleSelect('editable')" class="w-full flex items-center gap-3 px-3 py-2.5 text-[11px] font-medium text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all group">
        <div class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
          <Icon name="heroicons:code-bracket" class="w-4 h-4" />
        </div>
        <div class="flex flex-col items-start text-left">
          <span>Editable Link</span>
          <span class="text-[9px] text-gray-400 dark:text-gray-500 font-normal">Recipients can edit the code</span>
        </div>
      </button>

      <button @click="handleSelect('publish')" class="w-full flex items-center gap-3 px-3 py-2.5 text-[11px] font-medium text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all group">
        <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
          <Icon name="heroicons:globe-alt" class="w-4 h-4" />
        </div>
        <div class="flex flex-col items-start text-left">
          <span>Publish Link</span>
          <span class="text-[9px] text-gray-400 dark:text-gray-500 font-normal">Clean read-only preview</span>
        </div>
      </button>
    </div>

    <!-- URL Display Stage -->
    <div v-else class="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div class="relative group">
        <input 
          readonly 
          :value="activeUrl"
          class="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-lg pl-3 pr-10 py-2.5 text-[11px] text-gray-600 dark:text-gray-300 focus:outline-none"
        />
        <button 
          @click="handleCopy"
          class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          :title="isCopied ? 'Copied!' : 'Copy to clipboard'"
        >
          <Icon :name="isCopied ? 'heroicons:check' : 'heroicons:clipboard-document'" class="w-4 h-4" :class="isCopied ? 'text-green-500' : 'text-gray-400'" />
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button 
          v-if="!isShortened"
          @click="handleShorten"
          :disabled="isShortening"
          class="flex-grow flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
        >
          <Icon v-if="isShortening" name="heroicons:arrow-path" class="w-3.5 h-3.5 animate-spin" />
          <Icon v-else name="heroicons:link" class="w-3.5 h-3.5" />
          <span>{{ isShortening ? 'Shortening...' : 'Shorten URL' }}</span>
        </button>
        
        <button 
          @click="activeUrl = ''; isShortened = false"
          class="px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
        >
          Back
        </button>
      </div>

      <div v-if="isShortened && !isDev" class="flex items-center gap-2 px-1 text-[9px] text-green-500 font-medium">
        <Icon name="heroicons:check-circle" class="w-3.5 h-3.5" />
        <span>URL Shortened successfully!</span>
      </div>

      <div v-if="isShortened && isDev" class="flex flex-col gap-1 px-1">
        <div class="flex items-center gap-2 text-[9px] text-amber-500 font-medium">
          <Icon name="heroicons:exclamation-triangle" class="w-3.5 h-3.5" />
          <span>Cannot shorten local URLs</span>
        </div>
        <p class="text-[8px] text-gray-400 leading-tight">Shortening services require a public domain. This will work once your app is deployed.</p>
      </div>

      <div v-if="shortenError" class="flex flex-col gap-1 px-1">
        <div class="flex items-center gap-2 text-[9px] text-red-500 font-medium">
          <Icon name="heroicons:exclamation-circle" class="w-3.5 h-3.5" />
          <span>Shortening failed</span>
        </div>
        <p class="text-[8px] text-gray-400 leading-tight">{{ shortenError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useEditor } from '~/composables/useEditor'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const { generateShareUrl, shortenUrl } = useEditor()
const { copy } = useClipboard({ legacy: true })

const activeUrl = ref('')
const isShortened = ref(false)
const isShortening = ref(false)
const isCopied = ref(false)
const isDev = ref(false)
const shortenError = ref<string | null>(null)

const close = () => {
  emit('update:modelValue', false)
}

const handleSelect = async (type: 'editable' | 'publish') => {
  activeUrl.value = await generateShareUrl(type)
  isShortened.value = false
}

const handleCopy = async () => {
  if (!activeUrl.value) return
  await copy(activeUrl.value)
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 2000)
}

const handleShorten = async () => {
  if (!activeUrl.value || isShortening.value) return
  isShortening.value = true
  shortenError.value = null
  
  const result = await shortenUrl(activeUrl.value)
  
  if (result.error) {
    shortenError.value = result.error
  } else if (result.shortUrl) {
    activeUrl.value = result.shortUrl
    isDev.value = !!result.isDev
    isShortened.value = true
  }
  
  isShortening.value = false
}

// Reset state when popover is closed/opened
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    activeUrl.value = ''
    isShortened.value = false
    isShortening.value = false
    shortenError.value = null
  }
})
</script>
