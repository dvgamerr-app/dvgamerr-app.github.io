import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import AstroPWA from '@vite-pwa/astro'
import robotsTxt from 'astro-robots-txt'
import webmanifest from 'astro-webmanifest'
import { defineConfig, passthroughImageService } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  image: {
    service: passthroughImageService(),
  },
  integrations: [
    AstroPWA(),
    robotsTxt(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          th: 'th-TH',
        },
      },
    }),
    webmanifest({
      background_color: '#f8f8f8',
      description: "Hey there, My name is Kananek T. and I'm a Software Engineer.",
      display: 'standalone',
      icon: 'public/icon.webp', // source for favicon & icons
      name: 'Kananek Thongkam | Software Engineer',
      short_name: 'dvgamerr',
      start_url: '/',
      theme_color: '#3068d9',
    }),
    tailwind(),
  ],
  site: 'https://dvgamerr.app',
})
