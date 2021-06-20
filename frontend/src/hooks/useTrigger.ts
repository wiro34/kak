/** @format */

import { useEffect, useState } from "react";
import { useMutableCallback } from "./useMutableCallback";

type TriggerFunction = () => void;

type Trigger = {
  (): void;
  counter: number;
  subscribe: (f: TriggerFunction) => void;
  unsubscribe: (f: TriggerFunction) => void;
};

/**
 * コンポーネントを外部から操作するためのトリガを作成します
 */
export function createTrigger(): Trigger {
  let subscribers: TriggerFunction[] = [];

  const trigger = () => {
    subscribers.forEach((subscriber) => subscriber());
  };

  return Object.assign(trigger, {
    counter: 0,
    subscribe: (f: TriggerFunction) => {
      subscribers.push(f);
    },
    unsubscribe: (f: TriggerFunction) => {
      subscribers = subscribers.filter((fn) => fn !== f);
    },
  });
}

/**
 * トリガの参照を取得する
 */
export default function useTrigger(trigger: Trigger) {
  const [counter, setCounter] = useState(trigger.counter);

  const fire = useMutableCallback(() => {
    trigger.counter = counter + 1;
    setCounter(counter + 1);
  });

  useEffect(function () {
    trigger.subscribe(fire);
    return function () {
      return trigger.unsubscribe(fire);
    };
    // eslint-disable-next-line
  }, []);

  return counter;
}

/**
 * トリガが発火したときのコールバックを設定します
 */
export function useTriggerEffect(callback: () => void, trigger: Trigger) {
  const triggerValue = useTrigger(trigger);

  useEffect(() => {
    // Do not run on mount
    if (triggerValue > 0) {
      callback();
    }
  }, [callback, triggerValue]);
}
