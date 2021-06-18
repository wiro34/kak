/** @format */

import { createCtx } from "../createCtx";
import RoomManager from "../lib/RoomManager";
import AppConnection from "../lib/webSocket";

type RoomContextValue = {
  roomId: string;
  connection: AppConnection;
  roomManager: RoomManager;
};

export const [useRoomContext, RoomContextProvider] =
  createCtx<RoomContextValue>();
