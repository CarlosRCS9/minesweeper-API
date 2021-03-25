import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import RecoverPasswordRequest from '../views/RecoverPasswordRequest.vue'
import RecoverPasswordSet from '../views/RecoverPasswordSet.vue'
import GameSessions from '../views/GameSessions.vue'
import GameSession from '../views/GameSession.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/recover-password-request',
    name: 'RecoverPasswordRequest',
    component: RecoverPasswordRequest
  },
  {
    path: '/recover-password-set',
    name: 'RecoverPasswordSet',
    component: RecoverPasswordSet
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

router.beforeEach((to, from, next) => {
  const publicRoutes = ['Login', 'Register', 'RecoverPasswordRequest', 'RecoverPasswordSet']
  const tokenInStorage = localStorage.getItem('token')
  const authRequiredRoute = !publicRoutes.includes(to.name)
  if (authRequiredRoute && !tokenInStorage) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
