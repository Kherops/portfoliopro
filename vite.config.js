import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
  }
  
  if (command !== 'serve') {
    // Using a custom domain on GitHub Pages; ensure absolute paths from root
    // See: https://vitejs.dev/guide/build.html#public-base-path
    config.base = '/'
  }
  
  return config
})
