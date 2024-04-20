<script setup>
	defineProps({
		uuid: {
			type: String,
			default: ''
		},
		categoryName: {
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
				:value="uuid"
				@change="$emit('category-change', uuid)"
			>
			<span :style="{ color: color }">{{ categoryName }}</span>
		</label>
	</li>
</template>
