import { consola } from 'consola'
import { ref } from 'vue'

export default class VideoElementHandler {
	public static videoElment = ref<HTMLVideoElement | null>(null)

	public static findVideoElement() {
		consola.debug('findVideoElement triggered')
		this.videoElment.value = document.querySelector('video')
	}
}
