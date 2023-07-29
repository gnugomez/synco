import consola from 'consola'
import type CandidateEvent from '../domain/CandidateEvent'
import type PeerConnectionWebRTC from './PeerConnectionWebRTC'

export async function loadIceCandidate({ candidate }: CandidateEvent, peer: PeerConnectionWebRTC) {
	try {
		await peer.peerConnection.addIceCandidate(candidate)
		consola.debug('Candidate added successfully: ', candidate)
	}
	catch (error) {
		if (!peer.ignoreOffer)
			consola.error('Error adding candidate: ', error)
	}
}
