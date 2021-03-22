'use strict';

const Ajv = require('ajv').default;
const {v4: uuidv4} = require('uuid');
const AWS = require('aws-sdk');

const MinesweeperGame = require('../libs/minesweeper-game');
const lambdaResponse = require('../helpers/aws/lambda-response');

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
  try {
    const gameslug = event.pathParameters.gameslug;
    if (gameslug !== 'minesweeper') {
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
    if (gameslug === 'minesweeper') {
      body.mines = typeof body.mines === 'undefined' ?
      Math.floor(body.columns * body.rows * 0.05) :
      body.mines;
    }
    if (gameslug === 'minesweeper' &&
        (body.mines < 1 ||
         body.mines === (body.columns * body.rows))) {
      return lambdaResponse(400, {
        // eslint-disable-next-line max-len
        message: `mines must be between 1 and  ${body.columns} * ${body.rows} - 1`,
      });
    }

    const id = uuidv4();
    const game = new MinesweeperGame({...body, id});
    const putGameParams = {
      TableName: process.env.DYNAMODB_GAMES_TABLE,
      Item: {id, gameSlug: gameslug, gameData: game},
    };
    await dynamodb.put(putGameParams).promise();

    return lambdaResponse(201, {data: {
      message: `${gameslug} game created`,
      game: game.publicData},
    });
  } catch (err) {
    console.log(err);
    return new Error('There was an error during game creation');
  }
};
