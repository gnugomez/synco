<script setup lang="ts">
import { useObservable } from '@vueuse/rxjs'
import { computed } from 'vue'
import type PeerConnection from '../../comunication/peer/domain/PeerConnection'
import { PeerConnectionState } from '@/app/comunication/peer/domain/PeerConnectionState'

const props = defineProps<{ connection: PeerConnection }>()

const state = useObservable(props.connection.connectionState)
const signalingState = useObservable(props.connection.signalingState)

const isGreen = computed(() => {
	return PeerConnectionState.CONNECTED === state.value
})
const isRed = computed(() => {
	return (
		PeerConnectionState.DISCONNECTED === state.value
    || PeerConnectionState.FAILED === state.value
    || PeerConnectionState.CLOSED === state.value
	)
})
const isYellow = computed(() => {
	return !isGreen.value && !isRed.value
})
</script>

<template>
  <div
    class="connection"
    :title="`Polite: ${connection.polite}, Signaling state: ${signalingState}`"
  >
    <div class="wrapper">
      <div>{{ connection.targetIdentifier.id }}</div>
      <div class="label" :title="state" :class="{ green: isGreen, yellow: isYellow, red: isRed }" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.connection {
  .wrapper {
    @apply flex justify-between items-center;
    @apply p-2;
    @apply bg-gray-500/40 rounded-md;
  }
  .label {
    @apply w-2 h-2 rounded-full mb-auto;

    &.green {
      @apply bg-green-500;
    }

    &.yellow {
      @apply bg-yellow-500;
    }

    &.red {
      @apply bg-red-500;
    }
  }
}
</style>
