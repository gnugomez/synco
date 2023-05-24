<script setup lang="ts">
import { consola } from 'consola'
import PeerFactory from '../messaging/infrastructure/peer/PeerFactory'
import { useObservable } from '@vueuse/rxjs'

consola.info('Vue Context Mounted successfully')
const peerConexion = PeerFactory.createPeerFor('room-name')

const connectionState = useObservable(peerConexion.connectionState)
</script>

<template>
    <div class="sync-video">
        <p>Connection State: {{ connectionState }}</p>
    </div>
</template>

<style lang="scss" scoped>
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
}
</style>
