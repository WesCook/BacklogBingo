<script setup>
	defineProps({
		groupName: {
			type: String,
			default: ''
		},
		indeterminate: {
			type: Boolean,
			default: false
		},
		color: {
			type: String,
			default: ''
		}
	});

	defineEmits(['group-change']);

	const model = defineModel({ type: Boolean });
</script>

<template>
	<li>
		<label>
			<input
				v-model="model"
				type="checkbox"
				:indeterminate
				@change="$emit('group-change', groupName, $event.target.checked)"
			>
			<span
				:style="{ color: color }"
			>{{ groupName }}</span>
		</label>
	</li>
</template>

<style scoped>
	strong,
	label {
		white-space: nowrap;
	}
</style>
