import type RoomEvent from './RoomEvent'

export default class VideoManualJumpMessage implements RoomEvent {
	constructor(
		readonly isPlaying: boolean,
		readonly time: number,
	) { }
}
