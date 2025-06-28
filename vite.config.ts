import { defineConfig } from "vite";
import reactSwc from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Function to safely try SWC plugin with fallback
function getReactPlugin() {
  try {
    return reactSwc();
  } catch (error: any) {
    console.warn('SWC plugin failed, this might cause build issues on some platforms:', error?.message || error);
    // We'll keep trying SWC as it's the configured plugin
    return reactSwc();
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    getReactPlugin(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          stripe: ['@stripe/stripe-js', 'stripe'],
        },
      },
    },
    target: 'esnext',
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['@stripe/stripe-js', 'stripe'],
  },
}));
