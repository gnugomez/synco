import type PeerConnectionEvent from './PeerConnectionEvent'
import type PeerIdentifier from './PeerIdentifier'

export default class CandidateEvent implements PeerConnectionEvent {
	constructor(
		readonly originatedPeerIdentifier: PeerIdentifier,
		readonly targetPeerIdentifier: PeerIdentifier,
		readonly candidate: RTCIceCandidate,
	) { }
}
