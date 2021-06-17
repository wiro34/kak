import Sockette from "sockette";

export function newConnection(roomId: string, onReceivedMessage: (e: any) => void): Sockette {
  return new Sockette(`wss://cli1k523zd.execute-api.us-east-2.amazonaws.com/dev?roomId=${roomId}`, {
    timeout: 5e3,
    maxAttempts: 3,
    onmessage: (e: any) => onReceivedMessage(e),
    onopen: (e) => console.log("Connected!", e),
    onclose: (e: any) => console.log(e),
    onerror: (e: any) => console.error(e),
  });
}
