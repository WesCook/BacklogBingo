<script setup>
	import DynamicCategory from '../components/DynamicCategory.vue';

	const props = defineProps({
		list: {
			type: Object,
			required: true
		}
	});
</script>

<template>
	<details class="preview-details">
		<summary>Import Preview</summary>
		<ol>
			<li
				v-for="(category, index) in props.list"
				:key="index"
			>
				<DynamicCategory
					v-if="category.dynamic"
					:name="category.name"
				/>
				<span v-else>{{ category.name }}</span>
			</li>
		</ol>
	</details>
</template>

<style scoped>
	.preview-details {
		margin-top: 1em;
		max-height: 200px;
		overflow-y: auto;
		background-color: color-mix(in srgb, var(--background-shaded) 98%, var(--foreground-color));

		summary {
			background-color: color-mix(in srgb, var(--background-shaded) 96%, var(--foreground-color));
			padding: 5px 5px 5px 11px;
		}
		summary:hover {
			cursor: pointer;
		}

		ol {
			list-style: decimal;
			margin-top: 10px;
		}
	}
</style>
