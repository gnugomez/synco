import type Player from '../domain/Player'
import PlayerInitializationException from '../domain/PlayerInitializationException'

export default class VideoElementPlayer implements Player {
  private video?: HTMLVideoElement

  initialize(): HTMLVideoElement {
    const video = document.querySelector<HTMLVideoElement>('video')
    if (!video)
      throw new PlayerInitializationException('Video element not found')

    this.video = video as HTMLVideoElement
    return video as HTMLVideoElement
  }

  play(): void {
    this.video?.play()
  }

  pause(): void {
    this.video?.pause()
  }

  seek(time: number): void {
    this.video!.currentTime = time
  }

  isCurrentPlayer(): boolean {
    return false
  }
}
