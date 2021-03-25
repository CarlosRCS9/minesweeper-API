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
    initializedDate = new Date(),
    endedDate = new Date(),
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
    this.initializedDate = initializedDate;
    this.endedDate = endedDate;
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
      // eslint-disable-next-line max-len
      viewMatrix: this.arrayToMatrix(this.elemetWiseValidation(this.minesMatrix, this.viewMatrix), this.columns),
      createdDate: this.createdDate,
      initializedDate: this.initializedDate,
      endedDate: this.endedDate,
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
      initializedDate: this.initializedDate,
      endedDate: this.endedDate,
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
   * elemetWiseValidation
   * @param {Array.<number>} minesMatrix
   * @param {Array.<number>} viewMatrix
   * @return {Array.<number>}
   */
  elemetWiseValidation(minesMatrix, viewMatrix) {
    return minesMatrix.map((mmij, index) => {
      const vmij = viewMatrix[index];
      if (mmij === 0) {
        return vmij;
      }
      const ij = mmij * vmij;
      if (ij === 0) {
        return 0;
      }
      if (ij % 17 === 0) {
        return 17;
      }
      if (ij % 13 === 0) {
        return 13;
      }
      return ij / 11;
    });
  }
  /**
   * fromDB
   * @param {string}  id
   * @param {string}  creatorId
   * @param {object}  dynamodb
   * @return {object}
   */
  static fromDB(id, creatorId, dynamodb = new AWS.DynamoDB.DocumentClient()) {
    const scanGameParams = {
      TableName: process.env.DYNAMODB_GAMES_TABLE,
      FilterExpression: 'id = :id and creatorId = :creatorId',
      ExpressionAttributeValues: {':id': id, ':creatorId': creatorId},
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
          scanResults.Items[0].gameData.initializedDate =
            new Date(scanResults.Items[0].gameData.initializedDate);
          scanResults.Items[0].gameData.endedDate =
            new Date(scanResults.Items[0].gameData.endedDate);
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
          item.gameData.initializedDate =
            new Date(item.gameData.initializedDate);
          item.gameData.endedDate =
            new Date(item.gameData.endedDate);
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
        initializedDate: this.initializedDate.toISOString(),
        endedDate: this.endedDate.toISOString(),
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
          initializedDate: this.initializedDate.toISOString(),
          endedDate: this.endedDate.toISOString(),
        },
      },
    };
    return dynamodb.put(putGameParams).promise();
  }
  /**
   * delete
   * @param  {object} dynamodb
   * @return {object}
   */
  delete(dynamodb = new AWS.DynamoDB.DocumentClient()) {
    const deleteGameParams = {
      TableName: process.env.DYNAMODB_GAMES_TABLE,
      Key: {'id': this.id},
    };
    return dynamodb.delete(deleteGameParams).promise();
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
    if (this.viewMatrix[cellIndex] !== 11) {
      const nextCellValue = this.viewMatrix[cellIndex] === 0 ? 13 :
        (this.viewMatrix[cellIndex] === 13 ? 17 : 0);
      this.viewMatrix[cellIndex] = nextCellValue;
    }
  }
  /**
   * leftClickExtension
   * @param  {number}         cellIndex
   * @param  {Array.<number>} visited
   * @return {Array.<number>}
   */
  leftClickExtension(cellIndex, visited = []) {
    visited.push(cellIndex);
    const j = Math.floor(cellIndex / this.columns);
    const i = cellIndex - j * this.columns;
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
    const {nextij, neighbors} = ij.reduce((acc, cellIndex) => {
      if (visited.indexOf(cellIndex) === -1) {
        if (this.minesMatrix[cellIndex] === 0) {
          acc.nextij.push(cellIndex);
        } else {
          visited.push(cellIndex);
          acc.neighbors.push(cellIndex);
        }
      }
      return acc;
    }, {nextij: [], neighbors: []});
    // eslint-disable-next-line max-len
    return ij.length === 0 ? [] : [cellIndex, ...neighbors, ...nextij.reduce((acc, cellIndex) => [...acc, ...this.leftClickExtension(cellIndex, visited)], [])];
  }
  /**
   * leftClick
   * @param {number} column
   * @param {number} row
   */
  leftClick(column, row) {
    const cellIndex = row * this.columns + column;
    if (this.viewMatrix[cellIndex] !== 11) {
      this.viewMatrix[cellIndex] = 11;
      if (this.minesMatrix[cellIndex] === 0) {
        const extension = this.leftClickExtension(cellIndex);
        extension.map((cellIndex) => {
          this.viewMatrix[cellIndex] = 11;
          return cellIndex;
        });
      }
    }
  }
  /**
   * validateLoss
   */
  validateLoss() {
    if (!this.ended) {
      const lost = this.elemetWiseValidation(this.minesMatrix, this.viewMatrix)
          .reduce((acc, item) => acc || (item < 0), false);
      if (lost) {
        this.won = false;
        this.ended = true;
        this.endedDate = new Date();
        this.minesMatrix
            .reduce((acc, value, index) =>
            value === -1 ? [...acc, index] : acc, [])
            .map((index) => {
              this.viewMatrix[index] = 11;
              return index;
            });
      }
    }
  }
  /**
   * validateWin
   */
  validateWin() {
    if (!this.ended) {
      const discoveredCount = this.viewMatrix
          .reduce((acc, item) => acc + (item === 11 ? 1 : 0), 0);
      if (discoveredCount === (this.columns * this.rows - this.mines)) {
        this.won = true;
        this.ended = true;
        this.endedDate = new Date();
      }
    }
  }
  /**
   * play
   * @param {string} click
   * @param {object} cell
   */
  play({click, cell}) {
    if (!this.ended) {
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
      this.validateLoss();
      this.validateWin();
    }
  }
}

module.exports = MinesweeperGame;
