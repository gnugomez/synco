export default class PeerMessage<T> {
	constructor(
		readonly action: string,
		readonly payload: T,
	) {}
}
