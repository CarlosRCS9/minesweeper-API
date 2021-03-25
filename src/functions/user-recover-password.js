'use strict';

const cryptoRandomString = require('crypto-random-string');
const AWS = require('aws-sdk');

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

    const findResults = await findByEmail(email, dynamodb);
    if (typeof findResults.Items !== 'undefined' &&
        findResults.Items.length !== 1) {
      return lambdaResponse(200, {message: 'email sent'});
    }
    const user = findResults.Items[0];

    const verificationToken =
      cryptoRandomString({length: 128, type: 'url-safe'});
    const updateUserParams = {
      TableName: process.env.DYNAMODB_USERS_TABLE,
      Key: {'id': user.id},
      UpdateExpression: 'set verificationToken = :verificationToken',
      ExpressionAttributeValues:{':verificationToken': verificationToken},
      ReturnValues: 'UPDATED_NEW',
    };
    await dynamodb.update(updateUserParams).promise();

    console.log({email, verificationToken});
    return lambdaResponse(200, {message: 'email sent'});
  } catch (err) {
    console.log(err);
    return new Error('There was an error during user registration');
  }
};
