import { consola } from 'consola'
import { BehaviorSubject, type Observable, fromEvent, map } from 'rxjs'
import type SignalingChannel from '../../domain/signaling/SignalingChannel'
import { SignalingActions } from '../../domain/signaling/SignalingActions'
import type SignalingMessage from '../../domain/signaling/SignalingMessage'
import type PeerConnection from '../../domain/peer/PeerConnection'
import type { PeerConnectionState } from '../../domain/peer/PeerConnectionState'
import type { SignalingState } from '../../domain/signaling/SignalingState'
import type PeerIdentifier from '../../domain/peer/PeerIdentifier'
import IceCandidateHandler from './IceCandidateHandler'
import DescriptionReceivedHandler from './DescriptionReceivedHandler'
import NegotiationNeededHandler from './NegotiationNeededHandler'

export default class PeerConnectionWebRTC implements PeerConnection {
  private peerConnection: RTCPeerConnection
  private dataChannel: RTCDataChannel | null = null
  public ignoreOffer = false

  _connectionState = new BehaviorSubject<RTCPeerConnectionState | null>(null)
  _signalingState = new BehaviorSubject<RTCSignalingState | null>(null)

  makingOffer = new BehaviorSubject<boolean>(false)

  constructor(
    public identifier: PeerIdentifier,
    public polite: boolean,
    private signalingChannel: SignalingChannel,
    private config: RTCConfiguration,
  ) {
    consola.info('Initializing peer to peer connection')
    this.peerConnection = new RTCPeerConnection(this.config)
    this.dataChannel = this.peerConnection.createDataChannel('sync-video-rtc')

    /* Setting up a callback function to handle the `onnegotiationneeded` event when a new negotiation is needed */
    this.peerConnection.onnegotiationneeded = () =>
      NegotiationNeededHandler.handle(this, this.peerConnection, this.signalingChannel)

    /* Setting up a callback function to handle the `onicecandidate` event when a new ICE candidate is available */
    this.peerConnection.onicecandidate = ({ candidate }) =>
      candidate && IceCandidateHandler.ready(candidate, this.signalingChannel)

    /* Setting up reactive variables */
    fromEvent(this.peerConnection, 'connectionstatechange')
      .pipe(map(() => this.peerConnection.connectionState))
      .subscribe(this._connectionState)

    fromEvent(this.peerConnection, 'signalingstatechange')
      .pipe(map(() => this.peerConnection.signalingState))
      .subscribe(this._signalingState)

    this.peerConnection.ondatachannel = this.onDataChannelHandler

    /* Setting up a callback function to be executed when a signaling message is received through the `signalingChannel` */
    this.signalingChannel.onMessage = this.onSignalingEvent
  }

  public get connectionState(): Observable<PeerConnectionState> {
    return this._connectionState.pipe(map(state => state as PeerConnectionState))
  }

  public get signalingState(): Observable<SignalingState> {
    return this._signalingState.pipe(map(state => state as SignalingState))
  }

  private onDataChannelHandler = (ev: RTCDataChannelEvent) => {
    consola.info('Data channel received: ', ev)
    ev.channel.onmessage = (ev) => {
      consola.info('Data channel message received: ', ev)
    }
  }

  private onSignalingEvent: (message: SignalingMessage) => void = async ({
    action,
    candidate,
    description,
  }) => {
    consola.info('Signaling event received: ', action)

    try {
      switch (action) {
        case SignalingActions.SEND_DESCRIPTION:
          if (description) {
            DescriptionReceivedHandler.handle(
              this,
              description,
              this.peerConnection,
              this.signalingChannel,
            )
          }
          break
        case SignalingActions.SEND_CANDIDATE:
          if (candidate)
            IceCandidateHandler.received(candidate, this.peerConnection)
          break
      }
    }
    catch (error) {
      consola.error('There was an error during the negotiation: ', error)
    }
  }

  close = () => {
    this.peerConnection.close()
  }
}
