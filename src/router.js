import { createRouter, createWebHashHistory } from 'vue-router';

import { useErrors } from './composables/errors.js';
import { useCategories } from './composables/categories.js';
import { useBingo } from './composables/bingo.js';

const { isCategoryListSet } = useCategories();
const { isBingoCardSet } = useBingo();
const { setError, clearError } = useErrors();

import CategoryList from './pages/CategoryList.vue';
import GameSettings from './pages/GameSettings.vue';
import RefineCategories from './pages/RefineCategories.vue';
import BingoCard from './pages/BingoCard.vue';
import NotFound from './pages/NotFound.vue';

const routes = [
	{
		// Just using the index as a redirect
		path: '/',
		component: NotFound,
		beforeEnter: () => {
			if (isBingoCardSet.value) {
				return '/bingo';
			} else if (isCategoryListSet.value) {
				return '/settings';
			} else {
				return '/list';
			}
		}
	},
	{
		path: '/list',
		component: CategoryList,
		meta: {
			title: 'Category List - Backlog Bingo'
		},
		beforeEnter: () => {
			if (isBingoCardSet.value) {
				setError('You cannot access the Category List page once a bingo card has been generated.  You have been redirected.');
				return '/bingo';
			}
		}
	},
	{
		path: '/settings',
		component: GameSettings,
		meta: {
			title: 'Settings - Backlog Bingo'
		},
		beforeEnter: () => {
			if (!isCategoryListSet.value && !isBingoCardSet.value) {
				setError('You cannot access the Settings page without first setting a category list or bingo card.  You have been redirected to do so now.');
				return '/list';
			}
		}
	},
	{
		path: '/refine',
		component: RefineCategories,
		meta: {
			title: 'Refine Categories - Backlog Bingo'
		},
		beforeEnter: () => {
			if (!isCategoryListSet.value) {
				setError('You cannot access the Refine Categories page without first setting a category list.  You have been redirected to do so now.');
				return '/list';
			}
			if (isBingoCardSet.value) {
				setError('You cannot access the Refine Categories page once a bingo card has been generated.  You have been redirected.');
				return '/bingo';
			}
		}
	},
	{
		path: '/bingo',
		component: BingoCard,
		meta: {
			title: 'Backlog Bingo'
		},
		beforeEnter: () => {
			if (!isBingoCardSet.value) {
				setError('You cannot access the Bingo Card page without first generating a bingo card.  You have been redirected to do so now.');
				if (!isCategoryListSet.value) {
					return '/list';
				} else {
					return '/settings';
				}
			}
		}
	},
	{
		path: '/:pathMatch(.*)*',
		component: NotFound,
		meta: {
			title: '404 - Backlog Bingo'
		}
	}
];

const router = createRouter({
	history: createWebHashHistory(), // Hashes required on GitHub Pages due to poor SPA support
	routes,
	// Scroll to top, unless revisiting previous route
	scrollBehavior(_to, _from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		} else {
			return { left: 0, top: 0 };
		}
	},
});

router.beforeEach(route => {
	// Update title
	document.title = route.meta.title;

	// Clear errors when changing page (though skip redirects so redirect notices persist)
	if (!route.redirectedFrom) {
		clearError();
	}
});

export default router;
