'use strict';

const lambdaResponse = (statusCode = 200, data = {message: 'ok'}) => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
  },
  body: JSON.stringify(data),
});

module.exports = lambdaResponse;
