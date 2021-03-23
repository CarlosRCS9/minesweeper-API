'use strict';

const MinesweeperGame = require('../libs/minesweeper-game');
const lambdaResponse = require('../helpers/aws/lambda-response');

module.exports.handler = async (event, context) => {
  try {
    const gameSlug = event.pathParameters.gameslug;
    if (gameSlug !== 'minesweeper') {
      return lambdaResponse(404, {message: 'game not found'});
    }

    const sessionId = event.pathParameters.sessionid;
    const game = await MinesweeperGame.fromDB(sessionId);

    return lambdaResponse(200, {data: {game: game.publicData}});
  } catch (err) {
    console.log(err);
    return new Error('There was an error during game session creation');
  }
};
