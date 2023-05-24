import type { Observable } from 'rxjs'
import type { SignalingState } from '../signaling/SignalingState'
import type { PeerConnectionState } from './PeerConnectionState'

export default interface PeerConnection<T> {
    readonly signalingState: Observable<SignalingState>
    readonly connectionState: Observable<PeerConnectionState>
}
