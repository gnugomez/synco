<script setup lang="ts">
import { consola } from 'consola'
import { ref } from 'vue'
import PeerFactory from '../messaging/infrastructure/PeerFactory'

consola.info('Vue Context Mounted successfully')
const peerConexion = PeerFactory.createPeerFor('room-name')

const inputValue = ref('')

const { localDescription, remoteDescription, connectionState } = peerConexion

peerConexion.init()

const handleClick = () => {
  peerConexion.dataChannel!.send(inputValue.value)
}
</script>

<template>
  <div class="sync-video">
    <h1>Sync Video</h1>
    <p>Connection State: {{ connectionState }}</p>
    <textarea
      name=""
      id=""
      cols="30"
      rows="10"
      :value="JSON.stringify(localDescription)"
    ></textarea>
    <textarea
      name=""
      id=""
      cols="30"
      rows="10"
      :value="JSON.stringify(remoteDescription)"
    ></textarea>
    <input v-model="inputValue" type="text" placeholder="message" />
    <button @click="handleClick">Submit</button>
  </div>
</template>

<style scoped>
.sync-video {
  font-size: 15px !important;
  font-family: 'Roboto', sans-serif !important;
  color: #000 !important;
  position: fixed;
  padding: 20px;
  word-wrap: break-word;
  max-width: 100%;
  border: 1px solid white;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.635);
  backdrop-filter: blur(5px) saturate(200%) contrast(45%) brightness(130%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99999;
}
</style>
