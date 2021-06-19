/** @format */

import { createCtx } from "../createCtx";
import { StrokeCommand } from "../lib/Stroke";

type RoomContextValue = {
  sendStroke: (strokeCommand: StrokeCommand) => void;
};

export const [useRoomContext, RoomContextProvider] =
  createCtx<RoomContextValue>();
