import { createRouter, createWebHashHistory } from 'vue-router';

import { useErrors } from './composables/errors.js';
import { useCategories } from './composables/categories.js';

const { isCardSourceSet, isBingoCardSet } = useCategories();
const { setError, clearError } = useErrors();

import HomePage from './pages/HomePage.vue';
import CardSource from './pages/CardSource.vue';
import GameRules from './pages/GameRules.vue';
import RefineCategories from './pages/RefineCategories.vue';
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
	{ path: '/categories', component: RefineCategories },
	// { path: '/bingo', component: BingoCard },
	{ path: '/:pathMatch(.*)*', component: NotFound }
];

const router = createRouter({
	history: createWebHashHistory(), // Hashes required on GitHub Pages due to poor SPA support
	routes
});

// Clear errors when changing page (though skip redirects so redirect notices persist)
router.beforeEach(route => {
	if (!route.redirectedFrom) {
		clearError();
	}
});

export default router;
