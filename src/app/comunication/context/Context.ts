import type PeerFactory from '../peer/application/PeerFactory'
import WebRTCPeerFactory from '../peer/infrastructure/RTCPeerFactory'
import RoomFactory from '../room/application/RoomFactory'
import BroadcastSignalingChannelFactory from '../signaling/infrastructure/BroadcastSignalingChannelFactory'
import type SignalingChannelFactory from '../signaling/application/SignalingChannelFactory'

const signalingChannelFactory: SignalingChannelFactory
		= new BroadcastSignalingChannelFactory()

const peerFactory: PeerFactory = new WebRTCPeerFactory()

export const roomFactory: RoomFactory = new RoomFactory(
	peerFactory,
	signalingChannelFactory,
)
