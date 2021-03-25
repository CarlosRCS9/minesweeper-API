<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-col class="text-center" cols="6">
        <v-row>
          <v-col>
            <v-form v-model="valid" @submit.prevent="recoverPasswordSet()">
              <v-text-field
                v-model="password"
                label="Password"
                :rules="[rules.password]"
                :append-icon="show1 ? 'fa-eye' : 'fa-eye-slash'"
                :type="show1 ? 'text' : 'password'"
                @click:append="show1 = !show1"
                outlined
              ></v-text-field>
              <v-text-field
                v-model="passwordRepeated"
                label="Confirm password"
                :rules="[rules.password, rules.passwordsEqual]"
                :append-icon="show2 ? 'fa-eye' : 'fa-eye-slash'"
                :type="show1 ? 'text' : 'password'"
                @click:append="show2 = !show2"
                outlined
              ></v-text-field>
              <v-row>
                <v-col>
                  <v-btn
                    elevation="0"
                    type="submit"
                    :disabled=loginBtnDisabled
                  >
                    Set password
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
              Demo purposes only.
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
      show1: false,
      show2: false,
      password: '',
      passwordRepeated: '',
      valid: false,
      requestFailed: false,
      rules: {
        password: value => {
          return value.length >= 8 || 'Password must be at least 8 characters'
        },
        passwordsEqual: value => {
          return value === this.password || 'Password must be equal'
        }
      }
    }
  },
  computed: {
    loginBtnDisabled: function () {
      return !this.valid || this.password === ''
    }
  },
  methods: {
    recoverPasswordSet () {
      userService.recoverPasswordSet(this.$route.query.token, this.password)
        .then(() => {
          this.$router.push({ name: 'Login' })
        })
        .catch(() => {
          this.requestFailed = true
          setTimeout(() => {
            this.requestFailed = false
            this.$router.push({ name: 'Login' })
          }, 2000)
        })
    }
  }
}
</script>
