<script setup lang="ts">
import { consola } from 'consola'
import { useObservable } from '@vueuse/rxjs'
import Context from '../messaging/infrastructure/context/Context'
import ConnectionComponent from './ConnectionComponent.vue'

const { roomFactory } = Context

consola.info('Vue Context Mounted successfully')
const room = roomFactory.createRoom('sync-video-rtc')

const connections = useObservable(room.peerConnections)
</script>

<template>
  <div class="sync-video">
    <div>Room {{ room.id }}</div>
    <div>Room client ID: {{ room.peerId.id }}</div>
    <ConnectionComponent
      v-for="connection of connections"
      :key="connection.identifier.id"
      :connection="connection"
      class="item"
    />
  </div>
</template>

<style lang="scss">
#sync-video-rtc .sync-video {
  @apply bg-gray-100/5;
  font-size: 15px !important;
  font-family: 'Roboto', sans-serif !important;
  color: #000 !important;
  position: fixed;
  padding: 20px;
  word-wrap: break-word;
  max-width: 100%;
  border: 1px solid white;
  border-radius: 10px;
  backdrop-filter: blur(5px) saturate(200%) contrast(45%) brightness(130%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99999;
  @apply grid gap-4;

  .item {
    @apply bg-gray-100/30 p-4 rounded-md;
  }
}
</style>
