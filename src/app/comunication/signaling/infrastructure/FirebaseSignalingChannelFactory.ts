import type SignalingChannelFactory from '../application/SignalingChannelFactory'
import type SignalingChannel from '../domain/SignalingChannel'
import FirebaseSignalingChannel from './FirebaseSignalingChannel'

export default class FirebaseSignalingChannelFactory implements SignalingChannelFactory {
	createSignalingChannel(channelName: string): SignalingChannel {
		return new FirebaseSignalingChannel(channelName)
	}
}
