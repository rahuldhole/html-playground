<script setup lang="ts">
const route = useRoute();
const colorMode = useColorMode();

const navItems = [
  { name: 'Editor', icon: 'heroicons:code-bracket', path: '/' },
  { name: 'Publish', icon: 'heroicons:eye', path: '/publish' },
  { name: 'Brotli', icon: 'heroicons:bolt', path: '/brotli' },
];

const toggleDarkMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};
</script>

<template>
  <aside class="w-20 lg:w-64 flex flex-col h-screen bg-card border-r border-gray-200 dark:border-gray-800 transition-all duration-300">
    <!-- Logo -->
    <div class="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Icon name="heroicons:sparkles" class="text-white w-5 h-5" />
        </div>
        <span class="font-bold text-xl hidden lg:block tracking-tight text-indigo-600 dark:text-indigo-400">PoW IDE</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 py-6 px-3 space-y-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.name"
        :to="item.path"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
        :class="[
          route.path === item.path
            ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
        ]"
      >
        <Icon :name="item.icon" class="w-6 h-6" />
        <span class="font-medium hidden lg:block">{{ item.name }}</span>
      </NuxtLink>
    </nav>

    <!-- Bottom Actions -->
    <div class="p-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
      <button
        @click="toggleDarkMode"
        class="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
      >
        <Icon :name="colorMode.value === 'dark' ? 'heroicons:sun' : 'heroicons:moon'" class="w-6 h-6" />
        <span class="font-medium hidden lg:block">{{ colorMode.value === 'dark' ? 'Light Mode' : 'Dark Mode' }}</span>
      </button>
      
      <div class="hidden lg:block p-4 mt-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800">
        <p class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Status</p>
        <div class="flex items-center gap-2 text-sm">
          <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span class="text-gray-600 dark:text-gray-300">Ready to code</span>
        </div>
      </div>
    </div>
  </aside>
</template>
