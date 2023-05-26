import consola from 'consola'
import { SignalingActions } from '../../domain/signaling/SignalingActions'
import type SignalingChannel from '../../domain/signaling/SignalingChannel'
import type PeerConnectionWebRTC from './WebRTCPeerConnection'

export default class NegotiationNeededHandler {
  static handle = async (
    peer: PeerConnectionWebRTC,
    peerConnection: RTCPeerConnection,
    signalingChannel: SignalingChannel,
  ) => {
    consola.info('Negotiation needed fired')

    try {
      peer.makingOffer.next(true)
      await peerConnection.setLocalDescription()
      consola.info('Description offer ready to be sent: ', peerConnection.localDescription)

      // Once the local description is ready, send it to the other peer through the signaling channel
      signalingChannel.postMessage({
        action: SignalingActions.SEND_DESCRIPTION,
        description: JSON.parse(JSON.stringify(peerConnection.localDescription)),
      })
    }
    catch (err) {
      consola.error('There was an error during the negotiation: ', err)
    }
    finally {
      peer.makingOffer.next(false)
    }
  }
}
