<script setup lang="ts">
import { useEditorStore } from '~/stores/editor'
import js_beautify from 'js-beautify'

const editorStore = useEditorStore()

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
</script>
<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm p-4 sticky top-0 z-10">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex gap-2">
        <div class="p-2 bg-gray-950 dark:bg-gray-800 rounded-full">
          <img src="https://playonweb.org/logo.svg" height="25" width="25px" class="color-white"/>
        </div>
        <h1 class="p-1 text-2xl font-bold text-gray-900 dark:text-white">
          PoW IDE
        </h1>
      </div>
      <div class="flex gap-4 items-center">
        <button @click="handleBeautify" class="text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="Beautify Code">
          <Icon name="lucide:wand-2" class="w-6 h-6" />
        </button>
        <a href="https://github.com/playonweb/pow-ide/issues" target="_blank" class="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
          <p class="flex items-center gap-2">
            <Icon name="material-symbols:bug-report" class="w-6 h-6" />
            <span class="hidden lg:block">
              Report
            </span>
          </p>
        </a>
        <DarkMode />
      </div>
    </div>
  </header>
</template>