'use strict';

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
      viewMatrix: this.viewMatrix,
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
}

module.exports = MinesweeperGame;
