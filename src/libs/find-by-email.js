'use strict';

const AWS = require('aws-sdk');

const findByEmail = (email, dynamodb = new AWS.DynamoDB.DocumentClient()) => {
  const queryUserParams = {
    TableName: process.env.DYNAMODB_USERS_TABLE,
    IndexName: 'emailIndex',
    KeyConditionExpression: '#email = :email',
    ExpressionAttributeNames: {'#email': 'email'},
    ExpressionAttributeValues: {':email': email},
  };
  return dynamodb.query(queryUserParams).promise();
};

module.exports = findByEmail;
