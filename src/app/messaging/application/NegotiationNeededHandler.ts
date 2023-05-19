import consola from 'consola'
import { SignalingActions } from '../domain/SignalingActions'
import type Peer from './Peer'
import type SignalingChannel from '../domain/SignalingChannel'

export default class NegotiationNeededHandler {
  static handle = async (
    peer: Peer,
    peerConnection: RTCPeerConnection,
    signalingChannel: SignalingChannel
  ) => {
    consola.info('Negotiation needed fired')

    try {
      peer.makingOffer.value = true
      await peerConnection.setLocalDescription()
      consola.info('Description offer ready to be sent: ', peerConnection.localDescription)
      peer.localDescription.value = peerConnection.localDescription

      // Once the local description is ready, send it to the other peer through the signaling channel
      signalingChannel.postMessage({
        action: SignalingActions.SEND_DESCRIPTION,
        description: JSON.parse(JSON.stringify(peerConnection.localDescription))
      })
    } catch (err) {
      consola.error('There was an error during the negotiation: ', err)
    } finally {
      peer.makingOffer.value = false
    }
  }
}
