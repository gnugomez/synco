import { BehaviorSubject, ReplaySubject } from 'rxjs'
import type RoomEvent from './RoomEvent'
import type ConnectionIdentifier from '../peer/ConnectionIdentifier'
import type PeerFactory from '../../application/peer/PeerFactory'
import type SignalingChannel from '../signaling/SignalingChannel'
import { consola } from 'consola'
import { SignalingActions } from '../signaling/SignalingActions'
import JoinRoomEvent from './JoinRoomEvent'
import type PeerConnection from '../peer/PeerConnection'
import type SignalingMessage from '../signaling/SignalingMessage'

export default class Room {
    readonly dataStream = new ReplaySubject<RoomEvent>()
    readonly peerConnections = new BehaviorSubject<PeerConnection[]>([])
    readonly peerId: string

    constructor(
        public readonly id: string,
        public readonly peerFactory: PeerFactory,
        private signalingChannel: SignalingChannel
    ) {
        consola.info('Starting room with id: ' + id)
        this.peerId = Math.random().toString(36).substring(7)

        this.sendJoinRoomEvent()

        this.signalingChannel.onMessage = this.handleRoomEvent
    }

    private sendJoinRoomEvent = () => {
        this.signalingChannel.postMessage({
            action: SignalingActions.JOIN_ROOM,
            roomEvent: new JoinRoomEvent(this.id, this.peerId)
        })
    }

    private handleRoomEvent = (message: SignalingMessage) => {
        switch (message.action) {
            case SignalingActions.JOIN_ROOM:
                this.handleJoinRoomEvent(message!.roomEvent as JoinRoomEvent)
                break
        }
    }

    private handleJoinRoomEvent = (joinRoomEvent: JoinRoomEvent) => {
        consola.success('Received join room event: ', joinRoomEvent)
    }
}
