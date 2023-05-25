import { consola } from 'consola'
import type SignalingChannel from '../../domain/signaling/SignalingChannel'
import type SignalingMessage from '../../domain/signaling/SignalingMessage'

export default class BroadcastSignalingChannel implements SignalingChannel {
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
        this.broadcastChannel.onmessage = (ev) => {
            consola.info(
                'BroadcastSignalingChannel with channelName: ' + channelName + ' received: ',
                ev.data
            )
            this.onMessage(ev.data)
        }
    }
}
