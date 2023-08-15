import { createMemoryHistory, createRouter } from 'vue-router'
import DefaultView from '../default/Default.vue'
import RoomView from '../room/RoomView.vue'
import JoinView from '../room/JoinView.vue'
import { roomIsUndefined } from './RoomIsUndefined'

const router = createRouter({
	history: createMemoryHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '',
			name: 'default',
			component: DefaultView,
			beforeEnter: [roomIsUndefined],
		},
		{
			path: '/room',
			name: 'room',
			component: RoomView,
		},
		{
			path: '/join',
			name: 'join',
			component: JoinView,
			beforeEnter: [roomIsUndefined],
		},
	],
})

export default router
