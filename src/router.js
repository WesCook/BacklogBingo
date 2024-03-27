import { createRouter, createWebHashHistory } from 'vue-router';

import HomePage from './pages/HomePage.vue';
import NotFound from './pages/NotFound.vue';

const routes = [
	{ path: '/', component: HomePage },
	{ path: '/:pathMatch(.*)*', component: NotFound }
];

const router = createRouter({
	history: createWebHashHistory(), // Hashes required on GitHub Pages due to poor SPA support
	routes
});

export default router;
