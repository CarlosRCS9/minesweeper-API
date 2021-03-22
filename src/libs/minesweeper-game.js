'use strict';

const AWS = require('aws-sdk');

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
    columns,
    rows,
    mines,
    initialized = false,
    minesMatrix = '',
    viewMatrix = '',
  }) {
    this.id = id;
    this.columns = columns;
    this.rows = rows;
    this.mines = mines;
    this.initialized = initialized;
    this.minesMatrix = this.zeroMatrix(this.columns, this.rows);
    this.viewMatrix = this.zeroMatrix(this.columns, this.rows);
  }
  /**
   * publicData
   */
  get publicData() {
    return {
      id: this.id,
      columns: this.columns,
      rows: this.rows,
      mines: this.mines,
      initialized: this.initialized,
      matrixDraw: this.stringToDraw(this.viewMatrix, this.columns),
      viewMatrix: this.stringToMatrix(this.viewMatrix, this.columns),
    };
  }
  /**
   * createMatrix
   * @param  {number} columns
   * @param  {number} rows
   * @return {string}
   */
  zeroMatrix(columns, rows) {
    return Array(columns * rows).fill(0).join('');
  }
  /**
   * stringToMatrix
   * @param  {string} string
   * @param  {number} columns
   * @return {Array.<Array.<number>>}
   */
  stringToMatrix(string, columns) {
    return string.split('')
        .reduce((rows, item, index) => {
          if (index % columns === 0) {
            rows.push([]);
          }
          rows[rows.length - 1].push(Number(item));
          return rows;
        }, []);
  }
  /**
   * stringToDraw
   * @param  {string} string
   * @param  {number} columns
   * @return {Array.<Array.<number>>}
   */
  stringToDraw(string, columns) {
    return string.split('')
        .reduce((rows, item, index) => {
          if (index % columns === 0) {
            rows.push('');
          }
          rows[rows.length - 1] += item;
          return rows;
        }, []);
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
      ExpressionAttributeValues:{':id': id},
    };
    return dynamodb.scan(scanGameParams).promise()
        .then((scanResults) => {
          if (typeof scanResults.Items !== 'undefined' &&
              scanResults.Items.length !== 1) {
            throw new Error('game not found');
          }
          return new this(scanResults.Items[0].gameData);
        });
  }
}

module.exports = MinesweeperGame;
