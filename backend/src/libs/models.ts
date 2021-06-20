/**
 * DynamoDB に登録するデータレコード型
 *
 * @format
 */

export type RoomData = {
  roomId: string;
  nickname: string;
  connectionId: string;
  ip: string;
  role: "owner" | "dealer" | "user";
  visible: boolean;
  strokeList: string[];
};
