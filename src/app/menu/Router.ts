import { createRouter, createWebHistory } from 'vue-router'
import DefaultView from './Default.vue'
import OtherView from './Other.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '',
			name: 'default',
			component: DefaultView,
		},
		{
			path: '',
			name: 'other',
			component: OtherView,
		},
	],
})

export default router
