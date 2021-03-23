import axios from '../../index'

const login = (email, password) => axios.post('/users/login', { email, password })

export default { login }
