/** @format */

import { throws } from "assert";
import { Stroke } from "./Stroke";
import AppConnection from "./webSocket";

/**
 * 各ユーザのボード状態を管理するマネージャ
 */
export default class RoomManager {
  myBoard: Stroke[];
  otherBoards: Stroke[][];

  constructor(private readonly connection: AppConnection) {
    this.myBoard = [];
    this.otherBoards = [];
  }

  undo() {
    this.myBoard.pop();
  }

  commitDrawMyBoard(stroke: Stroke) {
    this.myBoard.push(stroke);
  }
}
