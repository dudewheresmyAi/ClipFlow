import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      // This tells Vite how to work correctly inside Replit
      hmr: {
        host: `<span class="math-inline">\{env\.REPL\_SLUG\}\.</span>{env.REPL_OWNER}.replit.dev`
      },
      // This is the new part that fixes the "Blocked request" error
      allowedHosts: ['.replit.dev']
    }
  }
})