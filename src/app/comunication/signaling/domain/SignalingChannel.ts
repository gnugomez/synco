import type { Observable } from 'rxjs'
import type SignalingMessage from './SignalingMessage'

export default interface SignalingChannel {
	readonly channelName: string
	messages: Observable<SignalingMessage>
	postMessage: (message: SignalingMessage) => void
}
