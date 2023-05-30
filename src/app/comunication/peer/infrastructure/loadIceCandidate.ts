import consola from 'consola'
import type CandidateEvent from '../domain/CandidateEvent'

export async function loadIceCandidate({ candidate }: CandidateEvent, peerConnection: RTCPeerConnection) {
	try {
		await peerConnection.addIceCandidate(candidate)
		consola.debug('Candidate added successfully: ', candidate)
	}
	catch (error) {
		consola.error('There was an error adding the candidate: ', error)
	}
}
