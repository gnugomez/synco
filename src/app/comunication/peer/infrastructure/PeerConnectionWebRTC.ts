import { consola } from 'consola'
import { BehaviorSubject, type Observable, Subject, fromEvent, map } from 'rxjs'
import type SignalingChannel from '../../signaling/domain/SignalingChannel'
import SignalingMessage from '../../signaling/domain/SignalingMessage'
import type PeerConnection from '../domain/PeerConnection'
import type { PeerConnectionState } from '../domain/PeerConnectionState'
import type { SignalingState } from '../../signaling/domain/SignalingState'
import PeerIdentifier from '../domain/PeerIdentifier'
import type PeerConnectionEvent from '../domain/PeerConnectionEvent'
import type DescriptionEvent from '../domain/DescriptionEvent'
import type CandidateEvent from '../domain/CandidateEvent'
import { PeerConnectionActions } from '../domain/PeerConnectionActions'
import type PeerMessage from '../domain/PeerMessage'
import { publishOfferToTargetPeer } from './publishOfferToTargetPeer'
import { publishIceCandidateToTargetPeer } from './publishIceCandidateToTargetPeer'
import { handleDescriptionReceived } from './handleDescriptionReceived'
import { loadIceCandidate } from './loadIceCandidate'

export default class PeerConnectionWebRTC implements PeerConnection {
	readonly peerConnection: RTCPeerConnection
	private dataChannel: RTCDataChannel
	public ignoreOffer = false

	_connectionState = new BehaviorSubject<RTCPeerConnectionState | null>(null)
	_signalingState = new BehaviorSubject<RTCSignalingState | null>(null)
	_messages = new Subject<PeerMessage>()
	makingOffer = new BehaviorSubject<boolean>(false)

	constructor(
		public selfIdentifier: PeerIdentifier,
		public targetIdentifier: PeerIdentifier,
		public polite: boolean,
		private signalingChannel: SignalingChannel,
		private config: RTCConfiguration,
	) {
		consola.debug('Initializing peer to peer connection')
		this.peerConnection = new RTCPeerConnection(this.config)
		this.dataChannel = this.peerConnection.createDataChannel('sync-video-rtc')

		this.peerConnection.onnegotiationneeded = () => publishOfferToTargetPeer(this)

		this.peerConnection.onicecandidate = ({ candidate }) =>
			candidate && publishIceCandidateToTargetPeer(candidate, this)

		fromEvent(this.peerConnection, 'connectionstatechange')
			.pipe(map(() => this.peerConnection.connectionState))
			.subscribe(this._connectionState)

		fromEvent(this.peerConnection, 'signalingstatechange')
			.pipe(map(() => this.peerConnection.signalingState))
			.subscribe(this._signalingState)

		this.peerConnection.ondatachannel = this.onDataChannelHandler

		this.signalingChannel.messages.subscribe(this.onSignalingEvent)
	}

	sendMessage(message: PeerMessage): void {
		if (this.dataChannel.readyState !== 'open')
			this.dataChannel.addEventListener('open', () => this.dataChannel.send(JSON.stringify(message)))
		else
			this.dataChannel.send(JSON.stringify(message))
	}

	private onDataChannelHandler = (ev: RTCDataChannelEvent) => {
		fromEvent<MessageEvent<string>>(ev.channel, 'message')
			.pipe(
				map(ev => JSON.parse(ev.data) as PeerMessage),
			).subscribe(this._messages)
	}

	private onSignalingEvent: (message: SignalingMessage) => void = async ({ action, payload }) => {
		consola.debug('Signaling event received: ', action)

		switch (action) {
			case PeerConnectionActions.DESCRIPTION:
				this.verifyEvent(payload as DescriptionEvent)
					.then((event) => {
						handleDescriptionReceived(
							this,
							event,
							this.peerConnection,
						)
					}).catch((error) => {
						consola.debug('Error verifying description event: ', error, event)
					})
				break
			case PeerConnectionActions.CANDIDATE:
				this.verifyEvent(payload as CandidateEvent)
					.then((event) => {
						loadIceCandidate(
							event,
							this,
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

	public sendPeerConnectionEvent = (action: PeerConnectionActions, event: PeerConnectionEvent) => {
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

	public get messages(): Observable<PeerMessage> {
		return this._messages.asObservable()
	}
}
