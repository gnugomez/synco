import { type IgnoredUpdater, useEventListener, watchIgnorable } from '@vueuse/core'
import { consola } from 'consola'
import { type Ref, onMounted, ref, toValue } from 'vue'
import { useCurrentPlayer } from '@/app/player/application/useCurrentPlayer'
import type Player from '@/app/player/domain/Player'

export function useVideoControls() {
  const videoElement = ref<HTMLVideoElement>()
  const player = ref<Player>()
  const {
    currentTime,
    duration,
    playing,
    seeking,
    ignoreCurrentTimeUpdates,
    ignorePlayingUpdates,
  } = createVideoEventHooks(videoElement, player)
  const { onManualJump, ignoreManualJumpUpdates } = createManualJumpConsumer(currentTime)
  const { onPlaying, ignoreManualPlayingUpdates } = createPlayingConsumer(playing)

  function findPlayer() {
    player.value = useCurrentPlayer()
    const video = player.value.initialize()
    if (video) {
      videoElement.value = video
      duration.value = video.duration
      ignoreManualJumpUpdates(() => ignoreCurrentTimeUpdates(() => (currentTime.value = video.currentTime)))
      ignoreManualPlayingUpdates(() => ignorePlayingUpdates(() => (playing.value = !video.paused)))
    }
  }

  onMounted(() => {
    findPlayer()
  })

  return {
    currentTime,
    duration,
    playing,
    seeking,
    onManualJump,
    onPlaying,
    ignoreManualJumpUpdates,
    ignoreCurrentTimeUpdates,
    ignoreManualPlayingUpdates,
  }
}

function createManualJumpConsumer(currentTime: Ref<number>): {
  onManualJump: (consumer: (time: number) => void) => void
  ignoreManualJumpUpdates: IgnoredUpdater
} {
  let currentTimeManualJumpConsumer: (time: number) => void = () => {}

  const onManualJump = (consumer: (time: number) => void) => {
    currentTimeManualJumpConsumer = consumer
  }

  const { ignoreUpdates: ignoreManualJumpUpdates } = watchIgnorable(
    currentTime,
    (time, prevTime) => {
      if (Math.abs(time - prevTime) > 1) {
        consola.debug('Manual jump detected')
        currentTimeManualJumpConsumer(time)
      }
    },
  )

  return {
    onManualJump,
    ignoreManualJumpUpdates,
  }
}

function createPlayingConsumer(playing: Ref<boolean>): {
  onPlaying: (consumer: (isPlaying: boolean) => void) => void
  ignoreManualPlayingUpdates: IgnoredUpdater
} {
  let playingConsumer: (isPlaying: boolean) => void = () => {}

  const onPlaying = (consumer: (isPlaying: boolean) => void) => {
    playingConsumer = consumer
  }

  const { ignoreUpdates: ignoreManualPlayingUpdates } = watchIgnorable(playing, (isPlaying) => {
    playingConsumer(isPlaying)
  })

  return {
    onPlaying,
    ignoreManualPlayingUpdates,
  }
}

function createVideoEventHooks(target: Ref<HTMLVideoElement | undefined>, player: Ref<Player | undefined>) {
  const currentTime = ref<number>(0)
  const duration = ref<number>(0)
  const playing = ref<boolean>(false)
  const seeking = ref<boolean>(false)

  const { ignoreUpdates: ignoreCurrentTimeUpdates } = watchIgnorable(currentTime, (time) => {
    const p = toValue(player)
    if (!p)
      return

    p.seek(time)
  })

  const { ignoreUpdates: ignorePlayingUpdates } = watchIgnorable(playing, (isPlaying) => {
    const p = toValue(player)
    if (!p)
      return

    isPlaying ? p.play() : p.pause()
  })

  useEventListener(target, 'timeupdate', () =>
    ignoreCurrentTimeUpdates(() => (currentTime.value = toValue(target)!.currentTime)))
  useEventListener(target, 'durationchange', () => (duration.value = toValue(target)!.duration))
  useEventListener(target, 'pause', () => ignorePlayingUpdates(() => (playing.value = false)))
  useEventListener(target, 'play', () => ignorePlayingUpdates(() => (playing.value = true)))
  useEventListener(target, 'seeking', () => (seeking.value = true))
  useEventListener(target, 'seeked', () => (seeking.value = false))

  return { currentTime, duration, playing, seeking, ignoreCurrentTimeUpdates, ignorePlayingUpdates }
}
