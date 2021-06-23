/** @format */

/**
 * DynamoDB に登録するデータレコード型
 */
export type Record = {
  key: string;
  id: string;
  roomId: string;
  connectionId: string;
  nickname: string;
  role: string;
  visible: boolean;
  eyeClosed: boolean;
  owner: boolean;
  strokeList: string[];
  connected: boolean;
  ttl?: number;
};

export type UserData = {
  id: string;
  nickname: string;
  strokeList: string[];
  visible: boolean;
  eyeClosed: boolean;
  connected: boolean;
};

export function convertRecordToUserData(r: Record): UserData {
  return {
    id: r.id,
    nickname: r.nickname,
    strokeList: r.strokeList,
    visible: r.visible,
    eyeClosed: r.eyeClosed,
    connected: r.connected,
  };
}

/**
 * 指定した条件に合致する要素と残りのリストを返します
 */
export function extract(records: Record[], finder: (r: Record) => boolean): [Record | undefined, Record[]] {
  let found: Record | undefined = undefined;
  const rest = records.filter((r) => {
    if (finder(r)) {
      if (found) {
        throw new Error("multiple");
      }
      found = r; // ちょっとだけ効率化
      return false;
    }
    return true;
  });
  return [found, rest];
}

/**
 * 指定した connectionId に合致する要素と残りのリストを返します
 */
export function extractByConnectionId(records: Record[], connectionId: string): [Record | undefined, Record[]] {
  return extract(records, (r) => r.connectionId === connectionId);
}
