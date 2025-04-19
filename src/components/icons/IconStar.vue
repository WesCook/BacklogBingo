<script setup>
	// Attribution: https://www.svgrepo.com/svg/311236/star-emphasis
	// License: MIT
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
		viewBox="0 0 24 24"
		:width="size"
		:height="size"
		fill="var(--foreground-color)"
	>
		<path
			d="m8.64 8.2 2.69-5.44a.75.75 0 0 1 1.34 0l2.69 5.45 6 .87c.62.09.87.84.42 1.28l-4.34 4.23 1.02 5.99a.75.75 0 0 1-1.09.79L12 18.54l-5.37 2.83a.75.75 0 0 1-1.1-.8l1.04-5.98-4.35-4.23a.75.75 0 0 1 .41-1.28l6.01-.87Z"
		/>
		<path
			d="M1.16 18.22a.75.75 0 0 1 .12-1.06l2.5-2a.75.75 0 0 1 .94 1.18l-2.5 2c-.32.25-.8.2-1.06-.12ZM22.72 17.16a.75.75 0 0 1-.94 1.18l-2.5-2a.75.75 0 0 1 .94-1.18l2.5 2ZM1.16 3.78c-.25.32-.2.8.12 1.06l2.5 2a.75.75 0 1 0 .94-1.18l-2.5-2a.75.75 0 0 0-1.06.12ZM22.72 4.84a.75.75 0 1 0-.94-1.18l-2.5 2a.75.75 0 1 0 .94 1.18l2.5-2Z"
		/>
	</svg>
</template>
