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
      <div v-if="showQr" class="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-3 animate-in zoom-in-95 duration-200">
        <div @click="openQrInNewTab" class="block group/qr cursor-zoom-in">
          <img :src="qrCode" alt="QR Code" class="w-40 h-40 bg-white p-2 rounded-lg shadow-sm group-hover/qr:scale-105 transition-transform" />
        </div>
        <span class="text-[10px] font-medium text-gray-400">Click to expand</span>
        <button @click="showQr = false" class="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 uppercase tracking-wider">Close QR</button>
      </div>

      <div class="relative group">
        <button 
          v-if="canGenerateQr"
          @click="handleShowQr"
          class="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          :class="showQr ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'text-gray-400'"
          title="Show QR Code"
        >
          <Icon name="heroicons:qr-code" class="w-4 h-4" />
        </button>
        <input 
          readonly 
          :value="activeUrl"
          class="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-lg pr-10 py-2.5 text-[11px] text-gray-600 dark:text-gray-300 focus:outline-none"
          :class="canGenerateQr ? 'pl-10' : 'pl-3'"
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
import { ref, watch, computed } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useEditor } from '~/composables/useEditor'
import { useQr } from '~/composables/useQr'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const { generateShareUrl, shortenUrl } = useEditor()
const { qrCode, generateQr } = useQr()
const { copy } = useClipboard({ legacy: true })

const activeUrl = ref('')
const isShortened = ref(false)
const isShortening = ref(false)
const isCopied = ref(false)
const isDev = ref(false)
const shortenError = ref<string | null>(null)
const showQr = ref(false)

const canGenerateQr = computed(() => {
  return activeUrl.value.length < 1817
})

const close = () => {
  emit('update:modelValue', false)
}

const handleSelect = async (type: 'editable' | 'publish') => {
  activeUrl.value = await generateShareUrl(type)
  isShortened.value = false
  showQr.value = false
}

const handleShowQr = async () => {
  if (!activeUrl.value) return
  await generateQr(activeUrl.value)
  showQr.value = !showQr.value
}

const handleCopy = async () => {
  if (!activeUrl.value) return
  await copy(activeUrl.value)
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 2000)
}

const openQrInNewTab = () => {
  if (!qrCode.value) return
  const newWindow = window.open();
  if (newWindow) {
    newWindow.document.write(`
      <html>
        <head>
          <title>QR Code</title>
          <style>
            body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f8fafc; font-family: sans-serif; }
            img { max-width: 90vw; max-height: 90vh; background: white; padding: 20px; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); }
          </style>
        </head>
        <body>
          <img src="${qrCode.value}" alt="QR Code" />
        </body>
      </html>
    `);
    newWindow.document.close();
  }
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
    showQr.value = false
  }
})
</script>
