<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useObservable } from '@vueuse/rxjs'
import { useMediaControls, useToggle } from '@vueuse/core'
import { computed, onMounted, watch } from 'vue'
import { consola } from 'consola'
import ConnectionComponent from './ConnectionComponent.vue'
import { useRoomStore } from './RoomStore'
import VideoElementHandler from './VideoElementHandler'
import Copy from '~icons/ic/round-content-copy'

const { currentRoom } = storeToRefs(useRoomStore())
if (!currentRoom.value)
	throw new Error('Room not found')

const connections = useObservable(currentRoom.value.peerConnections)

const connectionStates = computed(() => {
	return connections.value?.map((connection) => {
		return useObservable(connection.connectionState).value
	})
})

watch(connectionStates, (states) => {
	consola.info('Connection states', states)
	if (states?.every(state => state === 'connected')) {
		currentRoom.value?.broadcastMessage({
			data: 'Hello world',
		})
	}
})

currentRoom.value?.dataStream.subscribe((data) => {
	consola.success('Data received', data)
})

currentRoom.value?.broadcastMessage({
	data: 'Hello world',
})

const hasConnections = computed(() => {
	return connections.value && connections.value.length > 0
})

const [copyed, toggleCopyed] = useToggle(false)

function copy() {
	navigator.clipboard.writeText(currentRoom.value!.id).then(() => {
		toggleCopyed()
		setTimeout(() => {
			toggleCopyed()
		}, 1000)
	})
}

watch(VideoElementHandler.videoElment, (element) => {
	if (element)
		consola.info('Video element found', element)
	else consola.warn('Video element not found')
})

onMounted(() => {
	VideoElementHandler.findVideoElement()
})

const { currentTime } = useMediaControls(VideoElementHandler.videoElment)
</script>

<template>
  <div class="room">
    <span class="title" :class="{ copyed }">
      <div class="wrapper">
        {{ currentRoom?.id }}
      </div>
      <div title="Copy" class="copy" @click="copy"><Copy /></div>
    </span>
    <p class="text-white/60 text-sm italic">
      Eureka! you have successfully joined a room, just share the room code with your friends!
      Remember, they should also have this extension installed.
    </p>
    <p>{{ currentTime }}</p>
    <div v-if="hasConnections" class="connections">
      <ConnectionComponent
        v-for="connection in connections"
        :key="connection.selfIdentifier.id"
        :connection="connection"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.room {
  @apply grid gap-5 w-full;

  .title {
    @apply border border-gray-500 text-sm rounded-md font-semibold bg-gray-500/50 overflow-hidden;
    @apply flex justify-between items-center min-w-0;
    @apply transition-all duration-300;

    .wrapper {
      @apply flex-1;
      @apply px-4 py-3 overflow-hidden overflow-ellipsis whitespace-nowrap;
    }

    &.copyed {
      @apply bg-white text-gray-950;
    }

    &:not(.copyed) .copy:hover {
      @apply bg-gray-300/30;
    }

    .copy {
      @apply h-full w-10 flex justify-center items-center text-base cursor-pointer;
      @apply flex-shrink-0;
    }
  }

  .connections {
    @apply grid gap-3 grid-cols-3;
  }
}
</style>
