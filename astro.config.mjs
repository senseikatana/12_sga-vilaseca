import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import clerk from '@clerk/astro';

const isPagesDeploy = process.env.DEPLOY_TARGET === 'pages';

export default defineConfig({
  integrations: [
    clerk(),
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
  site: isPagesDeploy ? 'https://senseikatana.github.io' : undefined,
  base: isPagesDeploy ? '/12_sga-vilaseca/' : '/',
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  vite: {
    resolve: {
      conditions: ['import', 'module', 'browser'],
    },
  },
});

