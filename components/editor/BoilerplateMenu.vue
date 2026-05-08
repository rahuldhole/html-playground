<template>
  <div 
    v-if="modelValue" 
    ref="menuRef"
    class="absolute top-full left-0 z-50 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 p-4 w-72 mt-2"
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

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'select']);

// Template data
const templates = [
  // Core
  { id: 1, name: 'Vanilla JS', category: 'Core', slug: 'vanilla-js', description: 'Plain HTML & JavaScript', file: 'vanilla.html', icon: 'https://cdn.simpleicons.org/javascript' },
  { id: 1.1, name: 'TypeScript', category: 'Core', slug: 'typescript', description: 'TypeScript with JSX support', file: 'typescript.html', icon: 'https://cdn.simpleicons.org/typescript' },

  // Frameworks
  { id: 2, name: 'React', category: 'Frameworks', slug: 'react', description: 'React with JSX support', file: 'react.html', icon: 'https://cdn.simpleicons.org/react' },
  { id: 3, name: 'Vue', category: 'Frameworks', slug: 'vue', description: 'Vue 3 with Composition API', file: 'vue.html', icon: 'https://cdn.simpleicons.org/vuedotjs' },
  { id: 4, name: 'Angular', category: 'Frameworks', slug: 'angular', description: 'Basic Angular application', file: 'angular.html', icon: 'https://cdn.simpleicons.org/angular' },
  { id: 21, name: 'Preact', category: 'Frameworks', slug: 'preact', description: 'Fast 3kb React alternative', file: 'preact.html', icon: 'https://cdn.simpleicons.org/preact' },
  { id: 22, name: 'SolidJS', category: 'Frameworks', slug: 'solid', description: 'Fine-grained reactivity', file: 'solid.html', icon: 'https://cdn.simpleicons.org/solid' },
  { id: 23, name: 'petite-vue', category: 'Frameworks', slug: 'petite-vue', description: '6kb subset of Vue', file: 'petite-vue.html', icon: 'https://cdn.simpleicons.org/vuedotjs' },
  { id: 14, name: 'Lit', category: 'Frameworks', slug: 'lit', description: 'Simple web components', file: 'lit.html', icon: 'https://cdn.simpleicons.org/lit' },

  // Styling
  { id: 5, name: 'Tailwind CSS', category: 'Styling', slug: 'tailwind', description: 'Utility-first CSS', file: 'tailwind.html', icon: 'https://cdn.simpleicons.org/tailwindcss' },
  { id: 6, name: 'Bootstrap', category: 'Styling', slug: 'bootstrap', description: 'Bootstrap 5 components', file: 'bootstrap.html', icon: 'https://cdn.simpleicons.org/bootstrap' },
  { id: 24, name: 'Bulma', category: 'Styling', slug: 'bulma', description: 'Modern CSS framework', file: 'bulma-css.html', icon: 'https://cdn.simpleicons.org/bulma' },
  { id: 25, name: 'Pico.css', category: 'Styling', slug: 'picocss', description: 'Minimalist semantic CSS', file: 'picocss.html', icon: 'https://www.google.com/s2/favicons?domain=picocss.com&sz=64' },
  { id: 26, name: 'daisyUI', category: 'Styling', slug: 'daisyui', description: 'Tailwind component library', file: 'daisyui-with-tailwind.html', icon: 'https://cdn.simpleicons.org/daisyui' },
  { id: 17, name: 'Shoelace', category: 'Styling', slug: 'shoelace', description: 'Modern UI components', file: 'shoelace.html', icon: 'https://shoelace.style/assets/images/wordmark.svg' },
  { id: 27, name: 'Google Fonts', category: 'Styling', slug: 'google-fonts', description: 'Premium typography', file: 'google-fonts.html', icon: 'https://www.gstatic.com/images/branding/product/2x/google_fonts_64dp.png' },

  // Icons
  { id: 28, name: 'Lucide Icons', category: 'Icons', slug: 'lucide', description: 'Beautifully consistent icons', file: 'lucide-icons.html', icon: 'https://cdn.simpleicons.org/lucide' },
  { id: 29, name: 'Feather Icons', category: 'Icons', slug: 'feather', description: 'Simply beautiful icons', file: 'feather-icons.html', icon: 'https://www.google.com/s2/favicons?domain=feathericons.com&sz=64' },
  { id: 30, name: 'Bootstrap Icons', category: 'Icons', slug: 'bootstrap-icons', description: 'Official Bootstrap icons', file: 'bootstrap-icons.html', icon: 'https://cdn.simpleicons.org/bootstrap' },
  { id: 31, name: 'Font Awesome', category: 'Icons', slug: 'font-awesome', description: 'The iconic icon set', file: 'font-awesome.html', icon: 'https://cdn.simpleicons.org/fontawesome' },
  { id: 32, name: 'Material Icons', category: 'Icons', slug: 'material-icons', description: 'Google Material icons', file: 'material-icons.html', icon: 'https://cdn.simpleicons.org/materialdesign' },

  // Visualization
  { id: 33, name: 'Chart.js', category: 'Visualization', slug: 'chart-js', description: 'Simple & flexible charting', file: 'chart.html', icon: 'https://cdn.simpleicons.org/chartdotjs' },
  { id: 34, name: 'ApexCharts', category: 'Visualization', slug: 'apexcharts', description: 'Modern interactive charts', file: 'apexcharts.html', icon: 'https://www.google.com/s2/favicons?domain=apexcharts.com&sz=64' },
  { id: 35, name: 'ECharts', category: 'Visualization', slug: 'echarts', description: 'Enterprise charting', file: 'echarts.html', icon: 'https://cdn.simpleicons.org/apacheecharts' },
  { id: 36, name: 'Plotly', category: 'Visualization', slug: 'plotly', description: 'Scientific charting', file: 'plotly.html', icon: 'https://cdn.simpleicons.org/plotly' },
  { id: 37, name: 'Vega', category: 'Visualization', slug: 'vega', description: 'Visualization grammar', file: 'vega-and-vega-lite.html', icon: 'https://cdn.simpleicons.org/vega' },
  { id: 13, name: 'D3.js', category: 'Visualization', slug: 'd3', description: 'Data visualization library', file: 'd3.html', icon: 'https://cdn.simpleicons.org/d3' },
  { id: 38, name: 'Leaflet', category: 'Visualization', slug: 'leaflet', description: 'Interactive maps', file: 'leaflet-maps.html', icon: 'https://cdn.simpleicons.org/leaflet' },

  // 3D & VR
  { id: 15, name: 'Three.js', category: '3D & VR', slug: 'three-js', description: '3D graphics in browser', file: 'threejs.html', icon: 'https://cdn.simpleicons.org/threedotjs' },
  { id: 39, name: 'A-Frame VR', category: '3D & VR', slug: 'a-frame', description: 'WebVR framework', file: 'a-frame-vr.html', icon: 'https://cdn.simpleicons.org/aframe' },
  { id: 40, name: 'Babylon.js', category: '3D & VR', slug: 'babylon', description: 'Powerful 3D engine', file: 'babylon.html', icon: 'https://cdn.simpleicons.org/babylondotjs' },

  // Utilities
  { id: 7, name: 'HTMX', category: 'Utilities', slug: 'htmx', description: 'AJAX with attributes', file: 'htmx.html', icon: 'https://htmx.org/favicon.svg' },
  { id: 8, name: 'Alpine.js', category: 'Utilities', slug: 'alpine', description: 'Lightweight framework', file: 'alpine.html', icon: 'https://cdn.simpleicons.org/alpinedotjs' },
  { id: 9, name: 'Stimulus', category: 'Utilities', slug: 'stimulus', description: 'HTML over the wire', file: 'stimulus.html', icon: 'https://cdn.simpleicons.org/stimulus' },
  { id: 10, name: 'Turbo', category: 'Utilities', slug: 'turbo', description: 'HTML over the wire', file: 'turbo.html', icon: 'https://cdn.simpleicons.org/turbo' },
  { id: 11, name: 'Firebase', category: 'Utilities', slug: 'firebase', description: 'Real-time database & auth', file: 'firebase.html', icon: 'https://cdn.simpleicons.org/firebase' },
  { id: 12, name: 'GSAP', category: 'Utilities', slug: 'gsap', description: 'Professional animation', file: 'gsap.html', icon: 'https://cdn.simpleicons.org/greensock' },
  { id: 18, name: 'Mustache', category: 'Utilities', slug: 'mustache', description: 'Logic-less templates', file: 'mustache.html', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 100 100"><text x="50" y="50" font-size="80" transform="rotate(90 50 50)">{</text></svg>' },
  { id: 19, name: 'CoffeeScript', category: 'Utilities', slug: 'coffeescript', description: 'CoffeeScript template', file: 'coffeescript.html', icon: 'https://cdn.simpleicons.org/coffeescript' },
  { id: 20, name: 'Underscore.js', category: 'Utilities', slug: 'underscore-js', description: 'Utility library', file: 'underscore-js.html', icon: 'https://underscorejs.org/favicon.ico' },
  { id: 16, name: 'Google Drive', category: 'Utilities', slug: 'google-drive', description: 'Drive API integration', file: 'google-drive.html', icon: 'https://cdn.simpleicons.org/googledrive' },
];

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
  const categoryOrder = ['Core', 'Frameworks', 'Styling', 'Icons', 'Visualization', '3D & VR', 'Utilities'];
  
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
