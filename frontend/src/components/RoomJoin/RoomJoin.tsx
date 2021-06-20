/** @format */

import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useRoomContext } from "../../lib/RoomService/context";
import CenteredContainer from "../CenteredContainer/CenteredContainer";
import FancyButton from "../FancyButton/FancyButton";

type Props = { roomId: string };

const RoomJoin = function ({ roomId }: Props) {
  const { joinRoom } = useRoomContext();
  const [, setCookie] = useCookies(["nickname"]);
  const [error, setError] = useState<string>();

  const [name, setName] = useState("");
  const onClick = async () => {
    try {
      await joinRoom(name, roomId);
      setCookie("nickname", name);
    } catch (e) {
      if (e === "roomNotFound") {
        setError("ルームが見つかりませんでした");
      } else {
        console.error(e);
      }
    }
  };

  if (error) {
    return (
      <CenteredContainer>
        <p>{error}</p>
      </CenteredContainer>
    );
  }

  return (
    <CenteredContainer>
      <p>ニックネームを入力してルームに参加しましょう</p>
      <div>
        <input type="text" placeholder="ニックネーム" onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <FancyButton onClick={onClick}>ルームに参加する</FancyButton>
      </div>
    </CenteredContainer>
  );
};

export default RoomJoin;
