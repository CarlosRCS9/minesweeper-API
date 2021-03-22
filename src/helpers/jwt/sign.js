'use strict';

const jwt = require('jsonwebtoken');

const sign = (data, secret = 'secret', expiresIn = '8h') =>
  jwt.sign(data, secret, {expiresIn});

module.exports = sign;
