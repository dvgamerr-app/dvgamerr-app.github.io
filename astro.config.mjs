import sitemap from '@astrojs/sitemap'
import svelte from '@astrojs/svelte'
import tailwindcss from '@tailwindcss/vite'
import AstroPWA from '@vite-pwa/astro'
import robotsTxt from 'astro-robots-txt'
import { defineConfig, passthroughImageService } from 'astro/config'
import { loadEnv } from 'vite'

const { PORT } = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '')
const port = Number(PORT || process.env.PORT) || undefined

// https://astro.build/config
export default defineConfig({
  image: {
    service: passthroughImageService(),
  },
  integrations: [
    svelte(),
    AstroPWA({
      includeAssets: ['favicon.svg', 'icon-128.png', 'icon-144.png'],
      manifest: {
        background_color: '#f8f8f8',
        description: "Hey there, My name is Kananek T. and I'm a Technical Lead Software Engineer.",
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
        name: 'Kananek Thongkam | Technical Lead Software Engineer',
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
      lastmod: new Date(),
    }),
  ],
  server: { port },
  site: 'https://dvgamerr.app',
  vite: {
    plugins: [tailwindcss()],
  },
})
