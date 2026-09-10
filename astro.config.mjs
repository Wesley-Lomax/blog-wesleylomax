// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import { SITE_URL } from './src/consts';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  build: {
    // /posts/slug/index.html — preserves the original trailing-slash URLs
    format: 'directory',
  },
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
});
