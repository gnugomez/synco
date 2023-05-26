import type PeerFactory from '../../application/peer/PeerFactory'
import WebRTCPeerFactory from '../peer/WebRTCPeerFactory'
import RoomFactory from '../../application/room/RoomFactory'
import BroadcastSignalingChannelFactory from '../signaling/BroadcastSignalingChannelFactory'
import type SignalingChannelFactory from '../../application/signaling/SignalingChannelFactory'

export default class Context {
  static readonly signalingChannelFactory: SignalingChannelFactory
    = new BroadcastSignalingChannelFactory()

  static readonly peerFactory: PeerFactory = new WebRTCPeerFactory(this.signalingChannelFactory)
  static readonly roomFactory: RoomFactory = new RoomFactory(
    this.peerFactory,
    this.signalingChannelFactory,
  )
}
