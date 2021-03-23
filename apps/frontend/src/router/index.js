import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import GameSessions from '../views/GameSessions.vue'
import GameSession from '../views/GameSession.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/games/:gameslug/sessions',
    name: 'GameSessions',
    component: GameSessions,
    props: true
  },
  {
    path: '/games/:gameslug/sessions/:sessionid',
    name: 'GameSession',
    component: GameSession,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
