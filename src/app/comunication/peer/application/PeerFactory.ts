import type PeerIdentifier from '../domain/PeerIdentifier'
import type PeerConnection from '../domain/PeerConnection'
import type SignalingChannel from '../../signaling/domain/SignalingChannel'

export default interface PeerFactory {
	createPeerConnection(
		selfPeerId: PeerIdentifier,
		targetPeerId: PeerIdentifier,
		polite: boolean,
		signalingChannel: SignalingChannel,
	): PeerConnection
}
