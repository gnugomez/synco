import type PeerIdentifier from '../peer/PeerIdentifier'
import type RoomEvent from './RoomEvent'

export default class InitPeerConnectionEvent implements RoomEvent {
  constructor(public readonly to: PeerIdentifier, public readonly from: PeerIdentifier) {}
}
