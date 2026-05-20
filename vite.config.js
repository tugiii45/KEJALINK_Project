/**
 * Vite Configuration
 * 
 * Vite is the build tool and dev server for this React application.
 * It provides:
 * - Ultra-fast hot module replacement (HMR) during development
 * - Optimized production builds
 * - ES modules support
 * 
 * Plugins included:
 * - @vitejs/plugin-react: React JSX compilation and refresh
 * - @tailwindcss/vite: Tailwind CSS compilation (faster than PostCSS)
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
