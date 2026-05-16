<template>
  <div 
    v-if="modelValue" 
    ref="menuRef"
    class="absolute top-full left-0 z-[110] bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 p-4 w-72 mt-2"
  >
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Boilerplates</h3>
      <button @click="closeMenu" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 dark:hover:text-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    
    <!-- Search input -->
    <div class="relative mb-3">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
      </div>
      <input 
        type="text" 
        v-model="searchText" 
        class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        placeholder="Search templates..." 
      />
    </div>
    
    <!-- Templates list with max height and scrolling -->
    <div class="max-h-[400px] overflow-y-auto pr-1">
      <div v-if="Object.keys(filteredTemplatesByCategory).length">
        <div v-for="(items, category) in filteredTemplatesByCategory" :key="category" class="mb-6 last:mb-0">
          <h4 class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-3 px-2 flex items-center gap-2">
            {{ category }}
            <span class="flex-grow h-[1px] bg-gray-100 dark:bg-gray-700/50"></span>
          </h4>
          <ul class="space-y-1">
            <li v-for="template in items" :key="template.id">
              <div class="group/item relative flex items-center p-0.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800/30">
                <button @click="selectBoilerplate(template.file)"
                   class="flex-1 flex items-center gap-3 p-2 rounded-lg text-left text-gray-800 dark:text-gray-200 transition-colors">
                  <img v-if="template.icon" :src="template.icon" :alt="template.name" class="w-6 h-6 object-contain shrink-0" />
                  <span v-else class="w-6 h-6 flex items-center justify-center shrink-0">
                    <span v-html="template.svg" class="w-6 h-6 flex items-center justify-center"></span>
                  </span>
                  <div class="flex-grow min-w-0">
                    <div class="font-bold text-xs truncate leading-tight">{{ template.name }}</div>
                    <div class="text-[9px] text-gray-500 dark:text-gray-400 truncate mt-0.5 leading-tight">{{ template.description }}</div>
                  </div>
                </button>
                
                <button 
                  @click.stop="previewBoilerplate(template.file)"
                  title="Preview in new tab"
                  class="opacity-0 group-hover/item:opacity-100 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 transition-all mr-1"
                >
                  <Icon name="heroicons:arrow-top-right-on-square" class="w-3.5 h-3.5" />
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="text-center py-12 space-y-2">
        <div class="text-gray-300 dark:text-gray-600 flex justify-center">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <div class="text-sm font-medium text-gray-500 dark:text-gray-400">No matching templates</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { BOILERPLATES as templates } from '~/shared/boilerplates';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'select']);

// Search functionality
const searchText = ref('');
const filteredTemplatesByCategory = computed(() => {
  const searchLower = searchText.value.toLowerCase();
  const filtered = templates.filter(template => 
    !searchText.value || 
    template.name.toLowerCase().includes(searchLower) || 
    template.description.toLowerCase().includes(searchLower) ||
    template.category?.toLowerCase().includes(searchLower)
  );

  type Template = typeof templates[number];
  const grouped: Record<string, Template[]> = {};
  
  // Define category order
  const categoryOrder = ['Core', 'Frameworks', 'Styling', 'Icons', 'Visualization', '3D & VR', 'Mock APIs', 'Utilities'];
  
  filtered.forEach(template => {
    const cat = template.category || 'Other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(template);
  });

  // Sort groups by categoryOrder
  const sortedGrouped: Record<string, Template[]> = {};
  categoryOrder.forEach(cat => {
    const items = grouped[cat];
    if (items) sortedGrouped[cat] = items;
  });
  
  // Add any categories not in categoryOrder
  for (const [cat, items] of Object.entries(grouped)) {
    if (!sortedGrouped[cat]) {
      sortedGrouped[cat] = items;
    }
  }

  return sortedGrouped;
});

// Click outside handling
const menuRef = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  if (props.modelValue && menuRef.value && !menuRef.value.contains(event.target as Node)) {
    closeMenu();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Ensure search is reset when menu is opened
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    searchText.value = '';
  }
});

const closeMenu = () => {
  emit('update:modelValue', false);
};

const selectBoilerplate = (template: string) => {
  emit('select', template);
  closeMenu();
};

const previewBoilerplate = (template: string) => {
  window.open(`/boilerplates/${template}`, template);
};

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const templateSlug = urlParams.get('template');
  if (templateSlug) {
    const template = templates.find(t => t.slug === templateSlug);
    if (template) {
      selectBoilerplate(template.file);
    }
  }

  if (window.history.replaceState) {
    const url = new URL(window.location.href);
    url.search = '';
    window.history.replaceState({}, document.title, url.toString());
  }
});
</script>
