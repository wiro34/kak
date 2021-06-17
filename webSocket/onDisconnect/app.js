const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })
const DDB = new AWS.DynamoDB({ apiVersion: '2012-10-08' })

exports.handler = function (event, context, callback) {
  const deleteParams = {
    TableName: process.env.TABLE_NAME,
    Key: {
      connectionId: { S: event.requestContext.connectionId }
    }
  }

  DDB.deleteItem(deleteParams, function (err) {
    callback(null, {
      statusCode: err ? 500 : 200,
      body: err ? 'Failed to disconnect: ' + JSON.stringify(err) : 'Disconnected.'
    })
  })
}
