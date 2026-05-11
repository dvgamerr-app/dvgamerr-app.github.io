import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import AstroPWA from '@vite-pwa/astro'
import robotsTxt from 'astro-robots-txt'
import { defineConfig, passthroughImageService } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  image: {
    service: passthroughImageService(),
  },
  integrations: [
    tailwind(),
    AstroPWA({
      includeAssets: ['favicon.svg', 'icon-128.png', 'icon-144.png'],
      manifest: {
        background_color: '#f8f8f8',
        description: "Hey there, My name is Kananek T. and I'm a Software Engineer.",
        display: 'standalone',
        icons: [
          {
            sizes: '192x192',
            src: '/icon-192.png',
            type: 'image/png',
          },
          {
            sizes: '512x512',
            src: '/icon-512.png',
            type: 'image/png',
          },
        ],
        name: 'Kananek Thongkam | Software Engineer',
        short_name: 'dvgamerr',
        start_url: '/',
        theme_color: '#C84B31',
      },
    }),
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
  ],
  site: 'https://dvgamerr.app',
})
