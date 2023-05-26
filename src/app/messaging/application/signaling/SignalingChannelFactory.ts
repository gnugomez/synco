import type SignalingChannel from '../../domain/signaling/SignalingChannel'

export default interface SignalingChannelFactory {
  createSignalingChannel(channelName: string): SignalingChannel
}
