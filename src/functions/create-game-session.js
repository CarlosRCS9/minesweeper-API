'use strict';

const Ajv = require('ajv').default;
const {v4: uuidv4} = require('uuid');

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
      require('../schemas/ajv/create-minesweeper-game-request.json');
    const validate = ajv.compile(schema);
    const body = JSON.parse(event.body);
    if (!validate(body)) {
      return lambdaResponse(400, {errors: validate.errors});
    }
    if (gameSlug === 'minesweeper') {
      body.mines = typeof body.mines === 'undefined' ?
      Math.floor(body.columns * body.rows * 0.05) :
      body.mines;
    }
    if (gameSlug === 'minesweeper' &&
        (body.mines < 1 ||
         body.mines === (body.columns * body.rows))) {
      return lambdaResponse(400, {
        // eslint-disable-next-line max-len
        message: `mines must be between 1 and  ${body.columns} * ${body.rows} - 1`,
      });
    }

    const id = uuidv4();
    const creatorId = uuidv4();
    const game = new MinesweeperGame({...body, id, creatorId});
    await game.toDB();

    return lambdaResponse(201, {data: {
      message: `${gameSlug} game created`,
      game: game.publicData},
    });
  } catch (err) {
    console.log(err);
    return new Error('There was an error during game creation');
  }
};
