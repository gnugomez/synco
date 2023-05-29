import type PeerIdentifier from '../../peer/domain/PeerIdentifier'
import type RoomEvent from './RoomEvent'

export default class JoinRoomEvent implements RoomEvent {
	constructor(public readonly roomId: string, public readonly peerIdentifier: PeerIdentifier) {}
}
