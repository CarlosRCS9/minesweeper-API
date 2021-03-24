<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-col class="text-center" cols="10">
        <v-row>
          <v-col>
            <v-btn
              elevation="0"
              @click="createGameSession"
            >
              New game
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              elevation="0"
              @click="logout"
            >
              Logout
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-list>
              <v-list-item-group
                v-model="selectedItem"
                color="primary"
              >
                <v-list-item
                  v-for="(item, i) in sessions"
                  :key="i"
                  @click="readGameSession(item.id)"
                >
                  <v-list-item-icon>
                    <v-icon>fa-bomb</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title v-text="new Date(item.createdDate).toLocaleString()"></v-list-item-title>
                    <v-list-item-subtitle v-text="`columns: ${item.columns}, rows: ${item.rows}, mines: ${item.mines}`"></v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-icon>fa-bomb</v-icon>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import gameService from '../services/backend/modules/game'

export default {
  name: 'GameSessions',
  props: {
    gameslug: { type: String }
  },
  data () {
    return { sessions: [] }
  },
  mounted () {
    this.readGameSessions()
  },
  methods: {
    logout () {
      localStorage.token = ''
      this.$router.push({ name: 'Login' })
    },
    createGameSession () {
      gameService.createGameSession(this.gameslug)
        .then(({ data }) => {
          const sessionId = data.data.game.id
          this.$router.push({ name: 'GameSession', params: { gameslug: 'minesweeper', sessionid: sessionId } })
        })
    },
    readGameSessions () {
      gameService.readGameSessions(this.gameslug)
        .then(({ data }) => { this.sessions = data.data.games })
    },
    readGameSession (sessionId) {
      this.$router.push({ name: 'GameSession', params: { gameslug: 'minesweeper', sessionid: sessionId } })
    }
  }
}
</script>
