import consola from 'consola'
import { SignalingActions } from '../../signaling/domain/SignalingActions'
import PeerDescriptionEvent from '../domain/PeerDescriptionEvent'
import type PeerConnectionWebRTC from './WebRTCPeerConnection'

export default class NegotiationNeededHandler {
	static handle = async (
		{ peerConnection, sendSignalingEvent, makingOffer, selfIdentifier, targetIdentifier }: PeerConnectionWebRTC,
	) => {
		consola.info('Negotiation needed fired')

		try {
			makingOffer.next(true)
			await peerConnection.setLocalDescription()
			consola.info('Description offer ready to be sent: ', peerConnection.localDescription)

			// Once the local description is ready, send it to the other peer through the signaling channel
			peerConnection.localDescription && sendSignalingEvent(SignalingActions.DESCRIPTION,
				new PeerDescriptionEvent(selfIdentifier, targetIdentifier, JSON.parse(JSON.stringify(peerConnection.localDescription))))
		}
		catch (err) {
			consola.error('There was an error during the negotiation: ', err)
		}
		finally {
			makingOffer.next(false)
		}
	}
}
