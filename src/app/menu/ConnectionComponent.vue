<script setup lang="ts">
import { useObservable } from '@vueuse/rxjs'
import { consola } from 'consola'
import type PeerConnection from '../messaging/domain/peer/PeerConnection'

const props = defineProps<{ connection: PeerConnection }>()

props.connection.connectionState.subscribe((state) => {
  consola.success('Connection State: ', state)
})

const state = useObservable(props.connection.connectionState)
const signalingState = useObservable(props.connection.signalingState)
</script>

<template>
  <div>
    <p>Is polite peer: {{ connection.polite }}</p><br>
    <p>ID: {{ connection.identifier.id }}</p>
    <br>
    <p>Connection State: {{ state }}</p>
    <br>
    <p>Signaling State: {{ signalingState }}</p>
  </div>
</template>
