import type PeerFactory from '../peer/application/PeerFactory'
import WebRTCPeerFactory from '../peer/infrastructure/WebRTCPeerFactory'
import RoomFactory from '../room/application/RoomFactory'
import BroadcastSignalingChannelFactory from '../signaling/infrastructure/BroadcastSignalingChannelFactory'
import type SignalingChannelFactory from '../signaling/application/SignalingChannelFactory'

export default class Context {
	static readonly signalingChannelFactory: SignalingChannelFactory
		= new BroadcastSignalingChannelFactory()

	static readonly peerFactory: PeerFactory = new WebRTCPeerFactory()
	static readonly roomFactory: RoomFactory = new RoomFactory(
		this.peerFactory,
		this.signalingChannelFactory,
	)
}
