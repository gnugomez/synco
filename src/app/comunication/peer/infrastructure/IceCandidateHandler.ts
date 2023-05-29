import consola from 'consola'
import { SignalingActions } from '../../signaling/domain/SignalingActions'
import PeerCandidateEvent from '../domain/PeerCandidateEvent'
import type WebRTCPeerConnection from './WebRTCPeerConnection'

export default class CandidateReceivedHandler {
	static received = async ({ candidate }: PeerCandidateEvent, peerConnection: RTCPeerConnection) => {
		try {
			await peerConnection.addIceCandidate(candidate)
			consola.info('Candidate added successfully: ', candidate)
		}
		catch (error) {
			consola.error('There was an error adding the candidate: ', error)
		}
	}

	static ready = (candidate: RTCIceCandidate, { sendSignalingEvent, selfIdentifier, targetIdentifier }: WebRTCPeerConnection) => {
		consola.info('Ice candidate ready to be sent: ', candidate)
		sendSignalingEvent(SignalingActions.CANDIDATE,
			new PeerCandidateEvent(selfIdentifier, targetIdentifier, JSON.parse(JSON.stringify(candidate))))
	}
}
