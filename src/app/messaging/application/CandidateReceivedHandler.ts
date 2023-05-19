import consola from 'consola'

export default class CandidateReceivedHandler {
  static handle = async (candidate: RTCIceCandidateInit, peerConnection: RTCPeerConnection) => {
    try {
      await peerConnection.addIceCandidate(candidate)
      consola.info('Candidate added successfully: ', candidate)
    } catch (error) {
      consola.error('There was an error adding the candidate: ', error)
    }
  }
}
