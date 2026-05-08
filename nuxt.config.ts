import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "PoW IDE - Professional Online HTML Editor",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "PoW IDE: A professional online HTML editor with dark mode, live sync, and premium developer experience.",
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap' }
      ]
    },
  },

  compatibilityDate: "2024-11-01",

  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },

  googleAdsense: {
    id: 'ca-pub-5908703614902402',
  },

  gtag: {
    enabled: process.env.NODE_ENV === 'production',
    id: 'G-B1LVVWCZL3'
  },

  modules: ['@nuxtjs/google-adsense', "@nuxt/icon", "@pinia/nuxt", "@nuxtjs/color-mode", "@nuxtjs/tailwindcss", "pinia-plugin-persistedstate/nuxt", "nuxt-codemirror", "@vueuse/nuxt", "nuxt-gtag"],

  nitro: {
    preset: 'cloudflare_pages',
    cloudflare: {
      nodeCompat: true
    },
  },

  routeRules: {
    '/api/**': { cors: true }
  },

  experimental: {
    inlineRouteRules: true
  },

  vite: {
    optimizeDeps: {
      exclude: ['brotli-wasm']
    }
  },

  runtimeConfig: {
    openRouterKey: '',
    triggerSecretKey: '',
    enableTriggerDev: process.env.ENABLE_TRIGGER_DEV === 'true'
  }
});