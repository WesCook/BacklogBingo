<script setup>
	import { inject } from 'vue';

	const isDark = inject('isDark');

	const props = defineProps({
		size: {
			type: [Number, String],
			default: '1em'
		}
	});
</script>

<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 -.5 21 21"
		:width="size"
		:height="size"
		:fill="isDark ? 'white' : 'black'"
	>
		<path
			fill-rule="evenodd"
			d="m12 10 9 8.6-1.5 1.4-9-8.6-9 8.6L0 18.6 9 10 0 1.4 1.5 0l9 8.6 9-8.6L21 1.4z"
		/>
	</svg>
</template>
