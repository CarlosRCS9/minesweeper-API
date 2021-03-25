'use strict';

const jwt = require('jsonwebtoken');

const generatePolicy = function(principalId, effect, resource) {
  const authResponse = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};

module.exports.handler = async (event, context) => {
  try {
    const authorizerToken = event.authorizationToken;
    const authorizerArr = authorizerToken.split(' ');
    if (authorizerArr.length !== 2 ||
        authorizerArr[0] !== 'Bearer' ||
        authorizerArr[1].length === 0) {
      return generatePolicy('undefined', 'Deny', '*');
    }
    const token = authorizerArr[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decodedToken.user !== 'undefined' &&
        typeof decodedToken.user.id !== 'undefined' &&
        decodedToken.user.id.length > 0) {
      return generatePolicy(decodedToken.user.id, 'Allow', '*');
    }
    return generatePolicy('undefined', 'Deny', '*');
  } catch (err) {
    console.log(err);
    return new Error('There was an error during jwt token validation');
  }
};
