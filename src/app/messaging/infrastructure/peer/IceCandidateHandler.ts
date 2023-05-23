import consola from 'consola'
import type SignalingChannel from '../../domain/signaling/SignalingChannel'
import { SignalingActions } from '../../domain/signaling/SignalingActions'

export default class CandidateReceivedHandler {
  static received = async (candidate: RTCIceCandidateInit, peerConnection: RTCPeerConnection) => {
    try {
      await peerConnection.addIceCandidate(candidate)
      consola.info('Candidate added successfully: ', candidate)
    } catch (error) {
      consola.error('There was an error adding the candidate: ', error)
    }
  }

  static ready = (candidate: RTCIceCandidate, signalingChannel: SignalingChannel) => {
    consola.info('Ice candidate ready to be sent: ', candidate)
    signalingChannel.postMessage({
      action: SignalingActions.SEND_CANDIDATE,
      candidate: JSON.parse(JSON.stringify(candidate))
    })
  }
}
