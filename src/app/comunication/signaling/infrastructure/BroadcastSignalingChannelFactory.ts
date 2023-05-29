import type SignalingChannelFactory from '../application/SignalingChannelFactory'
import type SignalingChannel from '../domain/SignalingChannel'
import BroadcastSignalingChannel from './BroadcastSignalingChannel'

export default class BroadcastSignalingChannelFactory implements SignalingChannelFactory {
	createSignalingChannel(channelName: string): SignalingChannel {
		return new BroadcastSignalingChannel(channelName)
	}
}
