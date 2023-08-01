import { useMediaControls } from '@vueuse/core'
import { consola } from 'consola'
import { computed, ref } from 'vue'

export function useVideoElement() {
	const videoElment = ref<HTMLVideoElement | null>(null)
	const { currentTime, playing, duration: mediaControlsDuration } = useMediaControls(videoElment)
	const duration = computed(() => mediaControlsDuration.value === 0 ? videoElment.value?.duration : mediaControlsDuration.value)

	function findVideoElement() {
		consola.debug('findVideoElement triggered')
		videoElment.value = document.querySelector('video')
	}

	return { findVideoElement, videoElment, duration, currentTime, playing }
}
