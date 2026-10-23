<script setup>
	import { ref, useId } from 'vue';

	defineProps({
		tooltip: {
			type: String,
			required: true
		},
		elemClass: {
			type: String,
			default: ''
		}
	});

	const visible = ref(false);
	const anchorName = `tooltip-anchor-${useId().replaceAll(':', '-')}`;
</script>

<template>
	<button
		class="btn"
		:class="elemClass"
		:style="{ anchorName: '--' + anchorName }"
		:aria-describedby="visible ? anchorName : undefined"
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
			:id="anchorName"
			class="tooltip"
			role="tooltip"
			:style="{ positionAnchor: '--' + anchorName }"
		>
			{{ tooltip }}
			<div class="arrow"></div>
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
		position: fixed; /* Use viewport as boundary for edge flips */
		position-area: top; /* Place tooltip above anchor by default */
		position-try-fallbacks: flip-block; /* Swap to bottom if this overflows */
		container-type: anchored; /* Allow querying for fallback position */
		white-space: pre-wrap; /* Allow newlines in tooltip text */

		max-width: min(350px, calc(100vw - 10px));
		margin-bottom: 12px;
		padding: 5px;
		border: 1px solid var(--foreground-color);
		border-radius: 4px;

		color: var(--foreground-color);
		background-color: var(--background-shaded);
		font-size: 0.8em;
		font-weight: bold;

		/* Disable tooltips if Anchor Positioning unsupported */
		@supports not (position-area: top) {
			display: none;
		}
	}

	/* Draw arrows if Anchor Positioning Level 2 container queries are supported */
	@supports (container-type: anchored) {
		.arrow {
			position: absolute;
			width: 12px;
			height: 12px;
			background: var(--background-shaded);
			border: 1px solid var(--foreground-color);
			border-top-color: transparent;
			border-left-color: transparent;

			/* Top - Default */
			transform: rotate(45deg);
			left: calc(50% - 6px);
			bottom: -6px;

			/* Bottom - Flip arrow when fallback is invoked */
			@container anchored(fallback: flip-block) {
				top: -6px;
				transform: rotate(225deg);
			}
		}
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
