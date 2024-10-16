<script setup>
	import { ref } from 'vue';

	import BingoOutputMarkdown from '../components/BingoOutputMarkdown.vue';
	import BingoOutputPlaintext from '../components/BingoOutputPlaintext.vue';

	const props = defineProps({
		winState: {
			type: Boolean,
			default: false
		}
	});

	const tabs = [
		{ id: 'markdown', label: 'Markdown', component: BingoOutputMarkdown },
		{ id: 'plaintext', label: 'Plain Text', component: BingoOutputPlaintext }
	];

	// Stores ID of current tab, uses a default value
	const currentTab = ref('markdown');

	const setCurrentTab = tabID => {
		currentTab.value = tabID;
	};

	const getCurrentTabComponent = () => {
		return tabs.find(tab => tab.id === currentTab.value).component;
	};
</script>

<template>
	<!-- Tabs -->
	<ol
		class="tab-list"
		role="tablist"
		aria-label="Output Tabs"
	>
		<li
			v-for="tab in tabs"
			:key="tab.id"
			role="tab"
			:aria-controls="`panel-${tab.id}`"
			:aria-selected="currentTab === tab.id"
		>
			<button
				:id="`tab-${tab.id}`"
				class="tab-button"
				@click="setCurrentTab(tab.id)"
			>
				{{ tab.label }}
			</button>
		</li>
	</ol>

	<!-- Loaded tab -->
	<component
		:is="getCurrentTabComponent()"
		:id="`panel-${currentTab}`"
		role="tabpanel"
		class="loaded-component"
		:aria-labelledby="`tab-${currentTab}`"
		:win-state="winState"
	/>
</template>

<style scoped>
	.tab-list {
		display: flex;
		list-style-type: none;
		padding-left: 0;
	}

	.tab-button {
		background-color: transparent;
		border-right-width: 0;
		border-bottom: none;
	}

	.tab-list li[aria-selected="true"] .tab-button {
		background-color: var(--background-shaded);
	}

	.tab-list li:first-child .tab-button {
		border-top-left-radius: 10px;
	}
	.tab-list li:last-child .tab-button {
		border-top-right-radius: 10px;
		border-right-width: 1px;
	}

	.loaded-component {
		border: 1px solid var(--border-color);
		padding: 10px;
		border-radius: 0 0 10px 10px;
	}
</style>
