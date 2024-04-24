<script setup>
	import { ref, computed } from 'vue';

	import { useFloating, autoUpdate, offset, flip, shift, arrow, hide } from '@floating-ui/vue';

	const props = defineProps({
		tooltip: {
			type: String,
			required: true
		},
		side: {
			type: String,
			default: 'top'
		},
		elemClass: {
			type: String,
			default: ''
		}
	});

	const visible = ref(false);
	const placementReactive = computed(() => props.side);

	// Template refs
	const referenceElem = ref();
	const tooltipElem = ref();
	const tooltipArrowElem = ref();

	// Instantiate Floating UI
	const {floatingStyles, middlewareData, placement} = useFloating(
		referenceElem,
		tooltipElem,
		{
			whileElementsMounted: autoUpdate,
			placement: placementReactive,
			middleware: [
				offset(12),
				flip(),
				shift({ padding: 5 }),
				arrow({ element: tooltipArrowElem }),
				hide()
			]
		}
	);

	// Arrow properties
	// Explicit null check is required in case position value is 0 (falsy)
	const arrowX = computed(() => (middlewareData.value.arrow?.x != null) ? `${middlewareData.value.arrow.x}px` : '');
	const arrowY = computed(() => (middlewareData.value.arrow?.y != null) ? `${middlewareData.value.arrow.y}px` : '');
	const arrowWidth = computed(() => tooltipArrowElem.value?.offsetWidth);
	const arrowSidePosition = computed(() => `${-arrowWidth.value / 2}px`);

	// Strip -start or -end suffixes
	// Placement here may have been updated by flip()
	const calculatedSide = computed(() => placement.value.split('-')[0]);

	// Returns the placement side of the arrow, which is opposite the side of the tooltip
	const arrowSide = computed(() => {
		return {
			top: 'bottom',
			right: 'left',
			bottom: 'top',
			left: 'right',
		}[calculatedSide.value];
	});
</script>

<template>
	<button
		ref="referenceElem"
		class="btn"
		:class="elemClass"
		@mouseover="visible = true"
		@mouseleave="visible = false"
		@focus="visible = true"
		@blur="visible = false"
		@keydown.esc="visible = false"
	>
		<slot></slot>
	</button>

	<transition>
		<div
			v-if="visible"
			ref="tooltipElem"
			class="tooltip"
			:style="{
				...floatingStyles,
				visibility: middlewareData.hide?.referenceHidden ? 'hidden' : 'visible'
			}"
		>
			<span role="tooltip">{{ tooltip }}</span>

			<div
				ref="tooltipArrowElem"
				class="arrow"
				:style="{
					left: arrowX,
					top: arrowY,
					[arrowSide]: arrowSidePosition, // eg. right: -6px
					'border-top-color': (calculatedSide === 'bottom' || calculatedSide === 'left') ? 'var(--foreground-color)' : 'transparent',
					'border-right-color': (calculatedSide === 'top' || calculatedSide === 'left') ? 'var(--foreground-color)' : 'transparent',
					'border-bottom-color': (calculatedSide === 'top' || calculatedSide === 'right') ? 'var(--foreground-color)' : 'transparent',
					'border-left-color': (calculatedSide === 'bottom' || calculatedSide === 'right') ? 'var(--foreground-color)' : 'transparent'
				}"
			></div>
		</div>
	</transition>
</template>

<style scoped>
	/* Button used for tabbing/mobile taps */
	.btn {
		all: unset;
		cursor: help !important;

		&:active,
		&:hover {
			background-color: initial;
		}
	}

	.tooltip {
		width: max-content;
		max-width: min(350px, calc(100vw - 10px));
		white-space: pre-wrap;
		color: var(--foreground-color);
		background-color: var(--background-shaded);
		font-weight: bold;
		padding: 5px;
		border-radius: 4px;
		border: 1px solid var(--foreground-color);
		font-size: 0.8em;
	}

	.arrow {
		position: absolute;
		background: var(--background-shaded);
		border-width: 1px;
		border-style: solid;
		width: 12px;
		height: 12px;
		transform: rotate(45deg);
		z-index: -5;
	}

	.v-enter-active,
	.v-leave-active {
		transition: opacity 0.4s ease;
	}

	.v-enter-from,
	.v-leave-to {
		opacity: 0;
	}
</style>
