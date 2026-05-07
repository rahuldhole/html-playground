<template>
    <div class="flex flex-col md:flex-row h-screen">
        <ClientOnly>
            <div id="editor-container" class="w-full md:w-1/2 h-full p-2">
                <EditorPanel />
            </div>
            <div id="output-container" class="w-full md:w-1/2 h-full p-2">
                <EditorOutputPanel />
            </div>
        </ClientOnly>
    </div>
</template>

<script setup>
</script>