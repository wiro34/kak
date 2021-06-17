/** @format */

import { createHash } from "crypto";

/**
 * ユーザを特定する一意なコードを生成します
 */
export default function makeIdentity(nickname: string, ip: string): string {
  const shasum = createHash("sha1");
  shasum.update(`${nickname}:${ip}`);
  return shasum.digest("hex");
}
