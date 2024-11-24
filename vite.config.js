import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  root: 'src', // Use 'src' as the project root
  build: {
    outDir: '../dist', // Output files to a 'dist' folder outside 'src'
  },
  server: {
    port: 3000, // Development server port
  },
  resolve: {
    alias: {
      '@cpp': '/src/cpp', // Alias for the 'cpp' folder
      '@js': '/src/js',   // Alias for the 'js' folder
      '@styles': '/src/styles', // Alias for 'styles'
    },
  },
  optimizeDeps: {
    exclude: ['@cpp/f.js'], // Exclude generated files from dependency pre-bundling
  },
  worker: {
    format: 'es', // Use ES modules for workers (useful if interacting with WebAssembly)
  },
});

