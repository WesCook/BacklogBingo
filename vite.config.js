import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const deployPath = '/BacklogBingo'; // GitHub repo folder as base path
// eslint-disable-next-line no-undef
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
	plugins: [ vue() ],
	base: (isProduction) ? deployPath : '/',
	build: {
		outDir: 'dist',
		sourcemap: true
	},
	define: {
		// Remove Options API during build for ~3KB smaller bundles
		// https://vuejs.org/api/compile-time-flags#VUE_OPTIONS_API
		__VUE_OPTIONS_API__: false
	}
});
