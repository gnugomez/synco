import type PeerConnection from '../../domain/peer/PeerConnection'
import type PeerFactory from '../../application/peer/PeerFactory'
import type SignalingChannelFactory from '../../application/signaling/SignalingChannelFactory'
import type PeerIdentifier from '../../domain/peer/PeerIdentifier'
import { PEER_TO_PEER_CONFIG } from './PeerConstants'
import PeerConnectionWebRTC from './WebRTCPeerConnection'

export default class RTCPeerFactory implements PeerFactory {
  constructor(private signalingChannelFactory: SignalingChannelFactory) {}

  createPeerConnection(
    peerId: PeerIdentifier,
    polite: boolean,
    connectionName: string,
  ): PeerConnection {
    return new PeerConnectionWebRTC(
      peerId,
      polite,
      this.signalingChannelFactory.createSignalingChannel(connectionName),
      PEER_TO_PEER_CONFIG,
    )
  }
}
