import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// In produzione (build) il sito è servito da
// https://fedone10.github.io/MealPlanner/ su GitHub Pages, quindi serve base.
// In sviluppo restiamo su "/" così `npm run dev` funziona normalmente.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/MealPlanner/' : '/',
  plugins: [react()],
}))
