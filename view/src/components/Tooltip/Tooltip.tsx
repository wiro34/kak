/** @format */

import React from "react";
import cls from "./Tooltip.module.scss";

type Props = {
  /** ツールチップテキスト */
  text: string;
  children?: React.ReactNode;
};

/**
 * カーソルを重ねたときに表示するツールチップ
 */
const Tooltip = ({ text, children }: Props) => {
  return (
    <span className={cls.tooltip}>
      <span className={cls.tooltipText}>{text}</span>
      {children}
    </span>
  );
};

export default Tooltip;
