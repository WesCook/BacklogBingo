<script setup>
	import { useRouter } from 'vue-router';

	import { useErrors } from '../composables/errors.js';
	import { useGameRules } from '../composables/gamerules.js';
	import { useCategories } from '../composables/categories.js';

	import CategoryListEventPreview from '../components/CategoryListEventPreview.vue';

	const router = useRouter();
	const { clearGameRules } = useGameRules();
	const { setCategoryList } = useCategories();
	const { clearError } = useErrors();

	const props = defineProps({
		// Valid category list json
		json: {
			type: Object,
			required: true
		},
		// SVG icon component
		icon: {
			type: Object,
			required: true
		},
		// CSS color or custom property
		color: {
			type: String,
			default: 'black'
		}
	});

	// Update categories and move to next page (settings)
	function selectList() {
		clearError();
		clearGameRules(); // Necessary as lists can change default rules, so swapping lists may create unexpected states
		setCategoryList(props.json);
		router.push('/settings');
	}
</script>

<template>
	<li
		class="category-list"
		:style="{ '--custom-color': color }"
	>
		<h2>{{ json.name }}</h2>

		<component
			:is="icon"
			size="120"
			class="icon"
		/>

		<CategoryListEventPreview
			:json="json"
		/>

		<button @click="selectList">
			Select
		</button>

		<p>{{ json.description }}</p>
	</li>
</template>

<style scoped>
	.category-list {
		padding: 0.8em;
		text-align: center;
		background-color: color-mix(in srgb, var(--background-color) 40%, var(--custom-color));
		transition: background-color 100ms ease;

		&:hover,
		&:focus-within {
			background-color: color-mix(in srgb, var(--background-color) 10%, var(--custom-color));
		}

		.icon {
			margin: 0 auto;
			margin-bottom: 0.8em;
		}

		button {
			margin: 4px;
		}
	}
</style>
