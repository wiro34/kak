/** @format */

import type { AWS } from "@serverless/typescript";

import onConnect from "@functions/onConnect";
import onDisconnect from "@functions/onDisconnect";
import createRoom from "@functions/createRoom";
import joinRoom from "@functions/joinRoom";
import broadcast from "@functions/broadcast";

const serverlessConfiguration: AWS = {
  service: "kak-backend",
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },

    // for local running
    dynamodb: {
      stages: ["dev"],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
        seed: false,
      },
    },
  },
  plugins: ["serverless-webpack", "serverless-dynamodb-local", "serverless-offline"],
  provider: {
    name: "aws",
    region: "us-east-2",
    runtime: "nodejs14.x",
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:Query", "dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:DeleteItem"],
        Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/${self:service}-connections-${self:provider.stage}",
      },
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      TABLE_NAME: "${self:service}-connections-${self:provider.stage}",
    },
    websocketsApiName: "${self:service}-${self:provider.stage}",
    websocketsApiRouteSelectionExpression: "$request.body.message",
    lambdaHashingVersion: "20201221",
  },

  // import the function via paths
  functions: { onConnect, onDisconnect, createRoom, joinRoom, broadcast },

  resources: {
    Resources: {
      KaKConnectionsTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:service}-connections-${self:provider.stage}",
          AttributeDefinitions: [
            { AttributeName: "key", AttributeType: "S" },
            { AttributeName: "id", AttributeType: "S" },
          ],
          KeySchema: [
            { AttributeName: "key", KeyType: "HASH" },
            { AttributeName: "id", KeyType: "RANGE" },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },

          TimeToLiveSpecification: {
            AttributeName: "ttl",
            Enabled: true,
          },
          SSESpecification: {
            SSEEnabled: false,
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
