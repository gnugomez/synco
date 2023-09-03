import { consola } from 'consola'
import type Player from '../domain/Player'
import PlayerInitializationException from '../domain/PlayerInitializationException'

export default class NetflixPlayer implements Player {
	private videoPlayerAPI?: any
	private video?: HTMLVideoElement

	initialize(): HTMLVideoElement {
		consola.debug('NetflixPlayer is being initialized')
		const video = document.querySelector<HTMLVideoElement>('video')
		if (!video)
			throw new PlayerInitializationException('Video element not found')

		this.video = video as HTMLVideoElement

		consola.debug(window)

		const videoPlayers = (window as any).netflix.appContext.state.playerApp.getAPI().videoPlayer
		this.videoPlayerAPI = videoPlayers.getVideoPlayerBySessionId(videoPlayers.getAllPlayerSessionIds()[0])

		return video as HTMLVideoElement
	}

	play(): void {
		this.videoPlayerAPI?.play()
	}

	pause(): void {
		this.videoPlayerAPI?.pause()
	}

	seek(time: number): void {
		this.videoPlayerAPI?.seek(this.getTimeFromEnd(time))
	}

	isCurrentPlayer(): boolean {
		return window.location.hostname.includes('netflix')
	}

	private getTimeFromEnd(time: number): number {
		return this.video!.duration - time
	}
}
