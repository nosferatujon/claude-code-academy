// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

// Fully static output — deploys to Cloudflare Pages free tier with no Worker.
export default defineConfig({
  site: 'https://claude-code-academy.pages.dev',
  output: 'static',

  build: {
    format: 'directory',
  },

  adapter: cloudflare(),
});