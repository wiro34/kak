/** @format */

import React, { useState } from "react";
import CenteredContainer from "../CenteredContainer/CenteredContainer";
import FancyButton from "../FancyButton/FancyButton";

type Props = {
  onJoinButtonClicked: (nickname: string) => void;
};

/**
 * ルーム入室画面
 */
const RoomJoin = function ({ onJoinButtonClicked }: Props) {
  const [nickname, setNickname] = useState("");
  const onClick = () => {
    if (nickname.length > 0) {
      onJoinButtonClicked(nickname);
    }
  };

  return (
    <CenteredContainer>
      <p>ニックネームを入力してルームに参加しましょう</p>
      <div>
        <input type="text" placeholder="ニックネーム" onChange={(e) => setNickname(e.target.value)} />
      </div>
      <div>
        <FancyButton onClick={onClick}>ルームに参加する</FancyButton>
      </div>
    </CenteredContainer>
  );
};

export default RoomJoin;
