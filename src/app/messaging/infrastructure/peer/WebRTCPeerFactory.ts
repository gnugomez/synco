import PeerConnectionWebRTC from './WebRTCPeerConnection'
import { PEER_TO_PEER_CONFIG } from './PeerConstants'
import BroadcastSignalingChannel from '../signaling/BroadcastSignalingChannel'
import type PeerConnection from '../../domain/peer/PeerConnection'
import type PeerFactory from '../../application/peer/PeerFactory'

export default class RTCPeerFactory implements PeerFactory {
    createPeerConnection(roomId: string): PeerConnection {
        return new PeerConnectionWebRTC(
            { id: roomId },
            new BroadcastSignalingChannel(roomId),
            PEER_TO_PEER_CONFIG
        )
    }
}
