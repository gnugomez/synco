import { useObservable } from '@vueuse/rxjs'
import { consola } from 'consola'
import { BehaviorSubject, Subject, fromEvent, map, mergeMap } from 'rxjs'
import { onMounted } from 'vue'

export function useVideoControls() {
	const videoElement = new Subject<HTMLVideoElement>()
	const { currentTime, duration, playing } = createVideoEventHooks(videoElement)

	function findVideoElement() {
		const video = document.querySelector<HTMLVideoElement>('video')
		if (video) {
			consola.debug('findVideoElement triggered')
			videoElement.next(video)
			currentTime.next(video.currentTime)
			duration.next(video.duration)
			playing.next(!video.paused)
		}
	}

	onMounted(() => {
		findVideoElement()
	})

	return {
		currentTime: useObservable(currentTime),
		duration: useObservable(duration),
		playing: useObservable(playing),
	}
}

function createVideoEventHooks(videoElement: Subject<HTMLVideoElement>) {
	const currentTime = new BehaviorSubject<number>(0)
	const duration = new BehaviorSubject<number>(0)
	const playing = new BehaviorSubject<boolean>(false)

	videoElement.pipe(
		mergeMap(video => fromEvent(video, 'timeupdate')
			.pipe(map(() => video.currentTime))),
	).subscribe(currentTime)

	videoElement.pipe(
		mergeMap(video => fromEvent(video, 'durationchange')
			.pipe(map(() => video.duration))),
	).subscribe(duration)

	videoElement.pipe(
		mergeMap(video => fromEvent(video, 'play')
			.pipe(map(() => true))),
	).subscribe(playing)

	videoElement.pipe(
		mergeMap(video => fromEvent(video, 'pause')
			.pipe(map(() => false))),
	).subscribe(playing)
	return { currentTime, duration, playing }
}
