import { BehaviorSubject, ReplaySubject } from 'rxjs'
import { consola } from 'consola'
import type PeerFactory from '../../peer/application/PeerFactory'
import type SignalingChannel from '../../signaling/domain/SignalingChannel'
import { SignalingActions } from '../../signaling/domain/SignalingActions'
import type PeerConnection from '../../peer/domain/PeerConnection'
import type SignalingMessage from '../../signaling/domain/SignalingMessage'
import PeerIdentifier from '../../peer/domain/PeerIdentifier'
import InitPeerConnectionEvent from '../../peer/domain/InitPeerConnectionEvent'
import JoinRoomEvent from './JoinRoomEvent'
import type RoomEvent from './RoomEvent'

export default class Room {
	readonly dataStream = new ReplaySubject<RoomEvent>()
	readonly peerConnections = new BehaviorSubject<PeerConnection[]>([])
	readonly peerId: PeerIdentifier

	constructor(
		public readonly id: string,
		public readonly peerFactory: PeerFactory,
		private signalingChannel: SignalingChannel,
	) {
		consola.info(`Starting room with id: ${id}`)
		this.peerId = new PeerIdentifier(Math.random().toString(36).substring(7))

		this.sendJoinRoomEvent()

		this.signalingChannel.messages.subscribe(this.handleRoomEvent)
	}

	private sendJoinRoomEvent = () => {
		this.signalingChannel.postMessage({
			action: SignalingActions.JOIN_ROOM,
			payload: new JoinRoomEvent(this.id, this.peerId),
		})
	}

	private sendInitPeerConnectionEvent = (to: PeerIdentifier) => {
		this.signalingChannel.postMessage({
			action: SignalingActions.INIT_PEER_CONNECTION,
			payload: new InitPeerConnectionEvent(this.peerId, to),
		})
	}

	private handleRoomEvent = (message: SignalingMessage<unknown>) => {
		switch (message.action) {
			case SignalingActions.JOIN_ROOM:
				this.handleJoinRoomEvent(message.payload as JoinRoomEvent)
				break
			case SignalingActions.INIT_PEER_CONNECTION:
				this.handleInitPeerConnection(message.payload as InitPeerConnectionEvent)
				break
		}
	}

	private handleJoinRoomEvent = (joinRoomEvent: JoinRoomEvent) => {
		if (!this.peerConnections.value.some(pc => PeerIdentifier.areEqual(pc.targetIdentifier, joinRoomEvent.peerIdentifier))) {
			consola.info(`New peer joined the room: ${JSON.stringify(joinRoomEvent)}`)

			this.peerConnections.next([
				...this.peerConnections.value,
				this.peerFactory.createPeerConnection(
					this.peerId,
					joinRoomEvent.peerIdentifier,
					true,
					this.signalingChannel,
				),
			])

			this.sendInitPeerConnectionEvent(joinRoomEvent.peerIdentifier)
		}
	}

	private handleInitPeerConnection = ({ originatedPeerIdentifier, targetPeerIdentifier }: InitPeerConnectionEvent) => {
		if (PeerIdentifier.areEqual(this.peerId, targetPeerIdentifier)) {
			consola.info(`Handling init peer connection event: ${JSON.stringify({ targetPeerIdentifier, originatedPeerIdentifier })}`)

			this.peerConnections.next([
				...this.peerConnections.value,
				this.peerFactory.createPeerConnection(this.peerId, originatedPeerIdentifier, false, this.signalingChannel),
			])
		}
	}
}
