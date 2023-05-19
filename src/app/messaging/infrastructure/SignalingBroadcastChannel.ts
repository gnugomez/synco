import { consola } from 'consola'
import type { SignalingMessage } from '../domain/SignalingMessage'
import type SignalingChannel from '../domain/SignalingChannel'

export default class SignalingBroadcastChannel implements SignalingChannel {
  private broadcastChannel: BroadcastChannel

  readonly channelName: string
  onMessage: (message: SignalingMessage) => void = () => {}
  postMessage: (message: SignalingMessage) => void = (message) => {
    this.broadcastChannel.postMessage(message)
  }

  constructor(channelName: string) {
    consola.warn(
      'Be aware that you are using BroadcastChannel for signaling. This will only work if you are running the app in a single browser.'
    )
    this.channelName = channelName
    this.broadcastChannel = new BroadcastChannel(channelName)
    this.broadcastChannel.onmessage = (ev) => this.onMessage(ev.data)
  }
}
