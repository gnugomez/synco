import type RoomEvent from '../room/RoomEvent'
import { SignalingActions } from './SignalingActions'

export default interface SignalingMessage {
    action: SignalingActions
    description?: RTCSessionDescriptionInit
    candidate?: RTCIceCandidateInit
    roomEvent?: RoomEvent
}
