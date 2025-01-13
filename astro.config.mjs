import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from "astro-icon";
import { defineConfig } from 'astro/config';
import redirects from './redirects.json';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.rubenfa.me',
  integrations: [mdx(), sitemap(), icon()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'red',
    },
  },
  redirects,
});
