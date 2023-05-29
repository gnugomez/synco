import { consola } from 'consola'
import { BehaviorSubject, type Observable, fromEvent, map } from 'rxjs'
import type SignalingChannel from '../../signaling/domain/SignalingChannel'
import { SignalingActions } from '../../signaling/domain/SignalingActions'
import SignalingMessage from '../../signaling/domain/SignalingMessage'
import type PeerConnection from '../domain/PeerConnection'
import type { PeerConnectionState } from '../domain/PeerConnectionState'
import type { SignalingState } from '../../signaling/domain/SignalingState'
import PeerIdentifier from '../domain/PeerIdentifier'
import type PeerConnectionEvent from '../domain/PeerConnectionEvent'
import type PeerDescriptionEvent from '../domain/PeerDescriptionEvent'
import type PeerCandidateEvent from '../domain/PeerCandidateEvent'
import IceCandidateHandler from './IceCandidateHandler'
import NegotiationNeededHandler from './NegotiationNeededHandler'
import DescriptionReceivedHandler from './DescriptionReceivedHandler'

export default class PeerConnectionWebRTC implements PeerConnection {
	readonly peerConnection: RTCPeerConnection
	private dataChannel: RTCDataChannel | null = null
	public ignoreOffer = false

	_connectionState = new BehaviorSubject<RTCPeerConnectionState | null>(null)
	_signalingState = new BehaviorSubject<RTCSignalingState | null>(null)

	makingOffer = new BehaviorSubject<boolean>(false)

	constructor(
		public selfIdentifier: PeerIdentifier,
		public targetIdentifier: PeerIdentifier,
		public polite: boolean,
		private signalingChannel: SignalingChannel,
		private config: RTCConfiguration,
	) {
		consola.info('Initializing peer to peer connection')
		this.peerConnection = new RTCPeerConnection(this.config)
		this.dataChannel = this.peerConnection.createDataChannel('sync-video-rtc')

		/* Setting up a callback function to handle the `onnegotiationneeded` event when a new negotiation is needed */
		this.peerConnection.onnegotiationneeded = () =>
			NegotiationNeededHandler.handle(this)

		/* Setting up a callback function to handle the `onicecandidate` event when a new ICE candidate is available */
		this.peerConnection.onicecandidate = ({ candidate }) =>
			candidate && IceCandidateHandler.ready(candidate, this)

		/* Setting up reactive variables */
		fromEvent(this.peerConnection, 'connectionstatechange')
			.pipe(map(() => this.peerConnection.connectionState))
			.subscribe(this._connectionState)

		fromEvent(this.peerConnection, 'signalingstatechange')
			.pipe(map(() => this.peerConnection.signalingState))
			.subscribe(this._signalingState)

		this.peerConnection.ondatachannel = this.onDataChannelHandler

		/* Setting up a callback function to be executed when a signaling message is received through the `signalingChannel` */
		this.signalingChannel.messages.subscribe(this.onSignalingEvent)
	}

	private onDataChannelHandler = (ev: RTCDataChannelEvent) => {
		consola.info('Data channel received: ', ev)
		ev.channel.onmessage = (ev) => {
			consola.info('Data channel message received: ', ev)
		}
	}

	private onSignalingEvent: (message: SignalingMessage) => void = async ({ action, payload }) => {
		consola.info('Signaling event received: ', action)

		switch (action) {
			case SignalingActions.DESCRIPTION:
				this.verifyEvent(payload as PeerDescriptionEvent)
					.then((event) => {
						DescriptionReceivedHandler.handle(
							this,
							event,
							this.peerConnection,
						).catch((error) => {
							consola.debug('Error verifying description event: ', error, event)
						})
					})
				break
			case SignalingActions.CANDIDATE:
				this.verifyEvent(payload as PeerCandidateEvent)
					.then((event) => {
						IceCandidateHandler.received(
							event,
							this.peerConnection,
						)
					}).catch((error) => {
						consola.debug('Error verifying candidate event: ', error, event)
					})
				break
		}
	}

	private verifyEvent: <T extends PeerConnectionEvent>(event: T) => Promise<T>
		= event => new Promise((resolve, reject) => {
			if (PeerIdentifier.areEqual(event.targetPeerIdentifier, this.selfIdentifier)
			&& PeerIdentifier.areEqual(event.originatedPeerIdentifier, this.targetIdentifier))
				resolve(event)
			else
				reject(new Error('The event is not for this peer connection'))
		})

	public sendSignalingEvent = (action: SignalingActions, event: PeerConnectionEvent) => {
		this.signalingChannel.postMessage(new SignalingMessage<PeerConnectionEvent>(action, event))
	}

	close = () => {
		this.peerConnection.close()
	}

	public get connectionState(): Observable<PeerConnectionState> {
		return this._connectionState.pipe(map(state => state as PeerConnectionState))
	}

	public get signalingState(): Observable<SignalingState> {
		return this._signalingState.pipe(map(state => state as SignalingState))
	}
}
