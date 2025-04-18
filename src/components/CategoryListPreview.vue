<script setup>
	import { ref, computed } from 'vue';

	import DynamicCategory from '../components/DynamicCategory.vue';
	import UIModal from '../components/UIModal.vue';

	const props = defineProps({
		jsonData: {
			type: Object,
			default: () => ({})
		},
		jsonType: {
			type: String,
			default: ''
		}
	});

	const emit = defineEmits(['clear-data']);

	const modalActive = ref(false);

	const isBingoImport = computed(() => props.jsonType === 'bingo-import');
	const isCategoryList = computed(() => props.jsonType === 'category-list');

	const exportDate = computed(() => isBingoImport.value
		? new Date(props.jsonData.exported).toLocaleDateString()
		: '');

	const totalCategories = computed(() => props.jsonData?.categories?.length ?? 0);

	const importedProgress = computed(() => {
		if (!isBingoImport.value) {
			return null;
		}

		const completed = props.jsonData.categories.filter(cat => cat.entry).length;
		const isFreeStar = props.jsonData.gamerules?.star === 'free';
		const total = (isFreeStar) ? totalCategories.value - 1 : totalCategories.value;

		return `${completed}/${total} complete`;
	});
</script>

<template>
	<section
		v-if="jsonData"
		id="confirm"
		class="confirmation-panel"
	>
		<h2>{{ isBingoImport ? 'Imported Bingo Card' : 'Selected List' }}</h2>

		<div class="details-box">
			<button
				class="close-button"
				@click="modalActive = false; emit('clear-data');"
			>
				✖
			</button>

			<h3>{{ jsonData.name }}</h3>

			<p v-if="isBingoImport">
				Export Date: {{ exportDate }}
			</p>

			<span v-if="isCategoryList">Total Categories: {{ totalCategories }}</span>
			<span v-else>Imported Categories ({{ importedProgress }})</span>

			<button
				class="preview-button"
				@click="modalActive = true;"
			>
				Preview
			</button>

			<blockquote v-if="jsonData.description">
				{{ jsonData.description }}
			</blockquote>
		</div>

		<p v-if="isCategoryList">
			When you're ready, click <em>Confirm List</em> to move to the next step and configure your game rules.
		</p>
	</section>

	<teleport to="body">
		<UIModal
			v-if="modalActive"
			:title="jsonData.name"
			:show-close="true"
			@close="modalActive = false"
		>
			<ol class="preview-list">
				<li
					v-for="(category, index) in jsonData.categories"
					:key="index"
				>
					<span v-if="isBingoImport">
						{{ category.entry ? `✅ ${category.cat} (${category.entry})` : category.cat }}
					</span>
					<template v-else>
						<DynamicCategory
							v-if="category.dynamic"
							:name="category.name"
						/>
						<span v-else>{{ category.name }}</span>
					</template>
				</li>
			</ol>
		</UIModal>
	</teleport>
</template>

<style scoped>
	/* Confirmation panel */
	.confirmation-panel {
		margin-top: 2em;

		h2 {
			text-align: center;
			margin-bottom: 10px;
		}
	}

	/* Details box */
	.details-box {
		background-color: var(--background-shaded);
		padding: 1em;

		h3 {
			margin-top: 0;
			margin-bottom: 6px;
		}

		.preview-button {
			margin-left: 0.5em;
			padding: 4px;
		}

		.close-button {
			float: right;
			margin-left: 0.4em;
			margin-bottom: 0.4em;
		}

		blockquote {
			font-style: italic;
			margin-top: 0.8em;

			&::before {
				content: "“";
			}
			&::after {
				content: "”";
			}
		}
	}

	/* Categories listed in modal preview */
	.preview-list {
		list-style: decimal;
		padding-left: 50px;
		margin: 2px;

		li {
			margin-bottom: 4px;
		}
	}
</style>
