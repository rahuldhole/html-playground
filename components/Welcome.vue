<template>
    <div
        class="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <h1 class="text-3xl font-bold mb-4">Welcome to PoW IDE</h1>
        <p class="text-lg mb-6">It looks like you haven’t started coding yet!</p>
        <div class="flex gap-3">
            <a href="/editor"
                class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-lg transition-colors">
                Go to Editor
            </a>
            <a href="?run=true"
                class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-md text-lg transition-colors">
                Continue
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
// No logic needed, just a static component
</script>