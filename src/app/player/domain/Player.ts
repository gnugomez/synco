export default interface Player {
	play(): void
	pause(): void
	seek(time: number): void
	initialize(): HTMLVideoElement
	isCurrentPlayer(): boolean
}
