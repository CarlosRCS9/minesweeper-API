'use strict';

const MinesweeperGame = require('../libs/minesweeper-game');
const lambdaResponse = require('../helpers/aws/lambda-response');

module.exports.handler = async (event, context) => {
  try {
    const gameSlug = event.pathParameters.gameslug;
    if (gameSlug !== 'minesweeper') {
      return lambdaResponse(404, {message: 'game not found'});
    }

    const userId = event.requestContext.authorizer.principalId;
    const sessionId = event.pathParameters.sessionid;
    const game = await MinesweeperGame.fromDB(sessionId, userId);

    return lambdaResponse(200, {message: 'ok', data: {game: game.publicData}});
  } catch (err) {
    console.log(err);
    if (('' + err).includes('not found')) {
      return lambdaResponse(404, {message: 'session not found'});
    }
    return new Error('There was an error during game session creation');
  }
};
