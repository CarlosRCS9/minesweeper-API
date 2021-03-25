import axios from '../../index'

const login = (email, password) => axios.post('/users/login', { email, password })

const register = (email, password) => axios.post('/users', { email, password })

const recoverPasswordRequest = (email) => axios.post('/users/recover-password-request', { email })

const recoverPasswordSet = (token, password) => axios.post(`/users/recover-password-set?token=${token}`, { password })

export default { login, register, recoverPasswordRequest, recoverPasswordSet }
