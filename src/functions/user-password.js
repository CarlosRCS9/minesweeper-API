'use strict';

const bcrypt = require('bcryptjs');
const AWS = require('aws-sdk');

const lambdaResponse = require('../helpers/aws/lambda-response');

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
  try {
    if (typeof event.queryStringParameters.token !== 'string' ||
        event.queryStringParameters.token.length < 1) {
      return lambdaResponse(400, {message: 'missing token'});
    }

    const token = event.queryStringParameters.token;
    const body = JSON.parse(event.body);

    const scanUserParams = {
      TableName: process.env.DYNAMODB_USERS_TABLE,
      FilterExpression: 'verificationToken = :verificationToken',
      ExpressionAttributeValues:{':verificationToken': token},
    };
    const scanResults = await dynamodb.scan(scanUserParams).promise();
    if (typeof scanResults.Items !== 'undefined' &&
        scanResults.Items.length !== 1) {
      return lambdaResponse(404, {message: 'user not found'});
    }
    const user = scanResults.Items[0];

    const password = bcrypt.hashSync(body.password, 10);
    const updateUserParams = {
      TableName: process.env.DYNAMODB_USERS_TABLE,
      Key: {'id': user.id},
      // eslint-disable-next-line max-len
      UpdateExpression: 'set password = :password, verificationToken = :verificationToken',
      ExpressionAttributeValues: {
        ':password': password,
        ':verificationToken': '',
      },
      ReturnValues: 'UPDATED_NEW',
    };
    await dynamodb.update(updateUserParams).promise();

    return lambdaResponse(200, {message: 'password updated'});
  } catch (err) {
    console.log(err);
    return new Error('There was an error during user registration');
  }
};