<script setup>
	import { ref, onMounted } from 'vue';

	import DynamicCategoryNumber from './DynamicCategoryNumber.vue';
	import DynamicCategoryChoose from './DynamicCategoryChoose.vue';

	const props = defineProps({
		name: {
			type: String,
			required: true
		}
	});

	const elements = ref([]);
	onMounted(() => {
		elements.value = buildElements(props.name);
	});

	// Take dynamic category string and splits it into an array of elements
	// These are then looped through and built in the template
	function buildElements(text) {
		const elements = [];
		let lastIndex = 0; // Current position in text
		const regex = /\b(NUMBER|CHOOSE)\[([^\]]+)\]/g;
		let match;

		while ((match = regex.exec(text)) !== null) {
			// Add the text before the match
			if (match.index !== lastIndex) {
				elements.push({
					type: 'text',
					text: text.substring(lastIndex, match.index)
				});
			}

			// Add the dynamic component
			if (match[1] === 'NUMBER') {
				const [min, max] = match[2].split(',').map(Number);
				elements.push({
					type: 'number',
					min: String(min),
					max: String(max)
				});
			} else if (match[1] === 'CHOOSE') {
				const terms = match[2].split('|');
				elements.push({
					type: 'choose',
					terms
				});
			}

			lastIndex = regex.lastIndex;
		}

		// Add any remaining text
		if (lastIndex < text.length) {
			elements.push({
				type: 'text',
				text: text.substring(lastIndex)
			});
		}

		return elements;
	}
</script>

<template>
	<div class="dynamic-category">
		<template v-for="(elem, index) in elements">
			<DynamicCategoryNumber
				v-if="elem.type === 'number'"
				:key="`number-${index}`"
				:min="elem.min"
				:max="elem.max"
			/>
			<DynamicCategoryChoose
				v-else-if="elem.type === 'choose'"
				:key="`choose-${index}`"
				:terms="elem.terms"
			/>
			<span
				v-else
				:key="`text-${index}`"
			>{{ elem.text }}</span>
		</template>
	</div>
</template>

<style scoped>
	.dynamic-category {
		display: inline-block;
	}

	:deep(.dynamic-tag) {
		background-color: var(--background-shaded);
		outline: 1px solid color-mix(in srgb, var(--foreground-color) 50%, var(--background-color));
		line-height: 1;
		padding: 3px;
	}
</style>
