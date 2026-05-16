<script setup lang="ts">
defineRouteRules({
  prerender: false,
  ssr: false
})
import { useEditorStore } from '~/stores/editor'
import Welcome from '~/components/Welcome.vue'

const { getCodeFromUrl } = useEditor()

// Disable layout to avoid wrapping
definePageMeta({
  layout: false
})

const route = useRoute()
const editorStore = useEditorStore()
const code = ref<string | null>(null)
const run = ref<boolean>(false)
const showButtons = ref<boolean>(route.query.publish !== 'true')

const handleKeydown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') {
    e.preventDefault()
    navigateTo(`/editor${route.hash}`)
  }
}

onMounted(async () => {
  code.value = await getCodeFromUrl()
  run.value = route.query.run === 'true'
  
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const blobUrl = computed(() => {
  if (!process.client) return ''
  const htmlContent = code.value || editorStore.htmlCode
  try {
    return URL.createObjectURL(new Blob([htmlContent], { type: 'text/html' }))
  } catch (e) {
    return ''
  }
})

const openInNewTab = (url: string) => {
  const newWindow = window.open(url, '_run')
  if (newWindow) {
    newWindow.focus()
  } else {
    showButtons.value = true
  }
}

const closeCard = () => {
  showButtons.value = false
}

const iframeError = ref<boolean>(false)
const outputFrame = ref<HTMLIFrameElement | null>(null)
const handleIframeLoad = () => {
  if (!outputFrame.value) return
  const iframeDocument = outputFrame.value.contentDocument || outputFrame.value.contentWindow?.document
  if (!iframeDocument) return
  const body = iframeDocument.body
  if (!body) return
  body.style.margin = '0'
  body.style.padding = '0'
  
  iframeDocument.addEventListener('keydown', handleKeydown)
}
const handleIframeError = () => {
  iframeError.value = true
}
</script>

<template>
  <div>
    <ClientOnly>
      <Welcome v-if="!code && !run" />
      <div v-else>
        <iframe
          ref="outputFrame"
          :src="blobUrl"
          class="w-full h-screen border-none"
          sandbox="allow-same-origin allow-scripts allow-modals allow-popups allow-forms"
          @load="handleIframeLoad"
          @error="handleIframeError"
        ></iframe>
        <div v-if="iframeError" class="text-red-600 text-center mt-4">
          An error occurred while loading the content.
        </div>
        <div v-if="showButtons" class="fixed bottom-8 right-8 z-[99999] flex items-center gap-1.5 p-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-2xl border border-gray-200/50 transition-all duration-300 hover:shadow-indigo-500/10 ring-1 ring-black/5">
          <button @click="openInNewTab(blobUrl)" class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors group">
            <Icon name="heroicons:arrow-top-right-on-square" class="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            <span>Run in sandbox</span>
          </button>

          <div class="w-px h-5 bg-gray-200"></div>

          <NuxtLink :to="`/editor${route.hash}`" class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors shadow-sm shadow-indigo-600/20 group">
            <Icon name="heroicons:code-bracket" class="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Edit Code</span>
          </NuxtLink>

          <button @click="closeCard" class="flex items-center justify-center w-8 h-8 ml-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Hide">
            <Icon name="heroicons:x-mark" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>
