import Peer from '../application/Peer'
import { PEER_TO_PEER_CONFIG } from './PeerConstants'
import SignalingBroadcastChannel from './SignalingBroadcastChannel'

export default class PeerFactory {
  static createPeerFor(roomId: string): Peer {
    return new Peer(new SignalingBroadcastChannel(roomId), PEER_TO_PEER_CONFIG)
  }
}
