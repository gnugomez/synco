import { SignalingActions } from './SignalingActions'

export type SignalingMessage = {
  action: SignalingActions
  description?: RTCSessionDescriptionInit
  candidate?: RTCIceCandidateInit
}
