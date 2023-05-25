<script setup lang="ts">
import type PeerConnection from '../messaging/domain/peer/PeerConnection'
import { useObservable } from '@vueuse/rxjs'

const { connection } = defineProps<{ connection: PeerConnection }>()

const state = useObservable(connection.connectionState)
</script>

<template>
    <div>
        <p>Connection State: {{ state }}</p>
    </div>
</template>
