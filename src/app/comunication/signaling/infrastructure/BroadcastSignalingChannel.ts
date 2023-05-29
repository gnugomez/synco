import { consola } from 'consola'
import { Subject, fromEvent, map, tap } from 'rxjs'
import type SignalingChannel from '../domain/SignalingChannel'
import type SignalingMessage from '../domain/SignalingMessage'

export default class BroadcastSignalingChannel implements SignalingChannel {
	private broadcastChannel: BroadcastChannel

	readonly channelName: string
	messages = new Subject<SignalingMessage>()
	postMessage: (message: SignalingMessage) => void = (message) => {
		this.broadcastChannel.postMessage(message)
	}

	constructor(channelName: string) {
		this.channelName = channelName
		this.broadcastChannel = new BroadcastChannel(channelName)

		fromEvent(this.broadcastChannel, 'message')
			.pipe(
				map(event => (event as MessageEvent).data),
				tap(data => consola.info(`BroadcastSignalingChannel with channelName: ${channelName} received: `, data)))
			.subscribe(this.messages)
	}
}
