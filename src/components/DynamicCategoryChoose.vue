<script setup>
	import UITooltip from './UITooltip.vue';

	const props = defineProps({
		terms: {
			type: Array,
			default: () => [],
			validator: terms => terms.length >= 2
		}
	});
</script>

<template>
	<UITooltip
		elem-class="dynamic-tag"
		:tooltip="`Available options:\n- ${terms.join('\n- ')}`"
	>
		{{ terms[0] }}
	</UITooltip>
</template>
