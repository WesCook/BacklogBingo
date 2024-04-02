<script setup>
	defineProps({
		categories: {
			type: Array,
			default: () => []
		}
	});
</script>

<template>
	<ul>
		<li
			v-for="category in categories"
			:key="category.id"
		>
			<label>
				<input
					:id="category.id"
					type="checkbox"
					checked="checked"
				>
				<span>{{ category.value }}</span>
			</label>
		</li>
	</ul>
</template>
