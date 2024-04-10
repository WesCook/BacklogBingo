import { createRouter, createWebHashHistory } from 'vue-router';

import { useErrors } from './composables/errors.js';
import { useCategories } from './composables/categories.js';
import { useBingo } from './composables/bingo.js';

const { isCardSourceSet } = useCategories();
const { isBingoCardSet } = useBingo();
const { setError, clearError } = useErrors();

import HomePage from './pages/HomePage.vue';
import CardSource from './pages/CardSource.vue';
import GameRules from './pages/GameRules.vue';
import RefineCategories from './pages/RefineCategories.vue';
import BingoCard from './pages/BingoCard.vue';
import NotFound from './pages/NotFound.vue';

const routes = [
	{ path: '/', component: HomePage },
	{ path: '/card', component: CardSource, beforeEnter: () => {
		if (isBingoCardSet.value) {
			setError('You cannot access that page once a bingo card has been generated.  You have been redirected.');
			return '/bingo';
		}
	}},
	{ path: '/gamerules', component: GameRules, beforeEnter: () => {
		if (!isCardSourceSet.value) {
			setError('You cannot access that page without first defining a card source.  You have been redirected to do so now.');
			return '/card';
		}
	}},
	{ path: '/categories', component: RefineCategories, beforeEnter: () => {
		if (!isCardSourceSet.value) {
			setError('You cannot access that page without first defining a card source.  You have been redirected to do so now.');
			return '/card';
		}
		if (isBingoCardSet.value) {
			setError('You cannot access that page once a bingo card has been generated.  You have been redirected.');
			return '/bingo';
		}
	}},
	{ path: '/bingo', component: BingoCard, beforeEnter: () => {
		if (!isBingoCardSet.value) {
			setError('You cannot access that page without first generating a bingo card.  You have been redirected to do so now.');
			if (!isCardSourceSet.value) {
				return '/card';
			} else {
				return '/gamerules';
			}
		}
	}},
	{ path: '/:pathMatch(.*)*', component: NotFound }
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

// Clear errors when changing page (though skip redirects so redirect notices persist)
router.beforeEach(route => {
	if (!route.redirectedFrom) {
		clearError();
	}
});

export default router;
