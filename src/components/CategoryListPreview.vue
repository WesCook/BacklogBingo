<script setup>
	import { ref } from 'vue';

	import DynamicCategory from '../components/DynamicCategory.vue';
	import UIModal from '../components/UIModal.vue';

	const props = defineProps({
		json: {
			type: Object,
			default: () => ({})
		}
	});

	const modalActive = ref(false);
</script>

<template>
	<button @click="modalActive = true;">
		Preview
	</button>

	<teleport to="body">
		<UIModal
			v-if="modalActive"
			:title="json.name"
			:show-close="true"
			@close="modalActive = false"
		>
			<ol class="preview-list">
				<li
					v-for="(category, index) in json.categories"
					:key="index"
				>
					<DynamicCategory
						v-if="category.dynamic"
						:name="category.name"
					/>
					<span v-else>{{ category.name }}</span>
				</li>
			</ol>
		</UIModal>
	</teleport>
</template>

<style scoped>
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
