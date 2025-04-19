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
		viewBox="0 0 492 492"
		:width="size"
		:height="size"
		fill="var(--foreground-color)"
	>
		<path
			d="m359 221-16-16a27 27 0 0 0-38 0l-20 20V46c-1-15-13-25-27-25h-23c-15 0-27 10-27 25v181l-22-22a27 27 0 0 0-38 0l-16 16c-5 5-7 12-7 19s2 14 7 19l95 95c5 6 12 9 19 9s14-3 19-9l94-94a27 27 0 0 0 0-39z"
		/>
		<path
			d="M492 312c0-15-12-26-27-26h-23c-15 0-27 12-27 27v81H77v-81c0-15-12-27-27-27H27c-15 0-27 11-27 25v120c0 21 17 40 39 40h415c21 0 38-18 38-40V312z"
		/>
	</svg>
</template>
