import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/GymTrackerPro/', // 👈 QUESTA RIGA RISOLVE IL PROBLEMA!
  server: {
    port: 3000,
    open: true
  }
})
