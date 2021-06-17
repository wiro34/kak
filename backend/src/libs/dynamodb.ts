/** @format */

import { DynamoDB } from "aws-sdk";
import { Record } from "./models";
import getTTL from "./ttl";

const { TABLE_NAME } = process.env;

export const dynamodb = process.env.IS_OFFLINE
  ? new DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:8000",
    })
  : new DynamoDB.DocumentClient();

/**
 * 指定したキーのレコードを取得します
 */
export async function getRecord(key: string, id: string): Promise<Record> {
  const res = await dynamodb
    .get({
      TableName: TABLE_NAME,
      Key: { key, id },
    })
    .promise();
  if (!res.Item) {
    throw new Error("No such record");
  }
  return res.Item as Record;
}

/**
 * 指定したレコードを作成します
 */
export async function putRecord(record: Partial<Record>): Promise<void> {
  const ttl = record.ttl || getTTL();
  const putParams = {
    TableName: TABLE_NAME,
    Item: { ...record, ttl },
  };
  await dynamodb.put(putParams).promise();
}

/**
 * 指定した条件でクエリを実行して結果を取得します
 */
export async function queryRecord(
  params: Omit<DynamoDB.DocumentClient.QueryInput, "TableName">
): Promise<Record[] | undefined> {
  // 件数は多くならない想定なので paging は省略
  const res = await dynamodb.query({ ...params, TableName: TABLE_NAME }).promise();
  if (res.Items) {
    return res.Items.map((item) => item as Record);
  } else {
    return undefined;
  }
}

/**
 * 指定したキーのレコードを削除します
 */
export async function deleteRecord(key: string, id: string): Promise<void> {
  await dynamodb
    .delete({
      TableName: TABLE_NAME,
      Key: { key, id },
    })
    .promise();
}

/**
 * 指定したキーのレコードを更新します
 */
export async function updateRecord(key: string, id: string, partial: Partial<Record>): Promise<void> {
  const keys = Object.keys(partial);
  const ExpressionAttributeNames = keys.reduce((o, key) => ({ ...o, [`#${key}`]: key }), {});
  const ExpressionAttributeValues = keys.reduce((o, key) => ({ ...o, [`:${key}`]: partial[key] }), {});
  const params = {
    TableName: TABLE_NAME,
    Key: { key, id },
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    UpdateExpression: "SET " + keys.map((key) => `#${key} = :${key}`).join(", "),
  };
  await dynamodb.update(params).promise();
}
