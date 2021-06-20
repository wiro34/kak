/** @format */

import React from "react";
import cls from "./CenteredContainer.module.scss";

type Props = {
  children: React.ReactNode;
};

/**
 * ルーム作成など画面中央に表示するためのコンテナコンポーネント
 */
const CenteredContainer = ({ children }: Props) => {
  return (
    <div className={cls.container}>
      <div className={cls.contentWindow}>
        <div className={cls.contentBody}>{children}</div>
      </div>
    </div>
  );
};

export default CenteredContainer;
