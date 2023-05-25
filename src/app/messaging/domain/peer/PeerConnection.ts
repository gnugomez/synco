import type { Observable } from 'rxjs'
import type { SignalingState } from '../signaling/SignalingState'
import type { PeerConnectionState } from './PeerConnectionState'
import type ConnectionIdentifier from './ConnectionIdentifier'

export default interface PeerConnection {
    readonly identifier: ConnectionIdentifier
    readonly signalingState: Observable<SignalingState>
    readonly connectionState: Observable<PeerConnectionState>
}
