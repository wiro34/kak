/** @format */

import type { AWS } from "@serverless/typescript";

import createRoom from "@functions/createRoom";

const serverlessConfiguration: AWS = {
  service: "kak-backend",
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  plugins: ["serverless-webpack"],
  provider: {
    name: "aws",
    region: "us-east-2",
    runtime: "nodejs14.x",
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:Query", "dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:DeleteItem"],
        Resource:
          "arn:aws:dynamodb:${self:provider.region}:*:table/${self:service}-connections-${self:provider.stage}/index/*",
      },
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      TABLE_NAME: { Ref: "KaKConnectionsTable" },
    },
    websocketsApiName: "${self:service}-${self:provider.stage}",
    websocketsApiRouteSelectionExpression: "$request.body.message",
    lambdaHashingVersion: "20201221",
  },

  // import the function via paths
  functions: { createRoom },

  resources: {
    Resources: {
      KaKConnectionsTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${self:service}-connections-${self:provider.stage}",
          AttributeDefinitions: [{ AttributeName: "key", AttributeType: "S" }],
          KeySchema: [{ AttributeName: "key", KeyType: "HASH" }],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
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
