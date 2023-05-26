import type SignalingChannelFactory from '../../application/signaling/SignalingChannelFactory'
import type SignalingChannel from '../../domain/signaling/SignalingChannel'
import BroadcastSignalingChannel from './BroadcastSignalingChannel'

export default class BroadcastSignalingChannelFactory implements SignalingChannelFactory {
  createSignalingChannel(channelName: string): SignalingChannel {
    return new BroadcastSignalingChannel(channelName)
  }
}
