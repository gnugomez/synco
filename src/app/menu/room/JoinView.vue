<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoomStore } from '../room/RoomStore'

const { createRoom } = useRoomStore()
const roomName = ref()

const isNameValid = computed(() => {
	return roomName.value?.length > 0
})

function join() {
	if (isNameValid.value)
		createRoom(roomName.value)
}
</script>

<template>
  <div class="wrapper">
    <header>
      <div class="input-area">
        <form class="grid" @submit="join">
          <input v-model="roomName" type="text" placeholder="Room name">
        </form>
      </div>
      <p class="text-white/60 text-sm italic">
        Write an existing room code in order to join a room and start sharing content!
      </p>
    </header>
    <main>
      <a class="button primary" @click="join"> Join </a>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  @apply grid gap-5;
}
header {
  @apply grid gap-1 relative;
  .input-area {
    @apply grid;

    input {
      @apply px-4 py-3 placeholder:text-sm placeholder:text-white/70 text-sm rounded-md font-semibold bg-gray-500/50;
      @apply transition-all duration-300;

      &:focus {
        @apply shadow-xl ring-white border-white outline-none;
      }
    }
  }
}
main {
  @apply grid gap-5;
}
</style>
