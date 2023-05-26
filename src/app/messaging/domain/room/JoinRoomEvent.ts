import type PeerIdentifier from '../peer/PeerIdentifier'
import type RoomEvent from './RoomEvent'

export default class JoinRoomEvent implements RoomEvent {
  constructor(public readonly roomId: string, public readonly peerId: PeerIdentifier) {}
}
