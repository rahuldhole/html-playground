<template>
  <UPopover 
    :popper="{ placement: 'bottom-start', offsetDistance: 12, strategy: 'fixed' }" 
    :ui="{ 
      content: isMobile 
        ? 'w-[calc(100vw-2rem)] max-w-sm rounded-[1.5rem] shadow-2xl bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border border-gray-100 dark:border-gray-800/50 ring-1 ring-black/5 dark:ring-white/5'
        : 'w-80 md:w-96 rounded-[1.5rem] shadow-2xl bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border border-gray-100 dark:border-gray-800/50 ring-1 ring-black/5 dark:ring-white/5'
    }"
  >
    <button
      class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all shadow-sm"
      :class="[
        showAIPopup ? 'bg-indigo-600 text-white border-indigo-600' : 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        !isMobile && !showAIPopup ? 'hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400' : ''
      ]"
      @click="showAIPopup = !showAIPopup"
    >
      <Icon name="heroicons:sparkles" class="w-3.5 h-3.5" :class="{ 'animate-pulse': isAILoading }" />
      <span v-if="!isMobile && !isCompact">AI</span>
    </button>

    <template #content>
      <div class="p-5 space-y-4 md:space-y-5">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 md:gap-3">
            <div class="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Icon name="heroicons:sparkles" class="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h3 v-if="!isMobile" class="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2">
                AI Assistant
                <span class="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[8px] font-bold uppercase tracking-wider border border-indigo-100/50 dark:border-indigo-500/20">
                  {{ isEditMode ? 'Edit' : 'New' }}
                </span>
              </h3>
              <span v-else class="text-xs font-bold text-gray-900 dark:text-white">Magic Assistant</span>
              <p v-if="!isMobile" class="text-[10px] text-gray-500 dark:text-gray-400 leading-none mt-0.5">How can I help you today?</p>
            </div>
          </div>
          <span v-if="isMobile" class="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[8px] font-bold uppercase tracking-wider">
            {{ isEditMode ? 'Edit' : 'New' }}
          </span>
        </div>

        <!-- Thinking Status -->
        <div v-if="!isMobile && (aiReasoning || (isAILoading && aiStatusText !== 'Thinking...'))" 
          class="p-3 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-2xl border border-indigo-500/10 dark:border-indigo-500/20">
          <div class="flex items-center gap-2 mb-1.5">
            <div class="flex gap-0.5">
              <span class="w-1 h-1 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></span>
              <span class="w-1 h-1 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]"></span>
              <span class="w-1 h-1 rounded-full bg-indigo-500 animate-bounce"></span>
            </div>
            <span class="text-[9px] font-bold uppercase text-indigo-600 dark:text-indigo-400 tracking-widest">Reasoning</span>
          </div>
          <p class="text-[11px] text-gray-600 dark:text-gray-300 italic leading-snug">
            {{ aiReasoning || aiStatusText }}
          </p>
        </div>

        <!-- Input Area -->
        <div class="space-y-2">
          <div v-if="!isMobile" class="flex items-center justify-between">
            <label class="text-[9px] font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider">Instruction</label>
          </div>
          <textarea 
            ref="aiInput"
            v-model="aiPrompt"
            @keydown.enter.exact.prevent="handleAISubmit"
            :disabled="isAILoading"
            :placeholder="isMobile ? 'Instruction...' : 'e.g. Add a dark theme or fix the layout...'"
            class="w-full h-28 bg-gray-50/50 dark:bg-gray-950/50 border border-gray-100 dark:border-gray-800 rounded-2xl p-3.5 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all resize-none disabled:opacity-50 placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-inner"
          ></textarea>
        </div>

        <!-- Model Row -->
        <div class="flex items-center gap-3">
          <div class="flex-1">
            <USelectMenu 
              v-model="selectedModel" 
              :items="modelOptions" 
              value-key="id"
              class="w-full"
              :ui="{ 
                base: 'bg-white dark:bg-gray-950 rounded-xl border border-gray-100 dark:border-gray-800 h-10 transition-all hover:border-indigo-500/50',
                content: 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl rounded-2xl'
              }"
              :popper="{ zIndex: 10001, strategy: 'fixed' }"
            >
              <template #default>
                <div class="flex items-center gap-2 px-3 py-2">
                  <Icon :name="currentModel?.icon || 'heroicons:cpu-chip'" class="w-4 h-4 text-indigo-500" />
                  <span class="text-[11px] font-bold text-gray-700 dark:text-gray-200 truncate">{{ currentModel?.name }}</span>
                </div>
              </template>
              <template #item="{ item: model }">
                <div class="flex items-center gap-2.5 py-1.5 w-full">
                  <div class="w-7 h-7 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                    <Icon :name="model.icon || 'heroicons:cpu-chip'" class="w-4 h-4" />
                  </div>
                  <p class="text-[11px] font-bold text-gray-700 dark:text-gray-200 truncate">{{ model.label }}</p>
                </div>
              </template>
            </USelectMenu>
          </div>
          <button v-if="!isMobile" @click="$emit('openSettings')" 
            class="h-10 px-3.5 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center">
            <Icon name="heroicons:cog-6-tooth" class="w-5 h-5" />
          </button>
        </div>

        <!-- Actions -->
        <div v-if="!isMobile" class="flex items-center justify-between pt-1">
          <p class="text-[9px] text-gray-400 italic hidden sm:block">Press Enter to sync</p>
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <button 
              v-if="isAILoading"
              @click="handleCancelAI"
              class="flex-1 sm:flex-none px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2"
            >
              <Icon name="heroicons:stop-circle" class="w-4 h-4" />
              <span>Stop</span>
            </button>
            <button 
              @click="handleAISubmit"
              :disabled="isAILoading || !aiPrompt"
              class="flex-1 sm:flex-none px-6 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-[10px] font-bold uppercase shadow-xl shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Icon v-if="isAILoading" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
              <Icon v-else name="heroicons:bolt" class="w-4 h-4" />
              <span>{{ isAILoading ? 'Generating...' : 'Generate' }}</span>
            </button>
          </div>
        </div>
        
        <button v-else
          @click="handleAISubmit"
          :disabled="isAILoading || !aiPrompt"
          class="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-xs font-bold uppercase shadow-xl shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Icon v-if="isAILoading" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
          <Icon v-else name="heroicons:bolt" class="w-4 h-4" />
          <span>{{ isAILoading ? 'Syncing...' : 'Magic Sync' }}</span>
        </button>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps<{
  isMobile: boolean;
  isCompact: boolean;
  isAILoading: boolean;
  isEditMode: boolean;
  aiReasoning: string;
  aiStatusText: string;
  modelOptions: any[];
  currentModel: any;
}>()

const showAIPopup = defineModel<boolean>('showAIPopup', { default: false })
const aiPrompt = defineModel<string>('aiPrompt', { default: '' })
const selectedModel = defineModel<string>('selectedModel', { default: '' })

const emit = defineEmits<{
  (e: 'openSettings'): void;
  (e: 'submit'): void;
  (e: 'cancel'): void;
}>()

const handleAISubmit = () => emit('submit')
const handleCancelAI = () => emit('cancel')

const aiInput = ref<HTMLTextAreaElement | null>(null)

watch(showAIPopup, async (val) => {
  if (val) {
    await nextTick()
    aiInput.value?.focus()
  }
})
</script>
