import { createRouter, createWebHashHistory } from 'vue-router';

import { useErrors } from './composables/errors.js';
import { useCategories } from './composables/categories.js';
import { useBingo } from './composables/bingo.js';

const { isCardSourceSet } = useCategories();
const { isBingoCardSet } = useBingo();
const { setError, clearError } = useErrors();

import CardSource from './pages/CardSource.vue';
import GameRules from './pages/GameRules.vue';
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
			} else if (isCardSourceSet.value) {
				return '/gamerules';
			} else {
				return '/card';
			}
		}
	},
	{
		path: '/card',
		component: CardSource,
		meta: {
			title: 'Card Source - Backlog Bingo'
		},
		beforeEnter: () => {
			if (isBingoCardSet.value) {
				setError('You cannot access that page once a bingo card has been generated.  You have been redirected.');
				return '/bingo';
			}
		}
	},
	{
		path: '/gamerules',
		component: GameRules,
		meta: {
			title: 'Game Rules - Backlog Bingo'
		},
		beforeEnter: () => {
			if (!isCardSourceSet.value && !isBingoCardSet.value) {
				setError('You cannot access that page without first defining a card source or bingo card.  You have been redirected to do so now.');
				return '/card';
			}
		}
	},
	{
		path: '/categories',
		component: RefineCategories,
		meta: {
			title: 'Refine Categories - Backlog Bingo'
		},
		beforeEnter: () => {
			if (!isCardSourceSet.value) {
				setError('You cannot access that page without first defining a card source.  You have been redirected to do so now.');
				return '/card';
			}
			if (isBingoCardSet.value) {
				setError('You cannot access that page once a bingo card has been generated.  You have been redirected.');
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
				setError('You cannot access that page without first generating a bingo card.  You have been redirected to do so now.');
				if (!isCardSourceSet.value) {
					return '/card';
				} else {
					return '/gamerules';
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
			return { x: 0, y: 0 };
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
