import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    base: '/', // Use relative paths for all assets
    plugins: [react()],
    server: {
      host: true, // Allow external connections
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          // Ensure favicon assets are correctly handled
          assetFileNames: (assetInfo) => {
            if (assetInfo.name.endsWith('.ico') || assetInfo.name.endsWith('.png')) {
              return 'assets/[name].[ext]';
            }
            return 'assets/[name].[hash].[ext]';
          }
        }
      }
    }
  }
})
