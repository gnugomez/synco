import type RoomEvent from './RoomEvent'

export default class VideoManualJumpMessage implements RoomEvent {
	constructor(
		public readonly time: number,
	) { }
}
