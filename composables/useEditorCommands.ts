import { computed } from 'vue'
import { useClipboard } from '@vueuse/core'
import js_beautify from 'js-beautify'
import type { EditorView } from '@codemirror/view'
import { useEditorStore } from '~/stores/editor'

export function useEditorCommands(editorView: () => EditorView | null) {
  const editorStore = useEditorStore()
  const { copy, copied: isCopied } = useClipboard({ legacy: true })
  
  const copyIcon = computed(() => isCopied.value ? 'heroicons:check' : 'heroicons:clipboard-document')

  const handleUndo = () => {
    const view = editorView()
    if (view) {
      view.focus()
      const isMac = /Mac/.test(navigator.platform)
      const event = new KeyboardEvent('keydown', {
        key: 'z',
        code: 'KeyZ',
        ctrlKey: !isMac,
        metaKey: isMac,
        bubbles: true,
        cancelable: true
      })
      view.contentDOM.dispatchEvent(event)
    }
  }

  const handleRedo = () => {
    const view = editorView()
    if (view) {
      view.focus()
      const isMac = /Mac/.test(navigator.platform)
      const isShift = isMac
      const event = new KeyboardEvent('keydown', {
        key: isMac ? 'z' : 'y',
        code: isMac ? 'KeyZ' : 'KeyY',
        ctrlKey: !isMac,
        metaKey: isMac,
        shiftKey: isShift,
        bubbles: true,
        cancelable: true
      })
      view.contentDOM.dispatchEvent(event)
    }
  }

  const handleCopy = () => {
    const view = editorView()
    if (view) {
      copy(view.state.doc.toString())
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

  return {
    isCopied,
    copyIcon,
    handleUndo,
    handleRedo,
    handleCopy,
    handleClear,
    handleBeautify
  }
}
