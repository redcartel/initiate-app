import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Unfonts from 'unplugin-fonts/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), Unfonts({
    google: {
      families: [{
        name: 'Albert Sans',
        styles: 'ital,wght@0,100..900;1,100..900',
      },
      ],
    },
  }),
  ],
})
