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

	const model = defineModel({ type: Array });
</script>

<template>
	<li>
		<label>
			<input
				v-model="model"
				type="checkbox"
				:value="name"
			>
			<span :style="{ color: color }">{{ name }}</span>
		</label>
	</li>
</template>
