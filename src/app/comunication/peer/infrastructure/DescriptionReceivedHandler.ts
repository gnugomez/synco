import consola from 'consola'
import { SignalingActions } from '../../signaling/domain/SignalingActions'
import PeerDescriptionEvent from '../domain/PeerDescriptionEvent'
import type PeerConnectionWebRTC from './WebRTCPeerConnection'

export default class DescriptionReceivedHandler {
	static handle = async (
		peer: PeerConnectionWebRTC,
		peerDescriptionEvent: PeerDescriptionEvent,
		peerConnection: RTCPeerConnection,
	) => {
		const { description } = peerDescriptionEvent

		if (description.type === 'offer') {
			const isCollisioningOffer
      = peer.makingOffer.value || peer._signalingState.value !== 'stable'

			peer.ignoreOffer = !peer.polite && isCollisioningOffer

			if (peer.ignoreOffer)
				return
		}

		try {
			await peerConnection.setRemoteDescription(description)
		}
		catch (error) {
			consola.error('Error setting remote description: ', error)
		}

		if (description.type === 'offer') {
			consola.info('Creating answer')
			await peerConnection.setLocalDescription()
			consola.info('Description answer ready to be sent: ', peerConnection.localDescription)

			peerConnection.localDescription && peer.sendSignalingEvent(SignalingActions.DESCRIPTION,
				new PeerDescriptionEvent(peer.selfIdentifier, peer.targetIdentifier, JSON.parse(JSON.stringify(peerConnection.localDescription))))
		}
	}
}
