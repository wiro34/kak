/** @format */

import React from "react";
import cls from "./Tooltip.module.scss";

type Props = {
  /** ツールチップテキスト */
  text: string;
  onShow?: () => void;
  onHide?: () => void;
  children?: React.ReactNode;
};

/**
 * カーソルを重ねたときに表示するツールチップ
 */
const Tooltip = ({ text, onShow, onHide, children }: Props) => {
  const waitAnimation = (fn?: () => void) => {
    if (fn) {
      return () => {
        // ツールチップが消えるまで遅延
        setTimeout(fn, 300);
      };
    }
    return fn;
  };
  return (
    <span className={cls.tooltip} onMouseEnter={onShow} onMouseLeave={waitAnimation(onHide)}>
      <span className={cls.tooltipText}>{text}</span>
      {children}
    </span>
  );
};

export default Tooltip;
