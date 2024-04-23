<script setup>
	import { renderDynamicCategory } from '../utils/json-parse.js';

	defineProps({
		uuid: {
			type: String,
			default: ''
		},
		categoryName: {
			type: String,
			default: ''
		},
		dynamic: {
			type: Boolean,
			default: false
		},
		color: {
			type: String,
			default: ''
		}
	});

	defineEmits(['category-change']);

	const model = defineModel({ type: Array });
</script>

<template>
	<li>
		<label>
			<input
				v-model="model"
				type="checkbox"
				:value="uuid"
				@change="$emit('category-change', uuid)"
			>
			<span
				v-if="dynamic"
				:style="{ color: color }"
				v-html="renderDynamicCategory(categoryName)"
			></span>
			<span
				v-else
				:style="{ color: color }"
			>{{ categoryName }}</span>
		</label>
	</li>
</template>

<style scoped>
	::v-deep(.dynamic-category) {
		padding: 3px;
		background-color: var(--background-shaded);
		outline: 1px solid color-mix(in srgb, var(--foreground-color) 50%, var(--background-color));
		cursor: help;
	}
</style>
