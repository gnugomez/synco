import PeerConnectionWebRTC from './PeerConnectionWebRTC'
import { PEER_TO_PEER_CONFIG } from './PeerConstants'
import SignalingBroadcastChannel from '../signaling/SignalingBroadcastChannel'

export default class PeerFactory {
  static createPeerFor(roomId: string): PeerConnectionWebRTC {
    return new PeerConnectionWebRTC(new SignalingBroadcastChannel(roomId), PEER_TO_PEER_CONFIG)
  }
}
