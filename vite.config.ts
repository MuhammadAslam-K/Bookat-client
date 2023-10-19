import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['stream', 'os'], // Exclude problematic modules
  },
  build: {
    chunkSizeWarningLimit: 1000, // Set the limit to a higher value.
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Check if the module is a CSS file
          if (id.endsWith('.css')) {
            return 'styles'; // This will create a chunk named 'styles' for CSS
          }
        },
      },
    },
  },
});

