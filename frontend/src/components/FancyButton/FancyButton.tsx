/** @format */

import React from "react";
import cls from "./FancyButton.module.scss";

type Props = {
  children: React.ReactNode;
  onClick: () => void;
};

/**
 * ルーム作成などのちょっと大きいボタン
 */
const FancyButton = ({ children, onClick }: Props) => {
  return (
    <button className={cls.button} onClick={onClick}>
      {children}
    </button>
  );
};

export default FancyButton;
