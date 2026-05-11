export const CDNS = [
  // ============ CORE FRAMEWORKS & UI ============
  { name: 'Tailwind CSS', example: '<script src="https://cdn.tailwindcss.com"></script>', usecase: 'Utility-first CSS for rapid UI building' },
  { name: 'Vue 3 (Global)', example: '<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>', usecase: 'Progressive reactive framework for interactive UIs' },
  { name: 'React + ReactDOM', example: '<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script><script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>', usecase: 'Component-based library for complex applications' },
  { name: 'Solid.js', example: '<script src="https://unpkg.com/solid-js/dist/solid.js"></script>', usecase: 'Fine-grained reactivity with excellent performance' },
  { name: 'Alpine.js', example: '<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>', usecase: 'Lightweight framework for simple interactivity without build step' },
  { name: 'Petite-vue', example: '<script src="https://unpkg.com/petite-vue" defer init></script>', usecase: 'Minimal Vue alternative for progressive enhancement' },
  { name: 'Preact', example: '<script src="https://unpkg.com/preact/dist/preact.min.js"></script>', usecase: 'Lightweight React alternative (3KB)' },
  { name: 'htmx', example: '<script src="https://unpkg.com/htmx.org@1.9.10"></script>', usecase: 'Server-driven interactions via HTML attributes' },

  // ============ UI COMPONENT LIBRARIES ============
  { name: 'Bootstrap (CSS+JS)', example: '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>', usecase: 'Complete component library with modals, dropdowns, carousels' },
  { name: 'Shoelace', example: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/themes/light.css"><script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/shoelace-autoloader.js"></script>', usecase: 'Web components-based UI library with accessibility focus' },
  { name: 'DaisyUI (with Tailwind)', example: '<script src="https://cdn.tailwindcss.com"></script>', usecase: 'Tailwind-based components for faster prototyping' },
  { name: 'PicoCSS', example: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">', usecase: 'Minimal classless CSS framework for semantic HTML' },
  { name: 'Bulma CSS', example: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">', usecase: 'Modern CSS framework with flexbox-based grid system' },

  // ============ ICONS & FONTS ============
  { name: 'Lucide Icons', example: '<script src="https://unpkg.com/lucide@latest"></script>', usecase: 'Clean SVG icons as JavaScript for dynamic use' },
  { name: 'Font Awesome', example: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">', usecase: 'Massive icon library (thousands of icons)' },
  { name: 'Feather Icons', example: '<script src="https://unpkg.com/feather-icons/dist/feather.min.js"></script>', usecase: 'Minimal, consistent icon set' },
  { name: 'Material Icons', example: '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">', usecase: 'Google Material Design icons' },
  { name: 'Bootstrap Icons', example: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">', usecase: 'SVG icon library optimized for Bootstrap' },
  { name: 'Google Fonts', example: '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">', usecase: 'Free font hosting for typography' },

  // ============ DATA VISUALIZATION ============
  { name: 'Chart.js', example: '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>', usecase: 'Simple bar, line, pie charts with animations' },
  { name: 'D3.js', example: '<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>', usecase: 'Advanced custom data visualizations and transformations' },
  { name: 'Plotly.js', example: '<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>', usecase: 'Scientific graphs with 3D surface plots' },
  { name: 'ApexCharts', example: '<script src="https://cdn.jsdelivr.net/npm/apexcharts@latest/dist/apexcharts.min.js"></script>', usecase: 'Interactive charts with real-time updates' },
  { name: 'ECharts', example: '<script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>', usecase: 'Feature-rich charts for dashboards' },
  { name: 'Vega & Vega-Lite', example: '<script src="https://cdn.jsdelivr.net/npm/vega@5"></script><script src="https://cdn.jsdelivr.net/npm/vega-lite@5"></script>', usecase: 'Grammar of graphics for declarative visualization' },

  // ============ 3D & GRAPHICS ============
  { name: 'Three.js', example: '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>', usecase: '3D graphics engine for games and visualizations' },
  { name: 'Babylon.js', example: '<script src="https://cdn.babylonjs.com/babylon.js"></script>', usecase: 'Alternative 3D engine with physics integration' },
  { name: 'A-Frame (VR)', example: '<script src="https://aframe.io/releases/1.5.0/aframe.min.js"></script>', usecase: 'Web VR/XR experiences with HTML entities' },
  { name: 'Cesium.js (Maps/Globe)', example: '<script src="https://cesium.com/downloads/cesiumjs/releases/1.110/Build/Cesium/Cesium.js"></script>', usecase: 'Interactive 3D maps and geospatial visualization' },
  { name: 'PixiJS (2D)', example: '<script src="https://cdn.jsdelivr.net/npm/pixi.js@8.0.0/dist/pixi.min.js"></script>', usecase: 'Fast 2D rendering with WebGL fallback' },

  // ============ GAMES ============
  { name: 'Phaser.js', example: '<script src="https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser-arcade-physics.min.js"></script>', usecase: 'Complete 2D game framework with physics' },
  { name: 'Kaboom.js', example: '<script src="https://kaboomjs.com/lib/kaboom.js"></script>', usecase: 'Simple game dev with minimal boilerplate' },
  { name: 'Matter.js (Physics)', example: '<script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"></script>', usecase: 'Physics engine for gravity, collisions, constraints' },
  { name: 'Cannon-es (Physics)', example: '<script src="https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js"></script>', usecase: '3D physics engine for Babylon.js/Three.js' },

  // ============ ANIMATIONS & INTERACTIONS ============
  { name: 'GSAP', example: '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>', usecase: 'Professional animation library with timeline control' },
  { name: 'Animate.css', example: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">', usecase: 'Pre-made CSS animations (bounce, fade, slide)' },
  { name: 'AOS (Animate on Scroll)', example: '<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet"><script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>', usecase: 'Trigger animations when elements enter viewport' },
  { name: 'ScrollReveal', example: '<script src="https://unpkg.com/scrollreveal"></script>', usecase: 'Scroll-triggered element reveal animations' },
  { name: 'Framer Motion (Quick)', example: '<script src="https://cdn.jsdelivr.net/npm/framer-motion@10.16.4/dist/framer-motion.js"></script>', usecase: 'React animation library for component transitions' },
  { name: 'Anime.js', example: '<script src="https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.min.js"></script>', usecase: 'Lightweight animation engine for complex sequences' },
  { name: 'Lottie (Animations)', example: '<script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>', usecase: 'Play Lottie JSON animations from Adobe After Effects' },
  { name: 'Typed.js (Text Effects)', example: '<script src="https://unpkg.com/typed.js@2.1.0/dist/typed.umd.js"></script>', usecase: 'Typewriter text effect with backspace' },
  { name: 'Confetti.js', example: '<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></script>', usecase: 'Celebrate moments with falling confetti' },
  { name: 'Particles.js', example: '<script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>', usecase: 'Animated particle background effects' },
  { name: 'Vanta.js (Backgrounds)', example: '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.waves.min.js"></script>', usecase: 'Dynamic background effects (waves, dots, NET)' },
  { name: 'Vanilla Tilt', example: '<script src="https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.1/vanilla-tilt.min.js"></script>', usecase: 'Mouse-tilt 3D effect on elements' },
  { name: 'RoughNotation', example: '<script src="https://unpkg.com/rough-notation/lib/rough-notation.iife.js"></script>', usecase: 'Hand-drawn style annotations and highlights' },

  // ============ SCROLLING & PAGE TRANSITIONS ============
  { name: 'Locomotive Scroll', example: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/locomotive-scroll@4.1.4/dist/locomotive-scroll.min.css"><script src="https://cdn.jsdelivr.net/npm/locomotive-scroll@4.1.4/dist/locomotive-scroll.min.js"></script>', usecase: 'Smooth scroll with parallax and physics' },
  { name: 'Jump.js (Smooth Scroll)', example: '<script src="https://cdn.jsdelivr.net/npm/jump.js/dist/jump.min.js"></script>', usecase: 'Smooth scrolling to page sections' },
  { name: 'Barba.js (Page Transitions)', example: '<script src="https://unpkg.com/@barba/core"></script>', usecase: 'SPA-like page transitions without full reloads' },

  // ============ CAROUSELS & SLIDERS ============
  { name: 'Swiper', example: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"><script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>', usecase: 'Touch-friendly carousel for images and content' },
  { name: 'Splide.js', example: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css"><script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js"></script>', usecase: 'Lightweight carousel with accessibility' },
  { name: 'Glide.js', example: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@glidejs/glide/dist/css/glide.core.min.css"><script src="https://cdn.jsdelivr.net/npm/@glidejs/glide"></script>', usecase: 'Flexible, responsive carousel' },
  { name: 'Siema', example: '<script src="https://cdn.jsdelivr.net/npm/siema@1.5.1/dist/siema.min.js"></script>', usecase: 'Tiny carousel library (no dependencies)' },
  { name: 'EmblaCarousel', example: '<script src="https://cdn.jsdelivr.net/npm/embla-carousel@8.0.0/index.umd.js"></script>', usecase: 'Headless carousel engine with extensive options' },

  // ============ MEDIA (VIDEO, AUDIO, IMAGES) ============
  { name: 'Plyr (Video/Audio)', example: '<link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css"><script src="https://cdn.plyr.io/3.7.8/plyr.js"></script>', usecase: 'Custom video/audio player with controls' },
  { name: 'Howler.js (Audio)', example: '<script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.4/howler.min.js"></script>', usecase: 'Web Audio API wrapper for sound effects and music' },
  { name: 'Wavesurfer.js (Audio Waveform)', example: '<script src="https://unpkg.com/wavesurfer.js@7"></script>', usecase: 'Interactive waveform visualization and player' },
  { name: 'SimpleLightbox (Images)', example: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/simplelightbox/2.14.2/simple-lightbox.min.css"><script src="https://cdnjs.cloudflare.com/ajax/libs/simplelightbox/2.14.2/simple-lightbox.min.js"></script>', usecase: 'Gallery lightbox with zoom and captions' },

  // ============ MAPS & GEOLOCATION ============
  { name: 'Leaflet (Maps)', example: '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>', usecase: 'Open-source map library with tile-based maps' },
  { name: 'Mapbox GL JS', example: '<link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet"><script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"></script>', usecase: 'Vector-based maps with 3D terrain (requires API key)' },

  // ============ FORMS & INPUTS ============
  { name: 'Flatpickr (Date Picker)', example: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"><script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>', usecase: 'Lightweight date/time picker with keyboard support' },
  { name: 'Pikaday (Date Picker)', example: '<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/pikaday/css/pikaday.css"><script src="https://cdn.jsdelivr.net/npm/pikaday/pikaday.js"></script>', usecase: 'Simple date picker with no dependencies' },
  { name: 'Select2', example: '<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet"><script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>', usecase: 'Enhanced select boxes with search and tags' },
  { name: 'NoUiSlider (Range Slider)', example: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/15.7.1/nouislider.min.css"><script src="https://cdnjs.cloudflare.com/ajax/libs/noUiSlider/15.7.1/nouislider.min.js"></script>', usecase: 'Touch-friendly range slider component' },
  { name: 'Pickr (Color Picker)', example: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/classic.min.css"><script src="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.min.js"></script>', usecase: 'Color picker with multiple theme styles' },
  { name: 'Cleave.js (Input Formatting)', example: '<script src="https://cdn.jsdelivr.net/npm/cleave.js@1.6.0/dist/cleave.min.js"></script>', usecase: 'Auto-format inputs (phone, card, credit card)' },
  { name: 'Inputmask (Mask Input)', example: '<script src="https://cdn.jsdelivr.net/npm/inputmask@5.0.8/dist/inputmask.min.js"></script>', usecase: 'Input masks for structured data entry' },
  { name: 'Validator.js (Validation)', example: '<script src="https://unpkg.com/validator@latest/validator.min.js"></script>', usecase: 'String validation (email, URL, credit card)' },

  // ============ TEXT EDITORS ============
  { name: 'Quill (Rich Editor)', example: '<link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet"><script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>', usecase: 'WYSIWYG rich text editor with formatting' },
  { name: 'EasyMDE (Markdown)', example: '<link rel="stylesheet" href="https://unpkg.com/easymde/dist/easymde.min.css"><script src="https://unpkg.com/easymde/dist/easymde.min.js"></script>', usecase: 'Markdown editor with live preview' },
  { name: 'CodeMirror (Code Editor)', example: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css"><script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js"></script>', usecase: 'Code editor with syntax highlighting' },
  { name: 'Monaco Editor (VSCode)', example: '<script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js"></script>', usecase: 'Professional code editor (VSCode engine)' },

  // ============ CODE HIGHLIGHTING ============
  { name: 'Highlight.js', example: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css"><script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>', usecase: 'Syntax highlighting for code blocks' },
  { name: 'Prism.js', example: '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css"><script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>', usecase: 'Lightweight syntax highlighter with plugins' },

  // ============ MARKDOWN & RENDERING ============
  { name: 'Marked (Markdown Parser)', example: '<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>', usecase: 'Parse markdown to HTML with custom rendering' },
  { name: 'Remark + Rehype (Markdown)', example: '<script src="https://cdn.jsdelivr.net/npm/remark-parse@10"></script>', usecase: 'AST-based markdown processor with plugins' },

  // ============ TABLES & DATA GRIDS ============
  { name: 'Tabulator', url: 'https://unpkg.com/tabulator-tables@5.5.2/dist/js/tabulator.min.js', example: '<link href="https://unpkg.com/tabulator-tables@5.5.2/dist/css/tabulator.min.css" rel="stylesheet"><script type="text/javascript" src="https://unpkg.com/tabulator-tables@5.5.2/dist/js/tabulator.min.js"></script>' },
  { name: 'Grid.js', url: 'https://cdn.jsdelivr.net/npm/gridjs/dist/gridjs.umd.js', example: '<link href="https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css" rel="stylesheet"><script src="https://cdn.jsdelivr.net/npm/gridjs/dist/gridjs.umd.js"></script>' },
  { name: 'Handsontable (Spreadsheet)', url: 'https://cdn.jsdelivr.net/npm/handsontable@12.4.0/dist/handsontable.full.min.js', example: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/handsontable@12.4.0/dist/handsontable.full.min.css"><script src="https://cdn.jsdelivr.net/npm/handsontable@12.4.0/dist/handsontable.full.min.js"></script>' },

  // ============ CALENDARS & SCHEDULING ============
  { name: 'FullCalendar', url: 'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js', example: '<link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.css" rel="stylesheet"><script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js"></script>' },
  { name: 'Schedule-X', url: 'https://cdn.jsdelivr.net/npm/@schedule-x/calendar@1.3.10', example: '<script src="https://cdn.jsdelivr.net/npm/@schedule-x/calendar@1.3.10"></script>' },

  // ============ DRAG & DROP ============
  { name: 'Sortable.js', url: 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js', example: '<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>' },
  { name: 'Interactjs (Interactions)', url: 'https://cdn.jsdelivr.net/npm/interactjs/dist/interact.min.js', example: '<script src="https://cdn.jsdelivr.net/npm/interactjs/dist/interact.min.js"></script>' },
  { name: 'React DnD (Drag & Drop)', url: 'https://unpkg.com/react-dnd@16', example: '<script src="https://unpkg.com/react-dnd@16"></script>' },

  // ============ NOTIFICATIONS & MODALS ============
  { name: 'SweetAlert2', url: 'https://cdn.jsdelivr.net/npm/sweetalert2@11', example: '<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>' },
  { name: 'Toastify', url: 'https://cdn.jsdelivr.net/npm/toastify-js', example: '<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css"><script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>' },
  { name: 'Notyf', url: 'https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js', example: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.css"><script src="https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js"></script>' },
  { name: 'MicroModal', url: 'https://unpkg.com/micromodal/dist/micromodal.min.js', example: '<script src="https://unpkg.com/micromodal/dist/micromodal.min.js"></script>' },
  { name: 'Popper.js + Tippy.js (Tooltips)', url: 'https://unpkg.com/@popperjs/core@2', example: '<script src="https://unpkg.com/@popperjs/core@2"></script><script src="https://unpkg.com/tippy.js@6"></script>' },

  // ============ FILE UPLOAD ============
  { name: 'Uppy', url: 'https://releases.transloadit.com/uppy/v3.17.0/uppy.min.js', example: '<link href="https://releases.transloadit.com/uppy/v3.17.0/uppy.min.css" rel="stylesheet"><script src="https://releases.transloadit.com/uppy/v3.17.0/uppy.min.js"></script>' },
  { name: 'Dropzone', url: 'https://unpkg.com/dropzone@5/dist/min/dropzone.min.js', example: '<link rel="stylesheet" href="https://unpkg.com/dropzone@5/dist/min/dropzone.min.css"><script src="https://unpkg.com/dropzone@5/dist/min/dropzone.min.js"></script>' },
  { name: 'Filepond', url: 'https://unpkg.com/filepond/dist/filepond.js', example: '<link href="https://unpkg.com/filepond/dist/filepond.css" rel="stylesheet"><script src="https://unpkg.com/filepond/dist/filepond.js"></script>' },

  // ============ STATE MANAGEMENT ============
  { name: 'Zustand (Global State)', url: 'https://cdn.jsdelivr.net/npm/zustand@4.4.1/dist/umd/index.min.js', example: '<script src="https://cdn.jsdelivr.net/npm/zustand@4.4.1/dist/umd/index.min.js"></script>' },
  { name: 'Immer (Immutability)', url: 'https://cdn.jsdelivr.net/npm/immer@10.0.2/dist/immer.umd.production.min.js', example: '<script src="https://cdn.jsdelivr.net/npm/immer@10.0.2/dist/immer.umd.production.min.js"></script>' },
  { name: 'Pinia (Vue State)', url: 'https://unpkg.com/pinia@latest/dist/pinia.iife.min.js', example: '<script src="https://unpkg.com/pinia@latest/dist/pinia.iife.min.js"></script>' },

  // ============ UTILITIES & HELPERS ============
  { name: 'Lodash', url: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js', example: '<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>' },
  { name: 'Ramda (FP)', url: 'https://cdnjs.cloudflare.com/ajax/libs/ramda/0.29.1/ramda.min.js', example: '<script src="https://cdnjs.cloudflare.com/ajax/libs/ramda/0.29.1/ramda.min.js"></script>' },
  { name: 'Axios (HTTP)', url: 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js', example: '<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>' },
  { name: 'Day.js (Date)', url: 'https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js', example: '<script src="https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js"></script>' },
  { name: 'Moment.js (Date Legacy)', url: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js', example: '<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js"></script>' },
  { name: 'Luxon (Date/Time)', url: 'https://cdn.jsdelivr.net/npm/luxon@3.4.3/build/global/luxon.min.js', example: '<script src="https://cdn.jsdelivr.net/npm/luxon@3.4.3/build/global/luxon.min.js"></script>' },

  // ============ DATABASES & STORAGE ============
  { name: 'IndexedDB Wrapper (Dexie)', url: 'https://unpkg.com/dexie/dist/dexie.min.js', example: '<script src="https://unpkg.com/dexie/dist/dexie.min.js"></script>' },
  { name: 'PouchDB (Sync DB)', url: 'https://cdn.jsdelivr.net/npm/pouchdb@8.0.1/dist/pouchdb.min.js', example: '<script src="https://cdn.jsdelivr.net/npm/pouchdb@8.0.1/dist/pouchdb.min.js"></script>' },
  { name: 'TinyDB (Lightweight)', url: 'https://cdn.jsdelivr.net/npm/tinydb@3.0.3/dist/tinydb.min.js', example: '<script src="https://cdn.jsdelivr.net/npm/tinydb@3.0.3/dist/tinydb.min.js"></script>' },
  { name: 'SQL.js (SQLite in Browser)', url: 'https://sql.js.org/dist/sql-wasm.js', example: '<script src="https://sql.js.org/dist/sql-wasm.js"></script>' },

  // ============ ENCRYPTION & SECURITY ============
  { name: 'TweetNaCl.js (Crypto)', url: 'https://cdn.jsdelivr.net/npm/tweetnacl@1.0.3/nacl-fast.min.js', example: '<script src="https://cdn.jsdelivr.net/npm/tweetnacl@1.0.3/nacl-fast.min.js"></script>' },
  { name: 'Crypto-js', url: 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.0/crypto-js.min.js', example: '<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.0/crypto-js.min.js"></script>' },

  // ============ API & BACKEND EMULATION ============
  { name: 'Mock Service Worker (MSW)', url: 'https://unpkg.com/msw@latest/lib/index.js', example: '<script src="https://unpkg.com/msw@latest/lib/index.js"></script>' },
  { name: 'JSON Server (In-Memory)', url: 'https://cdn.jsdelivr.net/npm/json-server@0.17.3', example: '<script src="https://cdn.jsdelivr.net/npm/json-server@0.17.3"></script>' },

  // ============ MOCK APIS & PLACEHOLDERS ============
  { name: 'DummyJSON', example: 'https://dummyjson.com/products', usecase: 'Comprehensive mock data for products, users, posts, and more' },
  { name: 'JSONPlaceholder', example: 'https://jsonplaceholder.typicode.com/posts', usecase: 'Simple REST API for testing and prototyping' },
  { name: 'RandomUser.me', example: 'https://randomuser.me/api/', usecase: 'Random user generator for user profiles and lists' },
  { name: 'DiceBear (Avatars)', example: 'https://api.dicebear.com/7.x/pixel-art/svg', usecase: 'Generate unique SVG avatars from seeds' },
  { name: 'Unsplash (Images)', example: 'https://images.unsplash.com/photo-1501854140801-50d01698950b', usecase: 'High-quality placeholder images via URL' },
  { name: 'ReqRes', example: 'https://reqres.in/api/users', usecase: 'Test your frontend against a real API with auth support' },
  { name: 'OpenWeatherMap (One Call)', example: 'https://api.openweathermap.org/data/2.5/weather?q=London', usecase: 'Weather data for apps (requires API key)' },

  // ============ UTILITIES ============
  { name: 'SimpleBar (Custom Scrollbars)', url: 'https://unpkg.com/simplebar@latest/dist/simplebar.min.js', example: '<link rel="stylesheet" href="https://unpkg.com/simplebar@latest/dist/simplebar.css"><script src="https://unpkg.com/simplebar@latest/dist/simplebar.min.js"></script>' },
  { name: 'FastClick (Mobile)', url: 'https://cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.6/fastclick.min.js', example: '<script src="https://cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.6/fastclick.min.js"></script>' },
  { name: 'AutoAnimate', url: 'https://cdn.jsdelivr.net/npm/@formkit/auto-animate/index.min.js', example: '<script src="https://cdn.jsdelivr.net/npm/@formkit/auto-animate/index.min.js"></script>' },
];