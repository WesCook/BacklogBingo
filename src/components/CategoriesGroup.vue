<script setup>
	defineProps({
		name: {
			type: String,
			default: ''
		},
		friendlyName: {
			type: String,
			default: ''
		},
		color: {
			type: String,
			default: ''
		}
	});

	defineEmits(['group-change']);

	const model = defineModel({ type: Array });
</script>

<template>
	<li>
		<label>
			<input
				v-model="model"
				type="checkbox"
				:value="name"
				@change="$emit('group-change', $event.target.value, $event.target.checked)"
			>
			<span
				:style="{ color: color }"
			>{{ friendlyName }}</span>
		</label>
	</li>
</template>

<style scoped>
	strong,
	label {
		white-space: nowrap;
	}
</style>
