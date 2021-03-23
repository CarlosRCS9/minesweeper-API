import axios from '../../index'

const createGameSessionPlay = (gameSlug, sessionId, playData) => axios.post(`/games/${gameSlug}/sessions/${sessionId}`, playData)

const readGameSession = (gameSlug, sessionId) => axios.get(`/games/${gameSlug}/sessions/${sessionId}`)

export default {readGameSession, createGameSessionPlay}
