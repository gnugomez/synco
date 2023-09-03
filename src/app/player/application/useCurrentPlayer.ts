import type Player from '../domain/Player'
import { usePlayers } from '../infrastructure'
import { orElse } from '@/app/common/Helpers'

export function useCurrentPlayer(): Player {
	const { players, defaultPlayer } = usePlayers()
	return orElse(players.find(player => player.isCurrentPlayer()), defaultPlayer)
}
