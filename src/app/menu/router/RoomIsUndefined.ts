import type { NavigationGuard } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useRoomStore } from '../room/RoomStore'

export const roomIsUndefined: NavigationGuard = (to, from, next) => {
	const { currentRoom } = storeToRefs(useRoomStore())

	if (currentRoom.value) {
		next(from)
		return
	}

	next()
}
