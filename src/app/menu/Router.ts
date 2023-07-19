import { createMemoryHistory, createRouter } from 'vue-router'
import DefaultView from './Default.vue'
import OtherView from './Other.vue'

const router = createRouter({
	history: createMemoryHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '',
			name: 'default',
			component: DefaultView,
		},
		{
			path: '/other',
			name: 'other',
			component: OtherView,
		},
	],
})

export default router
