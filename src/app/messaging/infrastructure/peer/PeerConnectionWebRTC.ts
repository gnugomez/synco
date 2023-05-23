import { consola } from 'consola'
import { ref, watch, type Ref } from 'vue'
import type SignalingChannel from '../../domain/signaling/SignalingChannel'
import NegotiationNeededHandler from './NegotiationNeededHandler'
import DescriptionReceivedHandler from './DescriptionReceivedHandler'
import IceCandidateHandler from './IceCandidateHandler'
import { SignalingActions } from '../../domain/signaling/SignalingActions'
import type { SignalingMessage } from '../../domain/signaling/SignalingMessage'

export default class PeerConnectionWebRTC {
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

    /* Setting up a callback function to handle the `onnegotiationneeded` event when a new negotiation is needed */
    this.peerConnection.onnegotiationneeded = () =>
      NegotiationNeededHandler.handle(this, this.peerConnection!, this.signalingChannel)

    /* Setting up a callback function to handle the `onicecandidate` event when a new ICE candidate is available */
    this.peerConnection.onicecandidate = ({ candidate }) =>
      candidate && IceCandidateHandler.ready(candidate, this.signalingChannel)

    /* Setting up reactive variables */
    this.connectionState.value = this.peerConnection.connectionState
    this.peerConnection.onconnectionstatechange = this.onConnectionStateChangeHandler
    this.peerConnection.onsignalingstatechange = this.onSignalingStateChangeHandler
    this.peerConnection.ondatachannel = this.onDataChannelHandler

    /* Setting up a callback function to be executed when a signaling message is received through the `signalingChannel` */
    this.signalingChannel.onMessage = this.onSignalingEvent

    watch(this.connectionState, (connectionState) => {
      if (connectionState === 'connected') consola.success('Connected to peer')
    })
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
          if (candidate) IceCandidateHandler.received(candidate, this.peerConnection!)
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
