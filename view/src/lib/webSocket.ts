import Sockette from 'sockette'

export function newConnection( roomId: string, onReceivedMessage: ()=>{} ) {
  // return new Sockette(
  //   `wss://xxxxx.execute-api.ap-northeast-1.amazonaws.com/dev?roomId=${roomId}`,
  //   {
  //     timeout: 5e3,
  //     maxAttempts: 3,
  //     onmessage: (e) => onReceivedMessage(e),
  //     onerror: (e) => console.error(e),
  //   }
  // )
}
