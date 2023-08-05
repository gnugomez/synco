import { toValue, useEventListener, watchIgnorable } from '@vueuse/core'
import { consola } from 'consola'
import { type Ref, onMounted, ref } from 'vue'

export function useVideoControls() {
	const videoElement = ref<HTMLVideoElement>()
	const { currentTime, duration, playing } = createVideoEventHooks(videoElement)

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
	}
}

function createVideoEventHooks(target: Ref<HTMLVideoElement | undefined>) {
	const currentTime = ref<number>(0)
	const duration = ref<number>(0)
	const playing = ref<boolean>(false)

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

	return { currentTime, duration, playing }
}
