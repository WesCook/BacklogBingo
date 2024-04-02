import { createRouter, createWebHashHistory } from 'vue-router';

import HomePage from './pages/HomePage.vue';
import CardSource from './pages/CardSource.vue';
import GameRules from './pages/GameRules.vue';
import FilterCategories from './pages/FilterCategories.vue';
import NotFound from './pages/NotFound.vue';

const routes = [
	{ path: '/', component: HomePage },
	{ path: '/card', component: CardSource },
	{ path: '/gamerules', component: GameRules },
	{ path: '/categories', component: FilterCategories },
	{ path: '/:pathMatch(.*)*', component: NotFound }
];

const router = createRouter({
	history: createWebHashHistory(), // Hashes required on GitHub Pages due to poor SPA support
	routes
});

export default router;
