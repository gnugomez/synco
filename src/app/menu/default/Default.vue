<script setup lang="ts">
import { useRoomStore } from '../room/RoomStore'

const { createRandomRoom } = useRoomStore()
</script>

<template>
  <div class="wrapper">
    <header>
      <h1>Create a room and start sharing</h1>
      <p class="text-white/60 text-sm italic">
        Once you create a room a link and a code will be generated in order to let you start a peer
        to peer connection with your colleges and start sharng content!
      </p>
    </header>
    <main>
      <router-link to="/join" class="button secondary">
        Join
      </router-link>
      <a class="button primary" @click="createRandomRoom"> Create </a>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  @apply grid gap-5;
}
header {
  @apply grid gap-1;
}
main {
  @apply grid grid-cols-2 gap-5;
}
</style>
