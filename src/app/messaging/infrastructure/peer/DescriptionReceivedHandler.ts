import consola from 'consola'
import { SignalingActions } from '../../domain/signaling/SignalingActions'
import type SignalingChannel from '../../domain/signaling/SignalingChannel'
import type PeerConnectionWebRTC from './WebRTCPeerConnection'

export default class DescriptionReceivedHandler {
  static handle = async (
    peer: PeerConnectionWebRTC,
    description: RTCSessionDescriptionInit,
    peerConnection: RTCPeerConnection,
    signalingChannel: SignalingChannel,
  ) => {
    const isCollisioningOffer
      = description.type === 'offer'
      && (peer.makingOffer.value || peer._signalingState.value !== 'stable')

    peer.ignoreOffer = !peer.polite && isCollisioningOffer

    if (isCollisioningOffer) {
      consola.warn(
        `Collision detected. making offer: ${peer.makingOffer.value}, signaling state: ${peer._signalingState.value}`,
      )
    }
    else {
      consola.success('Provided description is not collisioning')
    }

    if (peer.ignoreOffer)
      return

    await peerConnection.setRemoteDescription(description)

    if (description.type === 'offer') {
      consola.info('Creating answer')
      await peerConnection.setLocalDescription()
      consola.info('Description answer ready to be sent: ', peerConnection.localDescription)

      signalingChannel.postMessage({
        action: SignalingActions.SEND_DESCRIPTION,
        description: JSON.parse(JSON.stringify(peerConnection.localDescription)),
      })
    }
  }
}
