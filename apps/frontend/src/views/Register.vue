<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-col class="text-center" cols="6">
        <v-row>
          <v-col>
            <v-form v-model="valid" @submit.prevent="register()">
              <v-text-field
                v-model="email"
                label="Email"
                :rules="[rules.email]"
                outlined
              ></v-text-field>
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
                    Register
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
              v-show="registerFailed"
            >
              Registration failed.
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
      email: '',
      password: '',
      passwordRepeated: '',
      valid: false,
      registerFailed: false,
      rules: {
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
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
      return !this.valid || this.email === '' || this.password === ''
    }
  },
  methods: {
    register () {
      userService.register(this.email, this.password)
        .then(({ data }) => {
          try {
            console.log(data)
            this.$router.push({ name: 'Login' })
          } catch (err) {
            console.log(err)
            throw err
          }
        })
        .catch(() => {
          this.registerFailed = true
          setTimeout(() => {
            this.registerFailed = false
          }, 2000)
        })
    },
    signin () {
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>
