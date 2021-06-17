/** @format */

import { useRef } from "react";

/**
 * 非同期で呼ばれるコールバックを定義するフック
 *
 * クロージャで束縛されている変数が更新されない問題を解決する
 */
export function useMutableCallback<T extends (...args: any) => any>(callback: T) {
  const ref = useRef(callback);
  ref.current = callback;
  return (...args: Parameters<T>): ReturnType<T> => ref.current && ref.current(...args);
}
