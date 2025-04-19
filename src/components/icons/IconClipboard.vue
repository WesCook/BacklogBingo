<script setup>
	// Attribution: https://www.svgrepo.com/svg/353045/clipboard
	// License: CC Attribution
	// Modifications: Optimized, integrated into component

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
		viewBox="0 0 20 20"
		:width="size"
		:height="size"
		fill="var(--foreground-color)"
		class="icon"
	>
		<path d="m15.6 2-1.2 3H5.6L4.4 2C3.6 2 3 2.6 3 3.4v15.2c0 .8.6 1.4 1.4 1.4h11.2c.8 0 1.4-.6 1.4-1.4V3.4c0-.8-.6-1.4-1.4-1.4zm-2 2 .9-2h-2.2l-.7-2H8.4l-.7 2H5.5l.9 2h7.2z" />
	</svg>
</template>
