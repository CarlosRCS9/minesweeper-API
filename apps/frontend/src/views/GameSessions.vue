<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-col class="text-center" cols="10">
        <v-row>
          <v-col>
            <v-form v-model="valid" @submit.prevent="createGameSession()">
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="columns"
                    label="Columns"
                    :rules="[rules.number, rules.limit]"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="rows"
                    :rules="[rules.number, rules.limit]"
                    label="Rows"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="mines"
                    :rules="[rules.number, rules.mines]"
                    label="Mines"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-btn
                    elevation="0"
                    x-large
                    type="submit"
                    :disabled=newGameBtnDisabled
                  >
                    New game
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
          <v-col>
            <v-btn
              elevation="0"
              x-large
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
    return {
      valid: false,
      columns: 10,
      rows: 10,
      mines: 20,
      sessions: [],
      rules: {
        number: value => !isNaN(Number(value)),
        limit: value => Number(value) <= 30 || 'Must be equal or less than 30',
        mines: value => value < (this.columns * this.rows - 1) || `Mines must be less than ${this.columns * this.rows - 1}`
      }
    }
  },
  mounted () {
    this.readGameSessions()
  },
  computed: {
    newGameBtnDisabled: function () {
      return !this.rules.number(this.columns) ||
      !this.rules.number(this.rows) ||
      !this.rules.number(this.mines) ||
      this.rules.limit(this.columns) !== true ||
      this.rules.limit(this.rows) !== true ||
      this.rules.mines(this.mines) !== true
    }
  },
  methods: {
    logout () {
      localStorage.token = ''
      this.$router.push({ name: 'Login' })
    },
    createGameSession () {
      gameService.createGameSession(this.gameslug, Number(this.columns), Number(this.rows), Number(this.mines))
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
