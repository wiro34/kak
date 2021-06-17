/** @format */

import clsx from "clsx";
import React, { useState } from "react";
import cls from "./LongTapRemoveIcon.module.scss";

type Props = {
  onLongTap: () => void;
  className?: string;
};

/**
 * 長押しで発火するゴミ箱アイコン
 */
const LongTapRemoveIcon = function ({ className, onLongTap }: Props) {
  const [charged, setCharged] = useState(false);
  const [timerID, setTimerID] = useState<NodeJS.Timeout>();

  const onMouseDown = () => {
    setCharged(false);
    const id = setTimeout(() => {
      setCharged(true);
    }, 500);
    setTimerID(id);
  };

  const onMouseUp = () => {
    if (charged) {
      onLongTap();
    }
    reset();
  };

  const reset = () => {
    if (timerID) {
      clearTimeout(timerID);
    }
    setTimerID(undefined);
  };

  return (
    // eslint-disable-next-line
    <a className={clsx(className, cls.longTapIcon)}>
      <span className={cls.smoothIcon} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={reset}>
        <i className="fas fa-trash"></i>
      </span>
    </a>
  );
};

export default LongTapRemoveIcon;
