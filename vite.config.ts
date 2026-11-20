import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import sitePages from './site-pages.json';

export default defineConfig(() => {
  return {
    base: '/',
    build: { outDir: 'dist/client' },
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'signalux-site-pages',
        apply: 'build',
        generateBundle() {
          this.emitFile({ type: 'asset', fileName: 'site-pages.json', source: JSON.stringify(sitePages) });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
