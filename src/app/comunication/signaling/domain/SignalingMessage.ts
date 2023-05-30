export default class SignalingMessage<T = unknown> {
	constructor(
		readonly action: String,
		readonly payload: T,
	) {}
}
