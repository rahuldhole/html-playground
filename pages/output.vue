<script setup lang="ts">
import { useEditorStore } from '~/stores/editor'
import Welcome from '~/components/Welcome.vue'

const layout = useState('layout')

onBeforeMount(() => {
  layout.value = 'blank'
})

const { getCodeFromUrl } = useEditor()

// Disable layout to avoid wrapping
definePageMeta({
  layout: false,
})

const route = useRoute()
const editorStore = useEditorStore()
const code = ref<string | null>(null)
const run = ref<boolean>(false)
const showButtons = ref<boolean>(false)

const blobUrl = computed(() => {
  const htmlContent = code.value || editorStore.htmlCode
  return URL.createObjectURL(new Blob([htmlContent], { type: 'text/html' }))
})

onBeforeMount(async () => {
  code.value = await getCodeFromUrl()
  run.value = route.query.run === 'true'
  if (code.value || run.value) {
    openInNewTab(blobUrl.value)
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
        <div v-if="showButtons" class="fixed bottom-6 right-6 z-50 bg-white p-4 rounded-lg shadow-lg flex flex-col items-center space-y-4 w-48">
          <button @click="closeCard" class="absolute top-0 right-0 w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full shadow-md flex items-center justify-center">
            <Icon name="carbon:close" class="text-white w-4 h-4" />
          </button>
          
          <button @click="openInNewTab(blobUrl)" class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center space-x-2 shadow-md">
            <Icon name="carbon:view" class="w-4 h-4" />
            <span>View</span>
          </button>

          <NuxtLink :to="`/editor${route.hash}`" class="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center justify-center space-x-2 shadow-md">
            <Icon name="carbon:edit" class="w-4 h-4" />
            <span>Edit</span>
          </NuxtLink>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>
