<script setup>
	import DynamicCategory from './DynamicCategory.vue';

	defineProps({
		category: {
			type: Object,
			required: true
		},
		color: {
			type: String,
			default: ''
		}
	});

	defineEmits(['category-change']);

	const model = defineModel({ type: Boolean });
</script>

<template>
	<li>
		<label>
			<input
				v-model="model"
				type="checkbox"
				@change="$emit('category-change')"
			>

			<DynamicCategory
				v-if="category.dynamic"
				:style="{ color }"
				:name="category.name"
			/>
			<span
				v-else
				:style="{ color }"
			>{{ category.name }}</span>

		</label>
	</li>
</template>

<style scoped>
	label {
		display: flex;
		align-items: baseline;
	}
</style>
