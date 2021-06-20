/** @format */

type SendMessagePayload =
  | { roomId: string; type: "connect"; data: { nickname: string } }
  | { roomId: string; type: "disconnect"; data: { nickname: string } }
  | { roomId: string; type: "createRoom"; data: { nickname: string } }
  | { roomId: string; type: "draw"; data: { nickname: string; strokeCommand: string } }
  | { roomId: string; type: "changeVisibility"; data: { nickname: string; visible: boolean } };

type Schema = {
  message: "sendMessage";
  payload: SendMessagePayload;
};

export default Schema;
