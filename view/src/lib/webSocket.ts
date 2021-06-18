/** @format */

import Sockette from "sockette";
import { Coordinate, StrokeStyle } from "./Stroke";

const WS_API_URL = "wss://cli1k523zd.execute-api.us-east-2.amazonaws.com/dev";
const WS_TIMEOUT = 5e3;
const WS_MAX_ATTEMPTS = 3;

export default class AppConnection {
  // private sockette: Sockette;

  // stub

  constructor(roomId: string) {
    // this.sockette = new Sockette(`?roomId=${roomId}`, {
    //   timeout: WS_TIMEOUT,
    //   maxAttempts: WS_MAX_ATTEMPTS,
    //   onmessage: (e: any) => this.onReceiveMessage(e),
    //   onopen: (e) => console.log("Connected!", e),
    //   onclose: (e: any) => console.log(e),
    //   onerror: (e: any) => console.error(e),
    // });
  }

  private onReceiveMessage(e: any) {}

  draw(strokeStyle: StrokeStyle, coordinates: Coordinate[]) {
    // TODO: バッファリング
  }
}

// export function newConnection(
//   roomId: string,
//   onReceivedMessage: (e: any) => void
// ): Sockette {
//   return new Sockette(`?roomId=${roomId}`, {
//     timeout: WS_TIMEOUT,
//     maxAttempts: WS_MAX_ATTEMPTS,
//     onmessage: (e: any) => onReceivedMessage(e),
//     onopen: (e) => console.log("Connected!", e),
//     onclose: (e: any) => console.log(e),
//     onerror: (e: any) => console.error(e),
//   });
// }
