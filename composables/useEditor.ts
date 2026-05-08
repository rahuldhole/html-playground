import { ref } from 'vue'
import { useDebounceFn, useClipboard } from '@vueuse/core'
import { useRoute, useRouter } from 'nuxt/app'
import { useEditorStore } from '~/stores/editor'

export function useEditor() {
  const route = useRoute()
  const router = useRouter()
  const editorStore = useEditorStore()
  // @ts-ignore
  const { compress, decompress } = useBrotli()
  // @ts-ignore
  const { generateQr } = useQr()
  const { copy } = useClipboard({ legacy: true })
  
  // Shared UI state
  const shareButtonText = ref<string>('Share')
  
  // Using a direct function to get the iframe rather than storing a reference
  const getOutputIframe = (): HTMLIFrameElement | null => {
    // Try to get the iframe element directly
    return document.querySelector('iframe') || null
  }

  // DEPRECATED: Debounced update for URL sharing
  const debouncedUpdateUrl = useDebounceFn(() => {
    updateUrlWithCode()
  }, 500)

  // Function to update URL with current code using hash
  const updateUrlWithCode = async () => {
    const compressedCode = await compress(editorStore.htmlCode)
    const base64CompressedCode = btoa(compressedCode)  // Convert to Base64
    const encodedCode = encodeURIComponent(base64CompressedCode)  // Encode URI
    router.push({
      hash: `#code=${encodedCode}`
    })
  }

  // Function to load code from URL hash
  const getCodeFromUrl = async (): Promise<string> => {
    const hash = route.hash.slice(1) // Remove the '#' prefix
    const params = new URLSearchParams(hash)
    const base64CompressedCode = params.get('code')
    if (base64CompressedCode) {
      const compressedCode = atob(decodeURIComponent(base64CompressedCode))  // Decode Base64 and URI
      return await decompress(compressedCode)  // Decompress the code
    }
    return ''
  }

  const loadEditorFromUrl = async () => {
    const code = await getCodeFromUrl()
    if(code) editorStore.setHtmlCode(code)
  }

  const getShortenedUrl = async (url: string): Promise<string> => {
    try {
      const data = await $fetch<{ shortUrl?: string, error?: string }>('/api/shorten', {
        method: 'POST',
        body: { url }
      })
      return data.shortUrl || url
    } catch (err) {
      console.error('Shortening failed:', err)
      return url
    }
  }

  const generateShareUrl = async (type: 'editable' | 'publish'): Promise<string> => {
    const compressedCode = await compress(editorStore.htmlCode)
    const base64CompressedCode = btoa(compressedCode)
    const encodedCode = encodeURIComponent(base64CompressedCode)
    
    if (type === 'editable') {
      return `${window.location.origin}/publish#code=${encodedCode}`
    } else {
      return `${window.location.origin}/publish?publish=true#code=${encodedCode}`
    }
  }

  const shortenUrl = async (url: string): Promise<{ shortUrl?: string, isDev?: boolean, error?: string }> => {
    try {
      // Using axios with allorigins proxy to bypass CORS
      const axios = (await import('axios')).default;
      const targetUrl = `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`;
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
      
      const response = await axios.get(proxyUrl);
      const data = response.data;
      
      // Allorigins wraps the response in a 'contents' field
      if (data.contents && data.contents.startsWith('http')) {
        console.log("Shortened URL:", data.contents);
        return { shortUrl: data.contents };
      } else {
        return { error: 'Invalid response from shortening service.' };
      }
    } catch (e: any) {
      console.error("Shortening failed", e);
      return { error: 'CORS/API Error: Could not reach the shortener.' };
    }
  }

  // Share code function using hash
  const shareCode = async () => {
    const shareUrl = await generateShareUrl('editable')
    try {
      await copy(shareUrl)
      generateQr(shareUrl)
      shareButtonText.value = 'Copied!'
      setTimeout(() => {
        shareButtonText.value = 'Share'
      }, 2000)
    } catch (err) {
      console.error('Failed to copy URL: ', err)
    }
  }

  // Share publish function using hash
  const shareOutput = async () => {
    const shareUrl = await generateShareUrl('publish')
    try {
      await copy(shareUrl)
      generateQr(shareUrl)
      shareButtonText.value = 'Copied!'
      setTimeout(() => {
        shareButtonText.value = 'Share'
      }, 2000)
    } catch (err) {
      console.error('Failed to copy URL: ', err)
    }
  }

  let currentBlobUrl: string | null = null

  // Function to update output iframe with current code - now gets iframe directly
  const updateOutput = () => {
    // Trigger the store refresh which OutputPanel watches for seamless updates
    editorStore.triggerRefresh()
    
    // Fallback for standalone pages or situations where OutputPanel isn't used
    // but a manual update is requested
    const iframe = getOutputIframe()
    
    // If we're in the main editor (which has #output-container), we let OutputPanel 
    // handle the update seamlessly via the triggerRefresh() above.
    // Otherwise, we update the iframe directly.
    if (!iframe || document.getElementById('output-container')) {
      return
    }
    
    try {
      // Clean up previous blob URL to prevent memory leaks
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl)
      }

      const fullHtml = `
        <!DOCTYPE html>
        <html style="height: 100%;">
        <head>
          <meta charset="UTF-8">
          <style>
            html, body {
              margin: 0;
              padding: 0;
              height: 100%;
              width: 100%;
              background-color: ${editorStore.isOutputDark ? 'oklch(0.278 0.033 256.848)' : '#ffffff'};
              color: ${editorStore.isOutputDark ? '#ffffff' : '#000000'};
              font-family: Arial, sans-serif;
            }
          </style>
        </head>
        <body>
        ${editorStore.htmlCode}
        </body>
        </html>
      `

      const blob = new Blob([fullHtml], { type: 'text/html' })
      currentBlobUrl = URL.createObjectURL(blob)
      iframe.src = currentBlobUrl
    } catch (error) {
      console.error('Error updating output:', error)
    }
  }
  
  // Method for switching between editor and output - simplified to use the store trigger
  const switchToOutput = () => {
    editorStore.triggerFullscreenSwitch('output')
    updateOutput()
  }

  const switchToEditor = () => {
    editorStore.triggerFullscreenSwitch('editor')
  }
  
  const runCode = () => {
    updateOutput()
  }
  
  // Method to save HTML code to a file
  const saveCode = () => {
    const fullHtmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Saved HTML</title>
</head>
<body>
${editorStore.htmlCode}
</body>
</html>`;

    const blob = new Blob([fullHtmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.html';
    
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }

  return {
    getCodeFromUrl,
    loadEditorFromUrl,
    generateShareUrl,
    shortenUrl,
    shareCode,
    shareOutput,
    updateUrlWithCode,
    debouncedUpdateUrl,
    shareButtonText,
    updateOutput,
    switchToOutput,
    switchToEditor,
    runCode,
    saveCode
  }
}
