import { consola } from 'consola'
import type Player from '../domain/Player'
import PlayerInitializationException from '../domain/PlayerInitializationException'

export default class NetflixPlayer implements Player {
	private video?: HTMLVideoElement

	initialize(): HTMLVideoElement {
		consola.debug('NetflixPlayer is being initialized')
		const video = document.querySelector<HTMLVideoElement>('video')
		if (!video)
			throw new PlayerInitializationException('Video element not found')

		this.video = video as HTMLVideoElement

		consola.debug(window)

		return video as HTMLVideoElement
	}

	play(): void {
		const videoIsActive = document.querySelector('.watch-video .active') !== null
		if (this.video?.paused) {
			if (videoIsActive) {
				this.video!.click()
			}
			else {
				this.video!.click()
				setTimeout(() => {
					this.video!.click()
				}
				, 1000)
			}
		}
	}

	pause(): void {
		!this.video?.paused && this.video!.click()
	}

	seek(_time: number): void {
		// not implemented
	}

	isCurrentPlayer(): boolean {
		return window.location.hostname.includes('netflix')
	}

	private getTimeFromEnd(time: number): number {
		return this.video!.duration - time
	}
}
