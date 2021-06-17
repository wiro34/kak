const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })
const DDB = new AWS.DynamoDB({ apiVersion: '2012-10-08' })

exports.handler = function (event, context, callback) {
  let roomId = ''
  if (event.queryStringParameters && event.queryStringParameters.roomId) {
    roomId = event.queryStringParameters.roomId
  }

  const putParams = {
    TableName: process.env.TABLE_NAME,
    Item: {
      connectionId: { S: event.requestContext.connectionId },
      roomId: { S: roomId }
    }
  }

  DDB.putItem(putParams, function (err) {
    callback(null, {
      statusCode: err ? 500 : 200,
      body: err ? 'Failed to connect: ' + JSON.stringify(err) : 'Connected.'
    })
  })
}
