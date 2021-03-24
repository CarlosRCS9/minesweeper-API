import axios from '../../index'

const readGameSessions = (gameSlug) => axios.get(`/games/${gameSlug}/sessions`, {
  headers: {
    Authorization: 'Bearer ' + localStorage.token
  }
})

const readGameSession = (gameSlug, sessionId) => axios.get(`/games/${gameSlug}/sessions/${sessionId}`, {
  headers: {
    Authorization: 'Bearer ' + localStorage.token
  }
})

const createGameSession = (gameSlug) => axios.post(`/games/${gameSlug}/sessions`, {
  columns: 10,
  rows: 10,
  mines: 10
}, {
  headers: {
    Authorization: 'Bearer ' + localStorage.token
  }
})

const createGameSessionPlay = (gameSlug, sessionId, playData) => axios.post(`/games/${gameSlug}/sessions/${sessionId}`, playData, {
  headers: {
    Authorization: 'Bearer ' + localStorage.token
  }
})

export default {
  readGameSessions,
  readGameSession,
  createGameSession,
  createGameSessionPlay
}
