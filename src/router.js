import { createRouter, createWebHashHistory } from 'vue-router';

// import HomePage from './pages/HomePage.vue';
import GameRules from './pages/GameRules.vue';
import NotFound from './pages/NotFound.vue';

const routes = [
	// { path: '/', component: HomePage },
	{ path: '/gamerules', alias: '/', component: GameRules },
	{ path: '/:pathMatch(.*)*', component: NotFound }
];

const router = createRouter({
	history: createWebHashHistory(), // Hashes required on GitHub Pages due to poor SPA support
	routes
});

export default router;
