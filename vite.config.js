import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    base: '/', // Use relative paths for all assets
    plugins: [
      react(),
      // Custom plugin to copy sitemap.xml and robots.txt to dist
      {
        name: 'copy-public-files',
        closeBundle() {
          const publicFiles = ['sitemap.xml', 'robots.txt']
          const distDir = join(process.cwd(), 'dist')
          
          if (!existsSync(distDir)) {
            mkdirSync(distDir, { recursive: true })
          }
          
          publicFiles.forEach(file => {
            const src = join(process.cwd(), 'public', file)
            const dest = join(distDir, file)
            try {
              if (existsSync(src)) {
                copyFileSync(src, dest)
                console.log(`✅ Copied ${file} to dist/`)
              }
            } catch (err) {
              console.warn(`⚠️ Failed to copy ${file}:`, err.message)
            }
          })
        }
      }
    ],
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
      // Ensure public directory is copied
      copyPublicDir: true,
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
