<script setup>
	defineProps({
		uuid: {
			type: String,
			default: ''
		},
		friendlyName: {
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

	const model = defineModel({ type: Array });
</script>

<template>
	<li>
		<label>
			<input
				v-model="model"
				type="checkbox"
				:value="uuid"
				:indeterminate
				@change="$emit('group-change', uuid, $event.target.checked)"
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
