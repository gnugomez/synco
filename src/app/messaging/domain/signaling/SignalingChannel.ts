import type SignalingMessage from './SignalingMessage'

export default interface SignalingChannel {
  readonly channelName: string
  onMessage: (message: SignalingMessage) => void
  postMessage: (message: SignalingMessage) => void
}
