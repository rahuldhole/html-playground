export const BOILERPLATES = [
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
  
  // Mock APIs
  { id: 41, name: 'DummyJSON', category: 'Mock APIs', slug: 'dummyjson', description: 'Product Catalog & Store', file: 'dummyjson.html', icon: 'https://dummyjson.com/favicon.ico' },
  { id: 42, name: 'JSONPlaceholder', category: 'Mock APIs', slug: 'jsonplaceholder', description: 'Blog Posts & Comments', file: 'jsonplaceholder.html', icon: 'https://jsonplaceholder.typicode.com/favicon.ico' },
  { id: 44, name: 'DiceBear', category: 'Mock APIs', slug: 'dicebear', description: 'Avatar Generator', file: 'dicebear.html', icon: 'https://www.dicebear.com/favicon.ico' },
  { id: 45, name: 'RandomUser', category: 'Mock APIs', slug: 'randomuser', description: 'User Profile Directory', file: 'randomuser.html', icon: 'https://randomuser.me/favicon.ico' },
];
