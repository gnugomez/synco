import { BehaviorSubject, ReplaySubject } from 'rxjs'
import { consola } from 'consola'
import type PeerFactory from '../../application/peer/PeerFactory'
import type SignalingChannel from '../signaling/SignalingChannel'
import { SignalingActions } from '../signaling/SignalingActions'
import type PeerConnection from '../peer/PeerConnection'
import type SignalingMessage from '../signaling/SignalingMessage'
import PeerIdentifier from '../peer/PeerIdentifier'
import JoinRoomEvent from './JoinRoomEvent'
import type RoomEvent from './RoomEvent'
import InitPeerConnectionEvent from './InitPeerConnectionEvent'

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

    this.signalingChannel.onMessage = this.handleRoomEvent
  }

  private sendJoinRoomEvent = () => {
    this.signalingChannel.postMessage({
      action: SignalingActions.JOIN_ROOM,
      roomEvent: new JoinRoomEvent(this.id, this.peerId),
    })
  }

  private sendInitPeerConnectionEvent = (to: PeerIdentifier) => {
    this.signalingChannel.postMessage({
      action: SignalingActions.INIT_PEER_CONNECTION,
      roomEvent: new InitPeerConnectionEvent(to, this.peerId),
    })
  }

  private handleRoomEvent = (message: SignalingMessage) => {
    switch (message.action) {
      case SignalingActions.JOIN_ROOM:
        this.handleJoinRoomEvent(message!.roomEvent as JoinRoomEvent)
        break
      case SignalingActions.INIT_PEER_CONNECTION:
        this.handleInitPeerConnection(message!.roomEvent as InitPeerConnectionEvent)
        break
    }
  }

  private handleJoinRoomEvent = (joinRoomEvent: JoinRoomEvent) => {
    if (!this.peerConnections.value.some(pc => pc.identifier === joinRoomEvent.peerId)) {
      consola.info(`New peer joined the room: ${JSON.stringify(joinRoomEvent)}`)
      this.peerConnections.next([
        ...this.peerConnections.value,
        this.peerFactory.createPeerConnection(
          joinRoomEvent.peerId,
          true,
          `${this.peerId.id}-${joinRoomEvent.peerId.id}`,
        ),
      ])
      this.sendInitPeerConnectionEvent(joinRoomEvent.peerId)
    }
  }

  private handleInitPeerConnection = ({ to, from }: InitPeerConnectionEvent) => {
    if (to.id === this.peerId.id) {
      consola.info(`Handling init peer connection event: ${JSON.stringify({ to, from })}`)
      this.peerConnections.next([
        ...this.peerConnections.value,
        this.peerFactory.createPeerConnection(from, false, `${from.id}-${this.peerId.id}`),
      ])
    }
  }
}
