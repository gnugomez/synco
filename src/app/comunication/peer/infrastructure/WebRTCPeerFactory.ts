import type PeerConnection from '../domain/PeerConnection'
import type PeerFactory from '../application/PeerFactory'
import type PeerIdentifier from '../domain/PeerIdentifier'
import type SignalingChannel from '../../signaling/domain/SignalingChannel'
import { PEER_TO_PEER_CONFIG } from './PeerConstants'
import PeerConnectionWebRTC from './WebRTCPeerConnection'

export default class RTCPeerFactory implements PeerFactory {
	createPeerConnection(
		selfPeerId: PeerIdentifier,
		targetPeerId: PeerIdentifier,
		polite: boolean,
		signalingChannel: SignalingChannel,
	): PeerConnection {
		return new PeerConnectionWebRTC(
			selfPeerId,
			targetPeerId,
			polite,
			signalingChannel,
			PEER_TO_PEER_CONFIG,
		)
	}
}
