import Room from '../domain/Room'
import type PeerFactory from '../../peer/application/PeerFactory'
import type SignalingChannelFactory from '../../signaling/application/SignalingChannelFactory'

export default class RoomFactory {
	constructor(
		private peerFactory: PeerFactory,
		private signalingChannelFactory: SignalingChannelFactory,
	) {}

	createRoom(id: string) {
		return new Room(
			id,
			this.peerFactory,
			this.signalingChannelFactory.createSignalingChannel(id),
		)
	}
}
