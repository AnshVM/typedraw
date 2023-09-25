import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'


export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
    },
  },
  plugins: [react()],
})