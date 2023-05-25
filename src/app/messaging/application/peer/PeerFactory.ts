import type PeerConnection from '../../domain/peer/PeerConnection'

export default interface PeerFactory {
    createPeerConnection(roomId: string): PeerConnection
}
