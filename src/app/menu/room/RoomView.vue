<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Room } from '@gnugomez/synco-room'
import RoomDashboard from './RoomDashboard.vue'
import { useRoomStore } from './RoomStore'

const { currentRoom } = storeToRefs(useRoomStore())
</script>

<template>
  <RoomDashboard v-if="currentRoom" :room="currentRoom as Room" />
</template>
