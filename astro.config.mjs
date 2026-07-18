import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// En GitHub Pages el repo se sirve en /sga-vilaseca/
// En Render o localhost se sirve en /
const isGitHubPages = process.env.DEPLOY_TARGET === 'github-pages';

export default defineConfig({
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
  output: 'static',
  // Base path solo cuando se despliega en GitHub Pages
  base: isGitHubPages ? '/sga-vilaseca' : '/',
  site: isGitHubPages
    ? 'https://senseikatana.github.io'
    : 'http://localhost:4321',
});
