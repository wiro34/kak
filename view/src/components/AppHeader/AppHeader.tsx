/** @format */

import React from "react";
import cls from "./AppHeader.module.scss";

type Props = {
  roomId: string;
};

const AppHeader = function ({ roomId }: Props) {
  return (
    <header className={cls.header}>
      <h2 className={cls.roomId}>ルームID: {roomId}</h2>
    </header>
  );
};

export default AppHeader;
