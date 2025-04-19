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
		viewBox="0 0 8 8"
		:width="size"
		:height="size"
		:fill="isDark ? 'white' : 'black'"
	>
		<path d="M1.07 2.96 4.8 6.69 3.76 7.73.03 3.99z" />
		<path d="M1.61 3.16h6.38v1.68H1.61z" />
		<path d="M.02 4 3.76.27 4.8 1.3 1.06 5.04z" />
	</svg>
</template>
