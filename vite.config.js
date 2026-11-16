import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' keeps asset paths relative, so the build works both as
// <user>.github.io and as a project page under /<repo>/.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
