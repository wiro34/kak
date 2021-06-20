/** @format */

import { DynamoDB } from "aws-sdk";

export const dynamodb = process.env.IS_OFFLINE
  ? new DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:8000",
    })
  : new DynamoDB.DocumentClient();
