'use strict';

const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const {v4: uuidv4} = require('uuid');

const findByEmail = require('../libs/find-by-email');
const lambdaResponse = require('../helpers/aws/lambda-response');

// eslint-disable-next-line max-len
const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body);
    const email = body.email.toLowerCase();
    if (!emailPattern.test(email)) {
      return lambdaResponse(400, {message: 'wrong email format'});
    }
    const password = bcrypt.hashSync(body.password, 10);
    const user = {
      id: uuidv4(),
      email,
      password,
      createdDate: new Date().toISOString(),
      verificationToken: '',
    };

    const findResults = await findByEmail(user.email, dynamodb);
    if (typeof findResults.Items !== 'undefined' &&
        findResults.Items.length > 0) {
      return lambdaResponse(409, {message: 'email not allowed'});
    }

    const putUserParams = {
      TableName: process.env.DYNAMODB_USERS_TABLE,
      Item: user,
    };
    await dynamodb.put(putUserParams).promise();
    return lambdaResponse(201, {message: 'user created'});
  } catch (err) {
    console.log(err);
    return new Error('There was an error during user registration');
  }
};
