import type Player from '../domain/Player'
import NetflixPlayer from './NetflixPlayer'
import VideoElementPlayer from './VideoElementPlayer'

export function usePlayers(): { players: Player[]; defaultPlayer: Player } {
	const players = [new VideoElementPlayer(), new NetflixPlayer()]
	const defaultPlayer = new VideoElementPlayer()
	return {
		players,
		defaultPlayer,
	}
}
