import type PeerFactory from '../peer/application/PeerFactory'
import WebRTCPeerFactory from '../peer/infrastructure/RTCPeerFactory'
import RoomFactory from '../room/application/RoomFactory'
import type SignalingChannelFactory from '../signaling/application/SignalingChannelFactory'
import FirebaseSignalingChannelFactory from '../signaling/infrastructure/FirebaseSignalingChannelFactory'

const signalingChannelFactory: SignalingChannelFactory
		= new FirebaseSignalingChannelFactory()

const peerFactory: PeerFactory = new WebRTCPeerFactory()

export const roomFactory: RoomFactory = new RoomFactory(
	peerFactory,
	signalingChannelFactory,
)
