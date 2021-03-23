'use strict';

const AWS = require('aws-sdk');

const arraySample = require('../helpers/array-sample');

/**
 * MinesweeperGame
 */
class MinesweeperGame {
  /**
     * constructor
     * @param {string}  id
     * @param {number}  columns
     * @param {number}  rows
     * @param {number}  mines
     * @param {boolean} initialized
     * @param {string}  minesMatrix
     * @param {string}  viewMatrix
     */
  constructor({
    id,
    creatorId,
    columns,
    rows,
    mines,
    initialized = false,
    ended = false,
    won = false,
    minesMatrix = [],
    viewMatrix = [],
    createdDate = new Date(),
  }) {
    this.id = id;
    this.creatorId = creatorId;
    this.columns = columns;
    this.rows = rows;
    this.mines = mines;
    this.initialized = initialized;
    this.ended = ended;
    this.won = won;
    this.minesMatrix = minesMatrix.length > 0 ?
      minesMatrix : this.zeroMatrix(this.columns, this.rows);
    this.viewMatrix = viewMatrix.length > 0 ?
      viewMatrix : this.zeroMatrix(this.columns, this.rows);
    this.createdDate = createdDate;
  }
  /**
   * publicData
   */
  get publicData() {
    return {
      id: this.id,
      creatorId: this.creatorId,
      columns: this.columns,
      rows: this.rows,
      mines: this.mines,
      initialized: this.initialized,
      ended: this.ended,
      won: this.won,
      minesMatrixDraw: this.arrayToDraw(this.minesMatrix, this.columns),
      viewMatrixDraw: this.arrayToDraw(this.viewMatrix, this.columns),
      // eslint-disable-next-line max-len
      clientMatrixDraw: this.arrayToDraw(this.elemetWiseProduct(this.minesMatrix, this.viewMatrix), this.columns),
      // eslint-disable-next-line max-len
      viewMatrix: this.arrayToMatrix(this.elemetWiseProduct(this.minesMatrix, this.viewMatrix), this.columns),
      createdDate: this.createdDate,
    };
  }
  /**
   * listData
   */
  get listData() {
    return {
      id: this.id,
      columns: this.columns,
      rows: this.rows,
      mines: this.mines,
      initialized: this.initialized,
      ended: this.ended,
      won: this.won,
      createdDate: this.createdDate,
    };
  }
  /**
   * createMatrix
   * @param  {number} columns
   * @param  {number} rows
   * @return {string}
   */
  zeroMatrix(columns, rows) {
    return Array(columns * rows).fill(0);
  }
  /**
   * arrayToMatrix
   * @param  {Array.<nubmer>}         array
   * @param  {number}                 columns
   * @return {Array.<Array.<number>>}
   */
  arrayToMatrix(array, columns) {
    return array
        .reduce((rows, item, index) => {
          if (index % columns === 0) {
            rows.push([]);
          }
          rows[rows.length - 1].push(Number(item));
          return rows;
        }, []);
  }
  /**
   * arrayToDraw
   * @param  {Array.<nubmer>}         array
   * @param  {number}                 columns
   * @return {Array.<Array.<number>>}
   */
  arrayToDraw(array, columns) {
    return array
        .reduce((rows, item, index) => {
          if (index % columns === 0) {
            rows.push('');
          }
          rows[rows.length - 1] += item < 0 ? item : ' ' + item;
          return rows;
        }, []);
  }
  /**
   * elemetWiseProduct
   * @param {Array.<number>} array1
   * @param {Array.<number>} array2
   * @return {Array.<number>}
   */
  elemetWiseProduct(array1, array2) {
    return array1.map((item1, index) => item1 * array2[index]);
  }
  /**
   * fromDB
   * @param {string} id
   * @param {object} dynamodb
   * @return {object}
   */
  static fromDB(id, dynamodb = new AWS.DynamoDB.DocumentClient()) {
    const scanGameParams = {
      TableName: process.env.DYNAMODB_GAMES_TABLE,
      FilterExpression: 'id = :id',
      ExpressionAttributeValues: {':id': id},
    };
    return dynamodb.scan(scanGameParams).promise()
        .then((scanResults) => {
          if (typeof scanResults.Items !== 'undefined' &&
              scanResults.Items.length !== 1) {
            throw new Error('game not found');
          }
          scanResults.Items[0].gameData.minesMatrix =
            scanResults.Items[0].gameData.minesMatrix
                .split(',')
                .map((item) => Number(item));
          scanResults.Items[0].gameData.viewMatrix =
            scanResults.Items[0].gameData.viewMatrix
                .split(',')
                .map((item) => Number(item));
          scanResults.Items[0].gameData.createdDate =
            new Date(scanResults.Items[0].gameData.createdDate);
          return new this(scanResults.Items[0].gameData);
        });
  }
  /**
   * findByCreatorId
   * @param {string} creatorId
   * @param {object} dynamodb
   * @return {object}
   */
  static findByCreatorId(
      creatorId,
      dynamodb = new AWS.DynamoDB.DocumentClient()
  ) {
    const queryUserParams = {
      TableName: process.env.DYNAMODB_GAMES_TABLE,
      IndexName: 'creatorIdIndex',
      KeyConditionExpression: '#creatorId = :creatorId',
      ExpressionAttributeNames: {'#creatorId': 'creatorId'},
      ExpressionAttributeValues: {':creatorId': creatorId},
    };
    return dynamodb.query(queryUserParams).promise()
        .then((scanResults) => scanResults.Items.map((item) => {
          item.gameData.minesMatrix =
            item.gameData.minesMatrix
                .split(',')
                .map((item) => Number(item));
          item.gameData.viewMatrix =
            item.gameData.viewMatrix
                .split(',')
                .map((item) => Number(item));
          item.gameData.createdDate =
            new Date(item.gameData.createdDate);
          return new this(item.gameData);
        }));
  }
  /**
   * save
   * @param  {object} dynamodb
   * @return {object}
   */
  save(dynamodb = new AWS.DynamoDB.DocumentClient()) {
    const updateGameParams = {
      TableName: process.env.DYNAMODB_GAMES_TABLE,
      Key: {'id': this.id},
      // eslint-disable-next-line max-len
      UpdateExpression: 'set gameData = :gameData',
      ExpressionAttributeValues: {':gameData': {
        ...this,
        minesMatrix: this.minesMatrix.join(','),
        viewMatrix: this.viewMatrix.join(','),
        createdDate: this.createdDate.toISOString(),
      }},
      ReturnValues: 'UPDATED_NEW',
    };
    return dynamodb.update(updateGameParams).promise();
  }
  /**
   * insert
   * @param  {object} dynamodb
   * @return {object}
   */
  insert(dynamodb = new AWS.DynamoDB.DocumentClient()) {
    const putGameParams = {
      TableName: process.env.DYNAMODB_GAMES_TABLE,
      Item: {
        id: this.id,
        creatorId: this.creatorId,
        gameData: {
          ...this,
          minesMatrix: this.minesMatrix.join(','),
          viewMatrix: this.viewMatrix.join(','),
          createdDate: this.createdDate.toISOString(),
        },
      },
    };
    return dynamodb.put(putGameParams).promise();
  }
  /**
   * initializeMinesMatrix
   * @param {number} column
   * @param {number} row
   */
  initializeMinesMatrix(column, row) {
    const candidates = Array(this.columns * this.rows).fill(0)
        .map((_, index) => index)
        .filter((index) => index !== row * this.columns + column);
    const sample = arraySample(candidates, this.mines);
    this.minesMatrix = this.minesMatrix
        .map((_, index) => sample.indexOf(index) !== -1 ? 1 : 0);
    this.minesMatrixToNumbers();
  }
  /**
   * minesMatrixToNumbers
   */
  minesMatrixToNumbers() {
    const newMinesMatrix = this.zeroMatrix(this.columns, this.rows);
    for (let i = 0; i < this.columns; i++) {
      for (let j = 0; j < this.rows; j++) {
        const cellIndex = j * this.columns + i;
        if (this.minesMatrix[cellIndex] === 1) {
          newMinesMatrix[cellIndex] = -1;
          continue;
        }
        const iMin = i > 1 ? i - 1 : 0;
        const iMax = i < (this.columns - 1) ? i + 1 : (this.columns - 1);
        const jMin = j > 1 ? j - 1 : 0;
        const jMax = j < (this.rows - 1) ? j + 1 : (this.rows - 1);
        const iLim = Array(iMax - iMin + 1)
            .fill(0).map((_, index) => iMin + index);
        const jLim = Array(jMax - jMin + 1)
            .fill(0).map((_, index) => jMin + index);
        // eslint-disable-next-line max-len
        const ij = iLim.reduce((acc, _i) => [...acc, ...jLim.reduce((acc2, _j) => [...acc2, _j * this.columns + _i], [])], []);
        const sum = ij
            .reduce((acc, index) => acc + this.minesMatrix[index], 0);
        // console.log({i, j, iMin, iMax, jMin, jMax, iLim, jLim, ij, sum});
        newMinesMatrix[cellIndex] = sum;
      }
    }
    this.minesMatrix = newMinesMatrix;
  }
  /**
   * rightClick
   * @param {number} column
   * @param {number} row
   */
  rightClick(column, row) {
    const cellIndex = row * this.columns + column;
    if (this.viewMatrix[cellIndex] !== 2) {
      const nextCellValue = this.viewMatrix[cellIndex] === 0 ? 3 :
        (this.viewMatrix[cellIndex] === 3 ? 5 : 0);
      this.viewMatrix[cellIndex] = nextCellValue;
    }
  }
  /**
   * leftClick
   * @param {number} column
   * @param {number} row
   */
  leftClick(column, row) {
    const cellIndex = row * this.columns + column;
    if (this.viewMatrix[cellIndex] !== 2) {
      this.viewMatrix[cellIndex] = 2;
    }
  }
  /**
   * validateStatus
   */
  validateStatus() {
    const lost = this.elemetWiseProduct(this.minesMatrix, this.viewMatrix)
        .reduce((acc, item) => acc || (item < 0 && item % 2 === 0), false);
    if (lost) {
      this.won = false;
      this.ended = true;
    }
  }
  /**
   * play
   * @param {string} click
   * @param {object} cell
   */
  play({click, cell}) {
    console.log({click, cell});
    const {column, row} = cell;
    if (0 > column || column >= this.columns) {
      throw new Error(`column must be between 0 and ${this.columns}`);
    }
    if (0 > row || row >= this.rows) {
      throw new Error(`row must be between 0 and ${this.rows}`);
    }
    if (!this.initialized && click === 'left') {
      this.initializeMinesMatrix(column, row);
      this.initialized = true;
    }
    if (click === 'right') {
      this.rightClick(column, row);
    }
    if (click === 'left') {
      this.leftClick(column, row);
    }
    this.validateStatus();
  }
}

module.exports = MinesweeperGame;
