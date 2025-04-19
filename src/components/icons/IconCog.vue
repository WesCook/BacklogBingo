<script setup>
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
		viewBox="0 0 16 16"
		:width="size"
		:height="size"
		fill="var(--foreground-color)"
	>
		<path
			d="M6.5 0h3l.6 2.4a6 6 0 0 1 1.7 1l2.4-.7 1.5 2.6L13.9 7a6 6 0 0 1 0 2l1.8 1.7-1.5 2.6-2.4-.7a6 6 0 0 1-1.7 1L9.5 16h-3l-.6-2.4a6 6 0 0 1-1.7-1l-2.4.7-1.5-2.6L2.1 9a6 6 0 0 1 0-2L.3 5.3l1.5-2.6 2.4.7a6 6 0 0 1 1.7-1L6.5 0ZM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
		/>
	</svg>
</template>
