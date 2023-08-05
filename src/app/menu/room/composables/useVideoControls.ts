import { type IgnoredUpdater, toValue, useEventListener, watchIgnorable } from '@vueuse/core'
import { consola } from 'consola'
import { type Ref, onMounted, ref } from 'vue'

export function useVideoControls() {
	const videoElement = ref<HTMLVideoElement>()
	const { currentTime, duration, playing, seeking, ignoreCurrentTimeUpdates, ignorePlayingUpdates } = createVideoEventHooks(videoElement)
	const { onManualJump, ignoreManualJumpUpdates } = createManualJumpConsumer(currentTime)

	function findVideoElement() {
		const video = document.querySelector<HTMLVideoElement>('video')
		if (video) {
			consola.debug('findVideoElement triggered')
			videoElement.value = video
			currentTime.value = video.currentTime
			duration.value = video.duration
			playing.value = !video.paused
		}
	}

	onMounted(() => {
		findVideoElement()
	})

	return {
		currentTime,
		duration,
		playing,
		seeking,
		onManualJump,
		ignoreManualJumpUpdates,
		ignoreCurrentTimeUpdates,
		ignorePlayingUpdates,
	}
}

function createManualJumpConsumer(currentTime: Ref<number>): { onManualJump: (consumer: (time: number) => void) => void; ignoreManualJumpUpdates: IgnoredUpdater } {
	let currentTimeManualJumpConsumer: (time: number) => void = () => { }

	const onManualJump = (consumer: (time: number) => void) => {
		currentTimeManualJumpConsumer = consumer
	}

	const { ignoreUpdates: ignoreManualJumpUpdates } = watchIgnorable(currentTime, (time, prevTime) => {
		if (Math.abs(time - prevTime) > 1) {
			consola.debug('Manual jump detected')
			currentTimeManualJumpConsumer(time)
		}
	})

	return {
		onManualJump,
		ignoreManualJumpUpdates,
	}
}

function createVideoEventHooks(target: Ref<HTMLVideoElement | undefined>) {
	const currentTime = ref<number>(0)
	const duration = ref<number>(0)
	const playing = ref<boolean>(false)
	const seeking = ref<boolean>(false)

	const { ignoreUpdates: ignoreCurrentTimeUpdates } = watchIgnorable(currentTime, (time) => {
		const el = toValue(target)
		if (!el)
			return

		el.currentTime = time
	})

	const { ignoreUpdates: ignorePlayingUpdates } = watchIgnorable(playing, (isPlaying) => {
		const el = toValue(target)
		if (!el)
			return

		isPlaying ? el.play() : el.pause()
	})

	useEventListener(target, 'timeupdate', () => ignoreCurrentTimeUpdates(() => currentTime.value = (toValue(target))!.currentTime))
	useEventListener(target, 'durationchange', () => duration.value = (toValue(target))!.duration)
	useEventListener(target, 'pause', () => ignorePlayingUpdates(() => playing.value = false))
	useEventListener(target, 'play', () => ignorePlayingUpdates(() => playing.value = true))
	useEventListener(target, 'seeking', () => seeking.value = true)
	useEventListener(target, 'seeked', () => seeking.value = false)

	return { currentTime, duration, playing, seeking, ignoreCurrentTimeUpdates, ignorePlayingUpdates }
}
