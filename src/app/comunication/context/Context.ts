import type { PeerFactory, SignalingChannelFactory } from '@gnugomez/synco-room'
import { FirebaseSignalingChannelFactory, RoomFactory, WebRtcPeerFactory } from '@gnugomez/synco-room'

const signalingChannelFactory: SignalingChannelFactory = new FirebaseSignalingChannelFactory()

const peerFactory: PeerFactory = new WebRtcPeerFactory()

export const roomFactory: RoomFactory = new RoomFactory(peerFactory, signalingChannelFactory)
