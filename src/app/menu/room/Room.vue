<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useObservable } from '@vueuse/rxjs'
import ConnectionComponent from './ConnectionComponent.vue'
import { useRoomStore } from './RoomStore'

const { currentRoom } = storeToRefs(useRoomStore())

if (!currentRoom.value)
	throw new Error('Room not found')

const connections = useObservable(currentRoom.value.peerConnections)
</script>

<template>
  <div class="room">
    <h1>Room Id: {{ currentRoom?.id }}</h1>

    <div class="connections">
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
  @apply grid gap-5;

  .connections {
    @apply grid gap-3;
  }
}
</style>
