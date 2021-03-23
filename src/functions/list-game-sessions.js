'use strict';

const MinesweeperGame = require('../libs/minesweeper-game');
const lambdaResponse = require('../helpers/aws/lambda-response');

module.exports.handler = async (event, context) => {
  try {
    const userId = event.requestContext.authorizer.principalId;
    const gameSlug = event.pathParameters.gameslug;
    if (gameSlug !== 'minesweeper') {
      return lambdaResponse(404, {message: 'game not found'});
    }

    const games = await MinesweeperGame.findByCreatorId(userId);

    return lambdaResponse(200, {
      message: 'ok',
      data: {games: games.map((game) => game.listData)},
    });
  } catch (err) {
    console.log(err);
    return new Error('There was an error during game sessions listing');
  }
};
