import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx, ManifestV3Export} from '@crxjs/vite-plugin'
import man from './manifest.json' assert {type: 'json'}

const manifest = man as ManifestV3Export;

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  // see issue: https://github.com/crxjs/chrome-extension-tools/issues/746
  server: {
    strictPort: true,
    port: 5173,
    hmr: {
      clientPort: 5173
    }
  }
})