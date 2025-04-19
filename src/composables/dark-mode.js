import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useDarkMode() {
	const isDark = ref(false);

	const updateTheme = () => {
		isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
	};

	onMounted(() => {
		updateTheme();
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);
	});

	onBeforeUnmount(() => {
		window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', updateTheme);
	});

	return { isDark };
}
