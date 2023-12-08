<script setup lang="ts">
import { storeToRefs } from 'pinia'
import RoomDashboard from './RoomDashboard.vue'
import { useRoomStore } from './RoomStore'
import type Room from '@/app/comunication/room/domain/Room'

const { currentRoom } = storeToRefs(useRoomStore())
</script>

<template>
  <RoomDashboard v-if="currentRoom" :room="currentRoom as Room" />
</template>
