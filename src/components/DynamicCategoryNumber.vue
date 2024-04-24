<script setup>
	import UITooltip from './UITooltip.vue';

	const props = defineProps({
		min: {
			type: String,
			required: true
		},
		max: {
			type: String,
			required: true
		}
	});
</script>

<template>
	<UITooltip
		elem-class="dynamic-tag"
		:tooltip="`Random integer between ${min} and ${max}`"
	>
		{{ min }}–{{ max }}
	</UITooltip>
</template>
