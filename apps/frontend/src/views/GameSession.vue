<template>
  <v-container fill-height>
    <v-row>
      <v-col class="text-center">
        <v-row>
          <v-col>
            <v-list>
              <v-list-item-group>
                <v-list-item>
                  <v-list-item-action
                    @click="gameSessions()"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          v-bind="attrs"
                          v-on="on"
                        >
                          fa-arrow-left
                        </v-icon>
                      </template>
                      <span>Return</span>
                    </v-tooltip>
                  </v-list-item-action>

                  <v-list-item-content>
                    <v-list-item-title v-text="new Date(gameData.createdDate).toLocaleString()"></v-list-item-title>
                    <v-list-item-subtitle v-text="`columns: ${gameData.columns}, rows: ${gameData.rows}, mines: ${gameData.mines}`"></v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          v-bind="attrs"
                          v-on="on"
                          :color="getFlagColor(gameData.initialized, gameData.ended, gameData.won)"
                          @mouseover="setDate(gameData.initializedDate)"
                        >
                          fa-flag
                        </v-icon>
                      </template>
                      <span>{{getFlagText(gameData.initialized, gameData.ended, gameData.won, new Date(gameData.endedDate), new Date(gameData.initializedDate))}}</span>
                    </v-tooltip>
                  </v-list-item-action>

                  <v-list-item-action
                    @click="gameSessions()"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          v-bind="attrs"
                          v-on="on"
                        >
                          fa-arrow-left
                        </v-icon>
                      </template>
                      <span>Return</span>
                    </v-tooltip>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-col>
        </v-row>
        <v-row  align="center" justify="center">
          <v-col style="overflow-x:auto;" md="6">
              <div v-for="row in gameData.rows" :key="row">
                <v-row style="min-height=40" :style="getSizeString()" class="flex-nowrap">
                  <div v-for="column in gameData.columns" :key="column">
                    <v-col style="padding: 0px">
                      <v-btn
                        elevation="0"
                        min-height="30"
                        min-width="30"
                        :height="getSize()"
                        :width="getSize()"
                        style="border-radius: 0px; padding: 0px"
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
    return {
      gameData: {},
      date: null,
      duration: 0,
      intervalJob: setInterval(() => {
        if (this.date !== null) {
          let seconds = Math.floor((new Date() - this.date) / 1000)
          let minutes = Math.floor(seconds / 60)
          seconds = seconds - minutes * 60
          let hours = Math.floor(minutes / 60)
          minutes = minutes - hours * 60
          const days = Math.floor(hours / 24)
          hours = hours - days * 24
          this.duration = `${days}d ${hours}h ${minutes}m ${seconds}s`
        }
      }, 1000)
    }
  },
  mounted () {
    this.readGameSession()
  },
  methods: {
    gameSessions () {
      this.$router.push({ name: 'GameSessions' })
    },
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
    },
    getFlagColor (initialized, ended, won) {
      return initialized ? (ended ? (won ? 'green' : 'red') : '') : ''
    },
    getFlagText (initialized, ended, won, end, start) {
      return initialized ? (ended ? (won ? 'Won' : `Lost: ${this.getDurationString(end, start)}`) : `Time: ${this.duration}`) : 'Pending'
    },
    setDate (date) {
      this.date = new Date(date)
    },
    getDurationString (end, start) {
      let seconds = Math.floor((end - start) / 1000)
      let minutes = Math.floor(seconds / 60)
      seconds = seconds - minutes * 60
      let hours = Math.floor(minutes / 60)
      minutes = minutes - hours * 60
      const days = Math.floor(hours / 24)
      hours = hours - days * 24
      return `${days}d ${hours}h ${minutes}m ${seconds}s`
    },
    getSize () {
      // const size = Math.floor(30 + 800 / this.gameData.columns)
      const size = Math.floor(900 / this.gameData.columns)
      return size
    },
    getSizeString () {
      const sizeString = `height: ${this.getSize() + 10}px`
      return sizeString
    }
  }
}
</script>
