/** @format */

/**
 * WebSocket 経由でクライアントにメッセージを送信します
 *
 * @param {*} message
 * @returns
 */
export default function sendMessage(event, connectionId, message) {
  const api = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint:
      event.requestContext.domainName + "/" + event.requestContext.stage,
  });

  return api
    .postToConnection({
      ConnectionId: connectionId,
      Data: JSON.stringify(message),
    })
    .promise();
}
