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
			// Technical errors
			'prefer-const': 'warn',

			// Missing elements
			quotes: ['warn', 'single'],
			semi: ['warn', 'always'],
			'no-unused-vars': 'warn',
			'vue/enforce-style-attribute': ['error', {
				'allow': ['scoped']
			}],

			// Code organization
			'vue/block-order': ['error', {
				'order': ['script', 'template', 'style']
			}],
			'vue/html-indent': ['error', 'tab'],
			'vue/script-indent': ['error', 'tab', {
				baseIndent: 1
			}],
			'vue/singleline-html-element-content-newline': ['warn', {
				'externalIgnores': ['button', 'option', 'RouterLink']
			}],

			// Reactivity loss
			'vue/no-ref-object-reactivity-loss': 'warn',
			'vue/no-setup-props-reactivity-loss': 'warn'
		}
	}
]
