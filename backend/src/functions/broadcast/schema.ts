/** @format */

type SendMessagePayload =
  | { roomId: string; type: "draw"; data: { nickname: string; strokeCommand: string } }
  | { roomId: string; type: "clear"; data: { nickname: string } }
  | { roomId: string; type: "changeVisibility"; data: { nickname: string; visible: boolean } };

type Schema = {
  message: "sendMessage";
  payload: SendMessagePayload;
};

export default Schema;
