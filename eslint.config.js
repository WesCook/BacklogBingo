import eslint from '@eslint/js';
import vue from 'eslint-plugin-vue';

export default [
	// ESLint recommended
	eslint.configs.recommended,

	// Vue recommended
	...vue.configs['flat/recommended'],

	// Custom rules
	{
		files: ['src/**/*.{vue,js}'],
		rules: {
			semi: ['warn', 'always'],
			quotes: ['warn', 'single'],
			'prefer-const': 'warn',
			'no-unused-vars': 'warn',
			'vue/html-indent': ['warn', 'tab'],
			'vue/script-indent': ['warn', 'tab', {
				baseIndent: 1
			}]
		}
	}
]
