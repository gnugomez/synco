import type PeerConnectionEvent from './PeerConnectionEvent'
import type PeerIdentifier from './PeerIdentifier'

export default class PeerDescriptionEvent implements PeerConnectionEvent {
	constructor(
		readonly originatedPeerIdentifier: PeerIdentifier,
		readonly targetPeerIdentifier: PeerIdentifier,
		readonly description: RTCSessionDescription,
	) {}
}
