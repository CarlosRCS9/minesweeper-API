<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-col class="text-center" cols="6">
        <v-row>
          <v-col>
            <v-form v-model="valid" @submit.prevent="recoverPasswordRequest()">
              <v-text-field
                v-model="email"
                label="Email"
                :rules="[rules.email]"
                outlined
              ></v-text-field>
              <v-row>
                <v-col>
                  <v-btn
                    elevation="0"
                    type="submit"
                    :disabled=recoverBtnDisabled
                  >
                    Recover password
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn
                    elevation="0"
                    @click="signin"
                  >
                    Sign in
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
        <v-row style="height: 50px">
          <v-col>
            <v-alert
              type="error"
              v-show="requestFailed"
            >
              Password recovery failed.
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
  name: 'Register',
  data () {
    return {
      email: '',
      valid: false,
      requestFailed: false,
      rules: {
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      }
    }
  },
  computed: {
    recoverBtnDisabled: function () {
      return !this.valid || this.email === ''
    }
  },
  methods: {
    recoverPasswordRequest () {
      userService.recoverPasswordRequest(this.email)
        .then(() => {
          this.$router.push({ name: 'RecoverPasswordSet', query: { token: 'DEMO' } })
        })
        .catch(() => {
          this.requestFailed = true
          setTimeout(() => {
            this.requestFailed = false
          }, 2000)
        })
    },
    signin () {
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>
