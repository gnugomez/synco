<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useObservable } from '@vueuse/rxjs'
import { useToggle } from '@vueuse/core'
import { computed } from 'vue'
import ConnectionComponent from './ConnectionComponent.vue'
import { useRoomStore } from './RoomStore'
import Copy from '~icons/ic/round-content-copy'

const { currentRoom } = storeToRefs(useRoomStore())

if (!currentRoom.value)
	throw new Error('Room not found')

const connections = useObservable(currentRoom.value.peerConnections)

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
