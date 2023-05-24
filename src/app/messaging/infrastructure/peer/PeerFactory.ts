import PeerConnectionWebRTC from './PeerConnectionWebRTC'
import { PEER_TO_PEER_CONFIG } from './PeerConstants'
import SignalingBroadcastChannel from '../signaling/SignalingBroadcastChannel'
import type PeerConnection from '../../domain/peer/PeerConnection'

export default class PeerFactory {
    static createPeerFor(roomId: string): PeerConnection<string> {
        return new PeerConnectionWebRTC(new SignalingBroadcastChannel(roomId), PEER_TO_PEER_CONFIG)
    }
}
