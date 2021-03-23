import axios from '../../index'

const readGameSessions = (gameSlug) => axios.get(`/games/${gameSlug}/sessions`, {
  headers: {
    Authorization: 'Bearer ' + localStorage.token
  }
})

const readGameSession = (gameSlug, sessionId) => axios.get(`/games/${gameSlug}/sessions/${sessionId}`)

const createGameSessionPlay = (gameSlug, sessionId, playData) => axios.post(`/games/${gameSlug}/sessions/${sessionId}`, playData)

export default {
  readGameSessions,
  readGameSession,
  createGameSessionPlay
}
