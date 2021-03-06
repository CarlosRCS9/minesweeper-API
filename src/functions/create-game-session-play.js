'use strict';

const Ajv = require('ajv').default;

const MinesweeperGame = require('../libs/minesweeper-game');
const lambdaResponse = require('../helpers/aws/lambda-response');

module.exports.handler = async (event, context) => {
  try {
    const gameSlug = event.pathParameters.gameslug;
    if (gameSlug !== 'minesweeper') {
      return lambdaResponse(404, {message: 'game not found'});
    }

    const ajv = new Ajv();
    const schema =
      require('../schemas/ajv/create-minesweeper-game-play-request.json');
    const validate = ajv.compile(schema);
    const body = JSON.parse(event.body);
    if (!validate(body)) {
      return lambdaResponse(400, {errors: validate.errors});
    }

    const userId = event.requestContext.authorizer.principalId;
    const sessionId = event.pathParameters.sessionid;
    const game = await MinesweeperGame.fromDB(sessionId, userId);
    game.play(body);
    await game.save();

    return lambdaResponse(200, {
      message: 'ok',
      data: {game: game.publicData, body}
    });
  } catch (err) {
    console.log(err);
    if (('' + err).includes('not found')) {
      return lambdaResponse(404, {message: 'session not found'});
    }
    if (('' + err).includes('must be between')) {
      return lambdaResponse(400, {message: '' + err});
    }
    return new Error('There was an error during game session creation');
  }
};
