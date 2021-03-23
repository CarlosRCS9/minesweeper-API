<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-col class="text-center" cols="6">
        <v-row>
          <v-col>
            <v-form v-model="valid" @submit.prevent="login()">
              <v-text-field
                v-model="email"
                label="Email"
                :rules="[rules.email]"
                outlined
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                :append-icon="show1 ? 'fa-eye' : 'fa-eye-slash'"
                :type="show1 ? 'text' : 'password'"
                @click:append="show1 = !show1"
                outlined
              ></v-text-field>
              <v-btn
                elevation="0"
                type="submit"
                :disabled=loginBtnDisabled
              >
                Login
              </v-btn>
            </v-form>
          </v-col>
        </v-row>
        <v-row style="height: 50px">
          <v-col>
            <v-alert
              type="error"
              v-show="loginFailed"
            >
              Authentication failed.
            </v-alert>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import userService from '../services/backend/modules/user'

export default {
  name: 'Login',
  data () {
    return {
      show1: false,
      email: '',
      password: '',
      valid: false,
      loginFailed: false,
      rules: {
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      }
    }
  },
  computed: {
    loginBtnDisabled: function () {
      return !this.valid || this.email === '' || this.password === ''
    }
  },
  methods: {
    login () {
      userService.login(this.email, this.password)
        .then(({ data }) => {
          try {
            localStorage.token = data.data.token
            this.$router.push({ name: 'GameSessions', params: { gameslug: 'minesweeper' } })
          } catch (err) {
            console.log(err)
            throw err
          }
        })
        .catch(() => {
          this.loginFailed = true
          setTimeout(() => {
            this.loginFailed = false
          }, 2000)
        })
    }
  }
}
</script>
