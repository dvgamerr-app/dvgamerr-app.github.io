import { defineConfig } from 'astro/config';
import robotsTxt from 'astro-robots-txt';
import sitemap from "@astrojs/sitemap";

import webmanifest from "astro-webmanifest";

// https://astro.build/config
export default defineConfig({
  site: 'https://dvgamerr.app',
  integrations: [
    robotsTxt(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          th: 'th-TH'
        },
      },
    }),
    webmanifest({
      name: 'Kananek Thongkam | Full Stack Engineer',
      icon: 'public/icon.webp', // source for favicon & icons
      short_name: 'dvgamerr',
      description: 'Hey there, My name is Kananek T. and I\'m a Full Stack Engineer.',
      start_url: '/',
      theme_color: '#3068d9',
      background_color: '#f8f8f8',
      display: 'standalone',
    })
  ]
});
