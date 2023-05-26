import type PeerIdentifier from '../../domain/peer/PeerIdentifier'
import type PeerConnection from '../../domain/peer/PeerConnection'

export default interface PeerFactory {
  createPeerConnection(
    peerId: PeerIdentifier,
    polite: boolean,
    connectionName: string,
  ): PeerConnection
}
