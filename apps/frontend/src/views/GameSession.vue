<template>
  <div>
    <h1>Game session view</h1>
    <v-row>
      <v-col>
        id: {{gameData.id}}<br>
        columns: {{gameData.columns}}<br>
        rows: {{gameData.rows}}<br>
        mines: {{gameData.mines}}<br>
        won: {{gameData.won}}<br>
        createdDate: {{gameData.createdDate}}<br>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
          <div v-for="row in gameData.rows" :key="row">
            <v-row style="height: 60px">
              <div v-for="column in gameData.columns" :key="column">
                <v-col style="padding: 0px">
                  <v-btn
                    elevation="0"
                    min-height="50"
                    @contextmenu.prevent="createGameSessionPlay('right', {row: row - 1, column: column - 1})"
                    @click="createGameSessionPlay('left', {row: row - 1, column: column - 1})"
                  >
                    <div v-if="matrixPrinter(column - 1, row - 1) === 0" right dark></div>
                    <v-icon v-else-if="matrixPrinter(column - 1, row - 1) % 7 === 0" right dark>fa-question</v-icon>
                    <v-icon v-else-if="matrixPrinter(column - 1, row - 1) % 5 === 0" right dark color=red>fa-flag</v-icon>
                    <v-icon v-else-if="matrixPrinter(column - 1, row - 1) % 2 < 0" right dark>fa-bomb</v-icon>
                    <div v-else-if="matrixPrinter(column - 1, row - 1) !== 0" right dark>{{matrixPrinter(column - 1, row - 1)}}</div>
                  </v-btn>
                </v-col>
              </div>
            </v-row>
          </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import gameService from '../services/backend/modules/game'

export default {
  name: 'GameSession',
  props: {
    gameslug: { type: String },
    sessionid: { type: String }
  },
  data () {
    return { gameData: {} }
  },
  mounted () {
    this.readGameSession()
  },
  methods: {
    readGameSession () {
      gameService.readGameSession(this.gameslug, this.sessionid)
        .then(({ data }) => { this.gameData = data.data.game })
    },
    createGameSessionPlay (click, cell) {
      gameService.createGameSessionPlay(this.gameslug, this.sessionid, { click, cell })
        .then(({ data }) => { this.gameData = data.data.game })
    },
    matrixPrinter (column, row) {
      const flattened = this.gameData.viewMatrix.reduce((acc, row) => [...acc, ...row], [])
      return flattened[row * this.gameData.columns + column]
    }
  }
}
</script>
