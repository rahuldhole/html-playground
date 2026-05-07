<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-app overflow-hidden relative">
    <!-- Decorative Gradients -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]"></div>

    <div class="z-10 text-center space-y-8 max-w-2xl px-6">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 animate-bounce">
        <Icon name="heroicons:sparkles" class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <span class="text-sm font-semibold text-indigo-600 dark:text-indigo-400">New Version 2.0</span>
      </div>

      <div class="space-y-4">
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
          Code with <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Precision.</span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
          The professional online IDE for HTML, CSS, and JS. 
          Real-time preview, high-performance compression, and seamless sharing.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink to="/"
          class="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-3 scale-hover">
          <Icon name="heroicons:code-bracket" class="w-6 h-6" />
          Start Coding Now
        </NuxtLink>
        
        <NuxtLink to="/brotli"
          class="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-2xl text-lg font-bold hover:border-indigo-500 dark:hover:border-indigo-500 transition-all flex items-center justify-center gap-3 scale-hover">
          <Icon name="heroicons:bolt" class="w-6 h-6" />
          Explore Tools
        </NuxtLink>
      </div>

      <div class="pt-12 grid grid-cols-3 gap-8 border-t border-gray-100 dark:border-gray-800">
        <div class="text-center">
          <p class="text-2xl font-bold text-gray-900 dark:text-white">Live</p>
          <p class="text-sm text-gray-500">Preview</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-gray-900 dark:text-white">Brotli</p>
          <p class="text-sm text-gray-500">Speed</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-gray-900 dark:text-white">Secure</p>
          <p class="text-sm text-gray-500">Sharing</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No logic needed, just a static component
</script>