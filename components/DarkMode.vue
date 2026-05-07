<template>
    <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" v-model="isDarkMode" class="sr-only peer" />
        <div
            class="w-11 h-6 bg-black peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 dark:peer-checked:bg-blue-600">
            <span class="absolute left-1 top-1 text-xs text-gray-600">☀️</span>
            <span class="absolute right-1 top-1 text-xs text-white">🌙</span>
        </div>
    </label>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

// Reactive dark mode state
const isDarkMode = computed({
    get: () => colorMode.value === 'dark',
    set: (value) => {
        colorMode.preference = value ? 'dark' : 'light'
    }
})
</script>