import Room from '../../domain/room/Room'
import type PeerFactory from '../peer/PeerFactory'
import type SignalingChannelFactory from '../signaling/SignalingChannelFactory'

export default class RoomFactory {
  constructor(
    private peerFactory: PeerFactory,
    private signalingChannelFactory: SignalingChannelFactory,
  ) {}

  createRoom(id: string) {
    return new Room(
      id,
      this.peerFactory,
      this.signalingChannelFactory.createSignalingChannel(id),
    )
  }
}
