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

const createGameSession = (gameSlug, columns, rows, mines) => axios.post(`/games/${gameSlug}/sessions`, {
  columns,
  rows,
  mines
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
