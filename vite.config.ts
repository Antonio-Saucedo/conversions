import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: process.env.VITE_BASE_PATH ?? '/',
    test: {
        environment: 'jsdom',
        setupFiles: ['./vitest/setup.ts'],
        passWithNoTests: true,
        exclude: ['node_modules', 'dist', 'e2e/**'],
    },
})
