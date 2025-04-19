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
		viewBox="0 0 512 512"
		:width="size"
		:height="size"
		:fill="isDark ? 'white' : 'black'"
	>
		<path
			d="M99 466c2 25 24 46 49 46h207c25 0 47-21 48-46l17-290H83l16 290zM427 107c-5-3-46-27-111-46v-1a51 51 0 0 0-99-19v1c-68-6-115 1-120 3-10 2-12 6-13 14l-7 33 351 66 6-33c1-7 1-13-7-18zM288 54a567 567 0 0 0-43-8 22 22 0 0 1 43 8z"
		/>
	</svg>
</template>
