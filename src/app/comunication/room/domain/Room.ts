import { BehaviorSubject, ReplaySubject, merge, switchMap } from 'rxjs'
import { consola } from 'consola'
import type PeerFactory from '../../peer/application/PeerFactory'
import type SignalingChannel from '../../signaling/domain/SignalingChannel'
import type PeerConnection from '../../peer/domain/PeerConnection'
import SignalingMessage from '../../signaling/domain/SignalingMessage'
import PeerIdentifier from '../../peer/domain/PeerIdentifier'
import InitPeerConnectionEvent from '../../peer/domain/InitPeerConnectionEvent'
import { PeerConnectionActions } from '../../peer/domain/PeerConnectionActions'
import type PeerConnectionEvent from '../../peer/domain/PeerConnectionEvent'
import PeerMessage from '../../peer/domain/PeerMessage'
import JoinRoomEvent from './JoinRoomEvent'
import type RoomEvent from './RoomEvent'
import { RoomActions } from './RoomActions'
import VideoManualJumpMessage from './VideoManualJumpMessage'
import VideoPlayingMessage from './VideoPlayingMessage'

export default class Room {
	readonly dataStream = new ReplaySubject<PeerMessage<RoomEvent>>()
	readonly peerConnections = new BehaviorSubject<PeerConnection[]>([])
	readonly peerId: PeerIdentifier

	constructor(
		public readonly id: string,
		public readonly peerFactory: PeerFactory,
		private signalingChannel: SignalingChannel,
	) {
		consola.debug(`Starting room with id: ${id}`)
		this.peerId = new PeerIdentifier(Math.random().toString(36).substring(7))

		this.sendJoinRoomEvent()

		this.signalingChannel.messages.subscribe((message: SignalingMessage<unknown>) => this.handleRoomEvent(message))

		this.peerConnections.pipe(
			switchMap(connections => merge(...connections.map(connection => connection.messages))),
		).subscribe(this.dataStream)
	}

	public broadcastMessage(message: PeerMessage<RoomEvent>) {
		this.peerConnections.value.forEach((connection) => {
			connection.sendMessage(message)
		})
	}

	public broadcastManualJump(time: number) {
		this.broadcastMessage(new PeerMessage<RoomEvent>(RoomActions.MANUAL_JUMP, new VideoManualJumpMessage(time)))
	}

	public broadcastPlaying(playing: boolean) {
		this.broadcastMessage(new PeerMessage<RoomEvent>(RoomActions.PLAYING, new VideoPlayingMessage(playing)))
	}

	public onManualJump(consumer: (time: number) => void) {
		this.dataStream.subscribe((message) => {
			if (message.action === RoomActions.MANUAL_JUMP) {
				const payload = message.payload as VideoManualJumpMessage
				consumer(payload.time)
			}
		})
	}

	public onPlaying(consumer: (playing: boolean) => void) {
		this.dataStream.subscribe((message) => {
			if (message.action === RoomActions.PLAYING) {
				const payload = message.payload as VideoPlayingMessage
				consumer(payload.isPlaying)
			}
		})
	}

	private sendRoomEvent(action: RoomActions, roomEvent: RoomEvent) {
		this.signalingChannel.postMessage(new SignalingMessage<RoomEvent>(action, roomEvent))
	}

	private sendPeerConnectionEvent(action: PeerConnectionActions, peerEvent: PeerConnectionEvent) {
		this.signalingChannel.postMessage(new SignalingMessage<RoomEvent>(action, peerEvent))
	}

	private sendJoinRoomEvent() {
		this.sendRoomEvent(RoomActions.JOIN_ROOM, new JoinRoomEvent(this.id, this.peerId))
	}

	private sendInitPeerConnectionEvent(to: PeerIdentifier) {
		this.sendPeerConnectionEvent(PeerConnectionActions.INIT_PEER_CONNECTION, new InitPeerConnectionEvent(this.peerId, to))
	}

	private handleRoomEvent(message: SignalingMessage<unknown>) {
		switch (message.action) {
			case RoomActions.JOIN_ROOM:
				this.handleJoinRoomEvent(message.payload as JoinRoomEvent)
				break
			case PeerConnectionActions.INIT_PEER_CONNECTION:
				this.handleInitPeerConnection(message.payload as InitPeerConnectionEvent)
				break
		}
	}

	private handleJoinRoomEvent(joinRoomEvent: JoinRoomEvent) {
		if (!this.peerConnections.value.some(pc => PeerIdentifier.areEqual(pc.targetIdentifier, joinRoomEvent.peerIdentifier))) {
			consola.debug(`New peer joined the room: ${JSON.stringify(joinRoomEvent)}`)

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

	private handleInitPeerConnection({ originatedPeerIdentifier, targetPeerIdentifier }: InitPeerConnectionEvent) {
		if (PeerIdentifier.areEqual(this.peerId, targetPeerIdentifier)) {
			consola.debug(`Handling init peer connection event: ${JSON.stringify({ targetPeerIdentifier, originatedPeerIdentifier })}`)

			this.peerConnections.next([
				...this.peerConnections.value,
				this.peerFactory.createPeerConnection(this.peerId, originatedPeerIdentifier, false, this.signalingChannel),
			])
		}
	}
}
