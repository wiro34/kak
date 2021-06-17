/** @format */

import { createCtx } from "../../hooks/createCtx";
import { RoomServiceResponse } from "./RoomService";

export const [useRoomContext, RoomContextProvider] =
  createCtx<RoomServiceResponse>();
