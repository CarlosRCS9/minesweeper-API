<template>
    <!--<v-row>
      <v-col>
        id: {{gameData.id}}<br>
        columns: {{gameData.columns}}<br>
        rows: {{gameData.rows}}<br>
        mines: {{gameData.mines}}<br>
        won: {{gameData.won}}<br>
        createdDate: {{gameData.createdDate}}<br>
      </v-col>
    </v-row>-->
  <v-container fill-height style="overflow-x:auto;">
    <v-row align="center" justify="center">
      <v-col class="text-center" cols="12">
        <v-row>
          <v-col>
              <div v-for="row in gameData.rows" :key="row">
                <v-row style="height: 60px" align="center" justify="center" class="flex-nowrap">
                  <div v-for="column in gameData.columns" :key="column">
                    <v-col style="padding: 0px">
                      <v-btn
                        elevation="0"
                        min-height="50"
                        style="border-radius: 0px"
                        @contextmenu.prevent="createGameSessionPlay('right', {row: row - 1, column: column - 1})"
                        @click="createGameSessionPlay('left', {row: row - 1, column: column - 1})"
                        :color="getColor(matrixPrinter(column - 1, row - 1))"
                      >
                        <v-icon v-if="matrixPrinter(column - 1, row - 1) < 0">fa-bomb</v-icon>
                        <div v-else-if="matrixPrinter(column - 1, row - 1) === 0"></div>
                        <div v-else-if="matrixPrinter(column - 1, row - 1) === 11"></div>
                        <v-icon v-else-if="matrixPrinter(column - 1, row - 1) === 13" color=red>fa-flag</v-icon>
                        <v-icon v-else-if="matrixPrinter(column - 1, row - 1) === 17">fa-question</v-icon>
                        <div v-else>{{matrixPrinter(column - 1, row - 1)}}</div>
                      </v-btn>
                    </v-col>
                  </div>
                </v-row>
              </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
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
    },
    getColor (value) {
      return (value === 0 || value === 13 || value === 17) ? 'grey darken-1' : 'grey'
    }
  }
}
</script>
