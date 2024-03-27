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
			'prefer-const': 'error',
			'no-unused-vars': 'warn',
			'vue/html-indent': ['error', 'tab'],
			'vue/script-indent': ['error', 'tab', {
				baseIndent: 1
			}],
			'vue/singleline-html-element-content-newline': ['warn', {
				'externalIgnores': ['RouterLink']
			}]
		}
	}
]
