/** @format */

/**
 * レコードの TTL を計算して返します
 */
export default function getTTL(): number {
  return Math.floor(new Date().getTime() / 1000) + 30 * 60;
}
