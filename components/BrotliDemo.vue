<template>
  <section class="space-y-6" aria-labelledby="compression-tool-heading">
    <h1 id="compression-tool-heading" class="sr-only">Brotli Text Compression Tool</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Input Section -->
      <div class="flex flex-col gap-3 bg-card p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div class="flex items-center justify-between">
          <label for="input-text" class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-tight">
            <Icon name="heroicons:document-text" class="w-4 h-4 text-indigo-500" />
            Input Text
          </label>
          <span class="text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
            {{ text.length }} chars
          </span>
        </div>
        
        <textarea
          v-model="text"
          id="input-text"
          placeholder="Enter text to compress..."
          class="w-full h-64 p-4 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none text-sm font-mono"
        ></textarea>
        
        <button
          @click="compressText"
          class="flex items-center justify-center gap-2 w-full py-3 px-6 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-md shadow-indigo-500/20"
          :disabled="!text"
        >
          <Icon name="heroicons:chevron-double-right" class="w-5 h-5" />
          Compress
        </button>
      </div>

      <!-- Result Section -->
      <div class="flex flex-col gap-3 bg-card p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
        <div class="flex items-center justify-between">
          <label for="compressed-text" class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-tight">
            <Icon name="heroicons:check-badge" class="w-4 h-4 text-green-500" />
            Brotli Output
          </label>
          <span class="text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
            {{ compressed ? compressed.length : 0 }} chars
          </span>
        </div>
        
        <textarea
          v-model="compressed"
          id="compressed-text"
          placeholder="Compressed output will appear here..."
          class="w-full h-64 p-4 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-sm font-mono"
        ></textarea>
        
        <button
          @click="decompressText"
          class="flex items-center justify-center gap-2 w-full py-3 px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-md shadow-blue-500/20"
          :disabled="!compressed"
        >
          <Icon name="heroicons:chevron-double-left" class="w-5 h-5" />
          Decompress
        </button>

        <!-- Stats Overlay (Subtle) -->
        <div v-if="compressed && text" class="absolute top-4 right-4 animate-in fade-in zoom-in duration-300">
          <div class="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
            -{{ Math.round((1 - compressed.length / text.length) * 100) }}% Smaller
          </div>
        </div>
      </div>
    </div>

    <!-- Error Toast -->
    <Transition name="fade">
      <div v-if="error" class="fixed bottom-6 right-6 max-w-sm bg-red-600 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 z-50">
        <Icon name="heroicons:exclamation-triangle" class="w-6 h-6 flex-shrink-0" />
        <div class="flex-1">
          <p class="font-bold text-sm">Compression Error</p>
          <p class="text-xs opacity-90">{{ error }}</p>
        </div>
        <button @click="error = null" class="p-1 hover:bg-white/20 rounded transition-colors">
          <Icon name="heroicons:x-mark" class="w-4 h-4" />
        </button>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useBrotli } from '~/composables/useBrotli';

const text = ref('Hello, world!');
const compressed = ref<string | null>(null);
const error = ref<string | null>(null);

const { compress, decompress } = useBrotli();

const compressText = async () => {
  try {
    compressed.value = '';
    error.value = null;
    compressed.value = await compress(text.value);
    console.log(compressed.value);
  } catch (err: any) {
    error.value = err.message || 'An error occurred during compression.';
  }
};

const decompressText = async () => {
  try {
    if (!compressed.value) return;
    text.value = '';
    error.value = null;
    text.value = await decompress(compressed.value);
    console.log(text.value);
  } catch (err: any) {
    error.value = err.message || 'An error occurred during decompression.';
  }
};

useHead({
  title: 'Brotli Text Compression Tool | Professional Utility',
  meta: [
    {
      name: 'description',
      content: 'Compress and decompress text online using the Brotli algorithm. Fast, efficient, and easy-to-use tool for text compression.',
    },
  ],
});
</script>