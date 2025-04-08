import { defineConfig } from "eslint/config";
import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import globals from "globals";

export default defineConfig([
	// ESLint recommended JS rules
	js.configs.recommended,

	// Vue recommended rules
	...vue.configs['flat/recommended'],

	// Custom rules
	{
		files: ['src/**/*.{vue,js}'],
		languageOptions: {
			// Support for browser environment variables (window, localStorage, etc)
			globals: {
				...globals.browser
			}
		},
		rules: {
			// Technical errors
			'prefer-const': 'warn',

			// Missing elements
			quotes: ['warn', 'single'],
			semi: ['warn', 'always'],
			'no-unused-vars': ['warn', {
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^props$'
			}],
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
			'vue/html-self-closing': ['error', {
				html: {
					normal: 'never',
					void: 'never',
					component: 'always'
				}
			}],

			// Reactivity loss
			'vue/no-ref-object-reactivity-loss': 'warn',
			'vue/no-setup-props-reactivity-loss': 'warn'
		}
	}
]);
