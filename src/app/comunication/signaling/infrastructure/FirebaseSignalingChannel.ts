import { Subject } from 'rxjs'
import { type FirebaseApp, initializeApp } from 'firebase/app'
import type { Database, DatabaseReference } from 'firebase/database'
import { getDatabase, onChildAdded, push, ref } from 'firebase/database'
import consola from 'consola'
import type SignalingChannel from '../domain/SignalingChannel'
import type SignalingMessage from '../domain/SignalingMessage'

export default class BroadcastSignalingChannel implements SignalingChannel {
	private app: FirebaseApp
	private database: Database
	private databaseReference: DatabaseReference

	readonly channelName: string
	messages = new Subject<SignalingMessage>()

	constructor(channelName: string) {
		this.channelName = channelName
		this.app = initializeApp({
			databaseURL: 'https://sync-vide-rtc-default-rtdb.europe-west1.firebasedatabase.app',
		})

		this.database = getDatabase(this.app)
		this.databaseReference = ref(this.database, channelName)

		const currentTimestamp = Date.now()

		onChildAdded(this.databaseReference, (snapshot) => {
			if (snapshot.val().timestamp > currentTimestamp) {
				const data = snapshot.val()
				consola.debug(`BroadcastSignalingChannel with channelName: ${channelName} received: `, data)
				this.messages.next(data)
			}
		})
	}

	public postMessage(message: SignalingMessage) {
		const messageWithTimestamp = { ...message, timestamp: Date.now() }
		consola.debug(
			`BroadcastSignalingChannel with channelName: ${this.channelName} sending: `,
			messageWithTimestamp,
		)
		push(this.databaseReference, messageWithTimestamp)
	}
}
