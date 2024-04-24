<script setup>
	import DynamicCategory from './DynamicCategory.vue';

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

			<DynamicCategory
				v-if="dynamic"
				:style="{ color }"
				:name="categoryName"
			/>
			<span
				v-else
				:style="{ color }"
			>{{ categoryName }}</span>

		</label>
	</li>
</template>

<style scoped>
	label {
		display: flex;
		align-items: baseline;
	}
</style>
