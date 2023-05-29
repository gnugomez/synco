import type { SignalingActions } from './SignalingActions'

export default class SignalingMessage<T = unknown> {
	constructor(
		readonly action: SignalingActions,
		readonly payload: T,
		readonly description?: RTCSessionDescriptionInit,
		readonly candidate?: RTCIceCandidateInit,
	) {}
}
