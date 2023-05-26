import type { Observable } from 'rxjs'
import type { SignalingState } from '../signaling/SignalingState'
import type { PeerConnectionState } from './PeerConnectionState'
import type PeerIdentifier from './PeerIdentifier'

export default interface PeerConnection {
  readonly identifier: PeerIdentifier
  readonly signalingState: Observable<SignalingState>
  readonly connectionState: Observable<PeerConnectionState>
  readonly polite: boolean
}
