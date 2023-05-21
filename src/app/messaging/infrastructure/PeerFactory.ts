import PeerConnection from '../application/PeerConnection'
import { PEER_TO_PEER_CONFIG } from './PeerConstants'
import SignalingBroadcastChannel from './SignalingBroadcastChannel'

export default class PeerFactory {
  static createPeerFor(roomId: string): PeerConnection {
    return new PeerConnection(new SignalingBroadcastChannel(roomId), PEER_TO_PEER_CONFIG)
  }
}
