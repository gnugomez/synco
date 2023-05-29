import type PeerIdentifier from './PeerIdentifier'

export default interface PeerConnectionEvent {
	readonly originatedPeerIdentifier: PeerIdentifier
	readonly targetPeerIdentifier: PeerIdentifier
}
