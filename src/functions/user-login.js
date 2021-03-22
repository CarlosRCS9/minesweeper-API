'use strict';

const bcrypt = require('bcryptjs');

const findByEmail = require('../libs/find-by-email');
const sign = require('../helpers/jwt/sign');
const lambdaResponse = require('../helpers/aws/lambda-response');

module.exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);
    const email = body.email.toLowerCase();
    const password = body.password;

    const findResults = await findByEmail(email);
    if (typeof findResults.Items !== 'undefined' &&
        findResults.Items.length !== 1) {
      return lambdaResponse(401, {message: 'wrong credentials'});
    }

    let user = findResults.Items[0];
    if (!bcrypt.compareSync(password, user.password)) {
      return lambdaResponse(401, {message: 'wrong credentials'});
    }

    user = {email: user.email, id: user.id};
    const token = sign({user}, process.env.JWT_SECRET);
    return lambdaResponse(200, {message: 'ok', data: {token}});
  } catch (err) {
    console.log(err);
    return new Error('There was an error during user registration');
  }
};
