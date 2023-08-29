import { defineConfig } from 'astro/config';
import robotsTxt from 'astro-robots-txt';
import image from '@astrojs/image';

// https://astro.build/config
export default defineConfig({
  site: 'https://mr.touno.io',
  integrations: [ image(), robotsTxt()]
});
