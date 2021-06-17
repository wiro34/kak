const AWS = require('aws-sdk')

const DDB = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })

const { TABLE_NAME } = process.env

exports.handler = async (event, context) => {
  const roomId = JSON.parse(event.body).roomId

  // 自分が参加しているルームの参加者のレコードを取得
  const queryParams = {
    TableName: TABLE_NAME,
    KeyConditionExpression: "#ROOMID = :ROOMID",
    ExpressionAttributeNames: { "#ROOMID": "roomId" },
    ExpressionAttributeValues: { ":ROOMID": roomId },
    IndexName: 'roomId-index'
  }
  const connectionData = await DDB.query(queryParams).promise()

  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  })

  const postData = JSON.parse(event.body).data
  const myConnectionId = event.requestContext.connectionId

  const postCalls = connectionData.Items.map(async ({ connectionId }) => {
    try {
      // 送信者には送らない
      if (myConnectionId !== connectionId) {
        await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: postData }).promise()
      }
    } catch (e) {
      if (e.statusCode === 410) {
        console.log(`Found stale connection, deleting ${connectionId}`)
        await DDB.delete({ TableName: TABLE_NAME, Key: { connectionId } }).promise()
      } else {
        throw e
      }
    }
  })

  try {
    await Promise.all(postCalls)
  } catch (e) {
    return { statusCode: 500, body: e.stack }
  }

  return { statusCode: 200, body: 'Data sent.' }
}
