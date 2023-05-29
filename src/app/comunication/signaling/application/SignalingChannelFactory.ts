import type SignalingChannel from '../domain/SignalingChannel'

export default interface SignalingChannelFactory {
	createSignalingChannel(channelName: string): SignalingChannel
}
