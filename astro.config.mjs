import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

const isStaticDeploy = process.env.DEPLOY_TARGET === 'pages' || process.env.DEPLOY_TARGET === 'netlify';

export default defineConfig({
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
  site: 'https://senseikatana.github.io',
  base: isStaticDeploy ? '/12_sga-vilaseca/' : '/',
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
});

