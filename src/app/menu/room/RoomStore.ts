import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { consola } from 'consola'
import { useRouter } from 'vue-router'
import type { Room } from '@gnugomez/synco-room'
import { roomFactory } from '@/app/comunication/context/Context'

export const useRoomStore = defineStore('room', () => {
	const { push } = useRouter()
	const currentRoom = ref<Room>()

	watch(currentRoom, (room) => {
		consola.debug(`Current room changed to ${room?.id}`)

		if (room)
			push({ name: 'room' })
	})

	const createRoom = (roomId: string) => {
		currentRoom.value = roomFactory.createRoom(roomId)
	}

	const generateRandomStringSecuence = () => {
		return Math.random().toString(36).substring(2, 15)
	}

	const createRandomRoom = () => {
		return createRoom(`room-${generateRandomStringSecuence()}`)
	}

	const leaveRoom = () => {
		currentRoom.value = undefined
		push({ name: 'default' })
	}

	return {
		createRandomRoom,
		createRoom,
		leaveRoom,
		currentRoom,
	}
})
