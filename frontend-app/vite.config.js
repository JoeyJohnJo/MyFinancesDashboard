import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: [
      'https://betty-essence-males-apply.trycloudflare.com',
      '.trycloudflare.com'
    ],
    proxy: {
      '/api': {
        target: 'https://court-earthquake-mag-petition.trycloudflare.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})

