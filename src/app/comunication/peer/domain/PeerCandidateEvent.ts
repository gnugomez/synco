import type PeerConnectionEvent from './PeerConnectionEvent'
import type PeerIdentifier from './PeerIdentifier'

export default class PeerCandidateEvent implements PeerConnectionEvent {
	constructor(
		readonly originatedPeerIdentifier: PeerIdentifier,
		readonly targetPeerIdentifier: PeerIdentifier,
		readonly candidate: RTCIceCandidate,
	) {}
}
