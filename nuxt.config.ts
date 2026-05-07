import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "PoW IDE - Online HTML Editor with Dark Mode & Live Sync",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "PoW IDE: A powerful online HTML editor with dark mode, full-screen editing, live sync, code sharing, output sharing, and persistent storage. Build and test HTML, CSS, and JS seamlessly.",
        },
        {
          name: "keywords",
          content:
            "online HTML editor, PoW IDE, dark mode code editor, live sync HTML editor, full-screen HTML IDE, share code online, persistent code storage, web development tool, free HTML editor, toggle dark mode IDE",
        },
        { name: "author", content: "PoW IDE Team" },
        { name: "robots", content: "index, follow" },
      ],
    },
  },

  compatibilityDate: "2024-11-01",

  // css: ['~/assets/css/tailwind.css'],
  devtools: { enabled: true },

  googleAdsense: {
    id: 'ca-pub-5908703614902402',
  },

  gtag: {
    enabled: process.env.NODE_ENV === 'production',
    id: 'G-B1LVVWCZL3'
  },

  modules: ['@nuxtjs/google-adsense', "@nuxt/icon", "@pinia/nuxt", "@nuxtjs/color-mode", "@nuxtjs/tailwindcss", "pinia-plugin-persistedstate/nuxt", "nuxt-codemirror", "@vueuse/nuxt", "nuxt-gtag"],
});