import axios from '../../index'

const login = (email, password) => axios.post('/users/login', { email, password })

const register = (email, password) => axios.post('/users', { email, password })

export default { login, register }
