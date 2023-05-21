import consola from 'consola'
import type PeerConnection from './PeerConnection'
import { SignalingActions } from '../domain/SignalingActions'
import type SignalingChannel from '../domain/SignalingChannel'

export default class DescriptionReceivedHandler {
  static handle = async (
    peer: PeerConnection,
    description: RTCSessionDescriptionInit,
    peerConnection: RTCPeerConnection,
    signalingChannel: SignalingChannel
  ) => {
    const isCollisioningOffer =
      description.type === 'offer' &&
      (peer.makingOffer.value || peer.signalingState.value !== 'stable')

    if (isCollisioningOffer) {
      consola.warn(
        `Collision detected. making offer: ${peer.makingOffer.value}, signaling state: ${peer.signalingState.value}`
      )
    } else {
      consola.success('Provided description is not collisioning')
    }

    await peerConnection.setRemoteDescription(description)
    peer.remoteDescription.value = peerConnection.remoteDescription

    if ('offer' === description.type) {
      consola.info('Creating answer')
      await peerConnection.setLocalDescription()
      consola.info('Description answer ready to be sent: ', peerConnection.localDescription)
      peer.localDescription.value = peerConnection.localDescription

      signalingChannel.postMessage({
        action: SignalingActions.SEND_DESCRIPTION,
        description: JSON.parse(JSON.stringify(peerConnection.localDescription))
      })
    }
  }
}
