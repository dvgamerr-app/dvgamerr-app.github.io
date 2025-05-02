import { defineConfig, passthroughImageService } from 'astro/config'
import { remarkReadingTime } from './src/utils/readingTime'
import AstroPWA from '@vite-pwa/astro'
import robotsTxt from 'astro-robots-txt'
import sitemap from '@astrojs/sitemap'
import rehypePrettyCode from 'rehype-pretty-code'

import webmanifest from 'astro-webmanifest'

import tailwindcss from '@tailwindcss/vite';

const options = {
    //theme: json,
    onVisitLine(node) {
        if (node.children.length === 0) {
            node.children = [			{	type: 'text',	value: ' '}	]
        }
    },
    onVisitHighlightedLine(node) {
        // Adding a class to the highlighted line
        node.properties.className = ['highlighted']
    }
}


// https://astro.build/config
export default defineConfig({
  site: 'https://dvgamerr.app',

  image: {
    service: passthroughImageService(),
  },

  markdown: {
      syntaxHighlight: false,
      // Disable syntax built-in syntax hightlighting from astro
      rehypePlugins: [[rehypePrettyCode, options]],
      remarkPlugins: [remarkReadingTime]
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
      name: 'Kananek Thongkam | Software Engineer',
      icon: 'public/icon.webp', // source for favicon & icons
      short_name: 'dvgamerr',
      description:
        "Hey there, My name is Kananek T. and I'm a Software Engineer.",
      start_url: '/',
      theme_color: '#3068d9',
      background_color: '#f8f8f8',
      display: 'standalone',
    }),
  ],

  vite: {
    plugins: [tailwindcss()]
  }
})