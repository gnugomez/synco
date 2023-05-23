export enum SignalingState {
  CLOSED = 'closed',
  HAVE_LOCAL_OFFER = 'have-local-offer',
  HAVE_LOCAL_ANSWER = 'have-local-pranswer',
  HAVE_REMOTE_ANSWER = 'have-remote-offer',
  HAVE_REMOTE_PREANSWER = 'have-remote-pranswer',
  STABLE = 'stable'
}
