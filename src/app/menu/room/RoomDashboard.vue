<script setup lang="ts">
import { useObservable } from '@vueuse/rxjs'
import { useToggle } from '@vueuse/core'
import { computed } from 'vue'
import type { Room } from '@gnugomez/synco-room'
import ConnectionComponent from './Connection.vue'
import { useVideoControls } from './composables/useVideoControls'
import { useRoomStore } from './RoomStore'
import Copy from '~icons/ic/round-content-copy'
import Leave from '~icons/ic/round-logout'

const { room } = defineProps<{ room: Room }>()

const { leaveRoom } = useRoomStore()

const connections = useObservable(room.peerConnections)

const hasConnections = computed(() => {
	return connections.value && connections.value.length > 0
})

const {
	duration,
	currentTime,
	playing,
	onManualJump,
	ignoreManualJumpUpdates,
	onPlaying,
	ignoreManualPlayingUpdates,
} = useVideoControls()

// TODO: move this to a better place such as RoomStore
onManualJump((time) => {
	room.broadcastManualJump(time)
})
onPlaying((value) => {
	room.broadcastPlaying(value, currentTime.value)
})
room.onManualJump((value) => {
	ignoreManualJumpUpdates(() => {
		currentTime.value = value.time
	})
})
room.onPlaying((value) => {
	ignoreManualPlayingUpdates(() => {
		playing.value = value.isPlaying
	})
	ignoreManualJumpUpdates(() => {
		currentTime.value = value.time
	})
})
// --

const currentProgress = computed(() => {
	if (!duration.value || !currentTime.value)
		return 0
	return (currentTime.value / duration.value) * 100
})

const [copyed, toggleCopyed] = useToggle(false)
function copy() {
	navigator.clipboard.writeText(room.id).then(() => {
		toggleCopyed()
		setTimeout(() => {
			toggleCopyed()
		}, 1000)
	})
}
</script>

<template>
  <div class="room">
    <div class="header-wrapper">
      <span class="title" :class="{ copyed }">
        <div class="wrapper">
          {{ room.id }}
        </div>
        <div title="Copy" class="copy" @click="copy"><Copy /></div>
      </span>
      <span class="leave" title="Leave room" @click="leaveRoom"><Leave /></span>
    </div>
    <p v-if="!hasConnections" class="text-white/60 text-sm italic">
      Eureka! you have successfully joined a room, just share the room code with your friends!
      Remember, they should also have this extension installed.
    </p>
    <div class="progress">
      <div class="bar" :style="`width: ${currentProgress}%;`" />
    </div>
    <div v-if="hasConnections" class="connections">
      <span class="label">Connections</span>
      <div class="connections-grid">
        <ConnectionComponent
          v-for="connection in connections"
          :key="connection.selfIdentifier.id"
          :connection="connection"
        />
      </div>
    </div>
    <div class="progress">
      <div class="bar" :style="`width: ${currentProgress}%;`" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.room {
  @apply grid gap-5 w-full;

  .header-wrapper {
    @apply flex gap-2 min-w-0;
  }

  .label {
    @apply text-sm font-semibold text-gray-500;
  }

  .title {
    @apply border border-gray-500 text-sm rounded-md font-semibold bg-gray-500/50 overflow-hidden;
    @apply flex justify-between items-center min-w-0;
    @apply transition-all duration-300;
    @apply flex-1;

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
      @apply h-full w-10 flex justify-center items-center text-base;
      @apply flex-shrink-0;
    }
  }

  .leave {
    @apply h-full aspect-1 rounded-md border border-gray-500 bg-gray-500/50 text-sm font-semibold;
    @apply grid place-items-center;
    @apply cursor-default;
    @apply transition-all duration-300;

    &:hover {
      @apply border-red-500 bg-red-500/50 text-red-100;
      @apply shadow-xl shadow-red-500/30;
    }
  }

  .progress {
    @apply h-1 w-full bg-gray-500/50 overflow-hidden;
    @apply absolute bottom-0 inset-x-0;

    .bar {
      @apply h-full bg-white/80 absolute top-0 left-0;
      @apply transition-all duration-300;
    }
  }

  .connections-grid {
    @apply grid gap-3 grid-cols-3;
  }

  .connections {
    @apply flex flex-col gap-2;
  }
}
</style>
