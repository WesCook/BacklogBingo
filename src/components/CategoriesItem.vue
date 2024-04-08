<script setup>
	defineProps({
		categoryName: {
			type: String,
			default: ''
		},
		group: {
			type: String,
			default: ''
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
				:value="categoryName"
				@change="$emit('category-change', group)"
			>
			<span :style="{ color: color }">{{ categoryName }}</span>
		</label>
	</li>
</template>
