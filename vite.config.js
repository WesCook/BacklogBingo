import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const deployPath = '/BacklogBingo'; // GitHub repo folder as base path
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
	plugins: [ vue() ],
	base: (isProduction) ? deployPath : '/',
	outDir: 'dist'
})
