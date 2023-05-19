import { consola } from 'consola'
import { ref, type Ref } from 'vue'
import type SignalingChannel from '../domain/SignalingChannel'
import NegotiationNeededHandler from './NegotiationNeededHandler'
import DescriptionReceivedHandler from './DescriptionReceivedHandler'
import CandidateReceivedHandler from './CandidateReceivedHandler'
import { SignalingActions } from '../domain/SignalingActions'
import type { SignalingMessage } from '../domain/SignalingMessage'

export default class Peer {
  private peerConnection: RTCPeerConnection | null = null
  dataChannel: RTCDataChannel | null = null

  makingOffer = ref(false)
  connectionState: Ref<RTCPeerConnectionState | null> = ref(null)
  localDescription: Ref<RTCSessionDescription | null> = ref(null)
  remoteDescription: Ref<RTCSessionDescription | null> = ref(null)
  signalingState: Ref<RTCSignalingState | null> = ref(null)

  constructor(private signalingChannel: SignalingChannel, private config: RTCConfiguration) {}

  init() {
    consola.info('Initializing peer to peer connection')

    this.peerConnection = new RTCPeerConnection(this.config)
    this.dataChannel = this.peerConnection.createDataChannel('sync-video-rtc')

    this.peerConnection.onconnectionstatechange = this.onConnectionStateChangeHandler
    this.peerConnection.onsignalingstatechange = this.onSignalingStateChangeHandler

    this.peerConnection.onnegotiationneeded = () =>
      NegotiationNeededHandler.handle(this, this.peerConnection!, this.signalingChannel)

    this.peerConnection.onicecandidate = this.onIceCandidateHandler

    this.connectionState.value = this.peerConnection.connectionState
    this.signalingChannel.onMessage = this.onSignalingEvent
    this.peerConnection.ondatachannel = this.onDataChannelHandler
  }

  private onDataChannelHandler = (ev: RTCDataChannelEvent) => {
    consola.info('Data channel received: ', ev)
    ev.channel.onmessage = (ev) => {
      consola.info('Data channel message received: ', ev)
    }
  }

  private onConnectionStateChangeHandler = () => {
    this.connectionState.value = this.peerConnection!.connectionState
  }

  private onSignalingStateChangeHandler = () => {
    this.signalingState.value = this.peerConnection!.signalingState
  }

  private onIceCandidateHandler = ({ candidate }: RTCPeerConnectionIceEvent) => {
    consola.info('Ice candidate received: ', candidate)
    this.signalingChannel.postMessage({
      action: SignalingActions.SEND_CANDIDATE,
      candidate: JSON.parse(JSON.stringify(candidate))
    })
  }

  private onSignalingEvent: (message: SignalingMessage) => void = async ({
    action,
    candidate,
    description
  }) => {
    consola.info('Signaling event received: ', action)

    try {
      switch (action) {
        case SignalingActions.SEND_DESCRIPTION:
          if (description)
            DescriptionReceivedHandler.handle(
              this,
              description,
              this.peerConnection!,
              this.signalingChannel
            )
          break
        case SignalingActions.SEND_CANDIDATE:
          if (candidate) CandidateReceivedHandler.handle(candidate, this.peerConnection!)
          break
      }
    } catch (error) {
      consola.error('There was an error during the negotiation: ', error)
    }
  }

  close = () => {
    if (this.peerConnection) {
      this.peerConnection.close()
    }
  }
}
