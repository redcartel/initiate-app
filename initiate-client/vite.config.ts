/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import svgr from 'vite-plugin-svgr'
/*
  plugins: [react()],
  base: './', // Important for S3
  build: {
    outDir: 'build', // Output directory
    assetsDir: './', // Important for S3
  },
*/
export default defineConfig({
  plugins: [react(), svgr({
    include: '**/*.svg?react',
    svgrOptions: {
      icon: true,
    },
  })],
  base: './',
  build: {
    outDir: 'build',
    assetsDir: './',
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  server: {
    port: 3030,
  }
})
