import { defineConfig } from 'astro/config';

// https://astro.build/config
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: 'https://jogoodma.github.io',
  base: '/county-health',
  integrations: [react(), tailwind()]
});
