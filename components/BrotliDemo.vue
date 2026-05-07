<template>
  <section class="container mx-auto max-w-4xl p-6 flex flex-col gap-6" aria-labelledby="compression-tool-heading">
    <h1 id="compression-tool-heading" class="absolute w-px h-px p-0 -m-px overflow-hidden clip-rect-0 border-0">
      Brotli Text Compression Tool
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="flex flex-col gap-2">
        <label for="input-text" class="absolute w-px h-px p-0 -m-px overflow-hidden clip-rect-0 border-0">
          Enter text to compress with Brotli
        </label>
        <textarea
          v-model="text"
          id="input-text"
          placeholder="Enter text to compress with Brotli"
          class="w-full h-48 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
          aria-describedby="input-description"
        ></textarea>
        <p id="input-description" class="absolute w-px h-px p-0 -m-px overflow-hidden clip-rect-0 border-0">
          Enter any text to compress it using the Brotli compression algorithm.
        </p>
        <span class="text-sm text-gray-600 dark:text-gray-400">
          Length: {{ text.length }} characters
        </span>
      </div>

      <div class="flex flex-col gap-2">
        <label for="compressed-text" class="absolute w-px h-px p-0 -m-px overflow-hidden clip-rect-0 border-0">
          Compressed or decompressed text from Brotli
        </label>
        <textarea
          v-model="compressed"
          id="compressed-text"
          placeholder="Compressed text will appear here"
          class="w-full h-48 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          aria-describedby="compressed-description"
        ></textarea>
        <p id="compressed-description" class="absolute w-px h-px p-0 -m-px overflow-hidden clip-rect-0 border-0">
          View the compressed or decompressed text from Brotli compression.
        </p>
        <span class="text-sm text-gray-600 dark:text-gray-400">
          Length: {{ compressed ? compressed.length : 0 }} characters
        </span>
      </div>
    </div>

    <div v-if="error" class="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700 text-red-700 dark:text-red-200 p-4 rounded-2xl flex items-center justify-between">
      <div>
        <p class="font-semibold">Error</p>
        <p>{{ error }}</p>
      </div>
      <button @click="error = null" class="text-red-700 dark:text-red-200 hover:text-red-900 dark:hover:text-red-400 focus:outline-none" aria-label="Dismiss error">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <div class="flex flex-col gap-4 md:flex-row md:gap-6 justify-center">
      <button
        @click="compressText"
        class="btn bg-green-500 text-white py-3 px-6 rounded-2xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        :disabled="!text"
        aria-label="Compress the entered text using Brotli"
      >
        Compress
      </button>

      <button
        @click="decompressText"
        class="btn bg-blue-500 text-white py-3 px-6 rounded-2xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        :disabled="!compressed"
        aria-label="Decompress the Brotli-compressed data"
      >
        Decompress
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
const text = ref('Hello, world!');
const compressed = ref(null);
const error = ref(null);

const { compress, decompress } = useBrotli();

const compressText = async () => {
  try {
    compressed.value = '';
    error.value = null;
    compressed.value = await compress(text.value);
    console.log(compressed.value);
  } catch (err) {
      error.value = err.message || 'An error occurred during compression.';
  }
};

const decompressText = async () => {
  try {
    text.value = '';
    error.value = null;
    text.value = await decompress(compressed.value);
    console.log(text.value);
  } catch (err) {
      error.value = err.message || 'An error occurred during decompression.';
  }
};

useHead({
  title: 'Brotli Text Compression Tool | Compress and Decompress Online',
  meta: [
    {
      name: 'description',
      content: 'Compress and decompress text online using the Brotli algorithm. Fast, efficient, and easy-to-use tool for text compression.',
    },
    {
      name: 'keywords',
      content: 'brotli compression, text compression tool, online text compressor, decompress brotli, nuxt js tool',
    },
    {
      name: 'robots',
      content: 'index, follow',
    },
    {
      property: 'og:title',
      content: 'Brotli Text Compression Tool',
    },
    {
      property: 'og:description',
      content: 'Use this free online tool to compress and decompress text with Brotli, a modern compression algorithm.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
  ],
});
</script>