export default class PeerIdentifier {
	constructor(readonly id: string) {}

	static areEqual = (peerIdentifier1: PeerIdentifier, peerIdentifier2: PeerIdentifier) => {
		return peerIdentifier1.id === peerIdentifier2.id
	}
}
