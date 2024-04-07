<script setup>
	defineProps({
		name: {
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
				:value="name"
				@change="$emit('category-change', $event.target, $event.target.checked)"
			>
			<span :style="{ color: color }">{{ name }}</span>
		</label>
	</li>
</template>
