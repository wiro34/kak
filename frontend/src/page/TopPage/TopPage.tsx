/** @format */

import React from "react";
import { useState } from "react";
import { useCallback } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";
import { useRoomContext } from "../../lib/RoomService/context";
import cls from "./TopPage.module.scss";

const TopPage = () => {
  const { createRoom } = useRoomContext();
  const [name, setName] = useState("");
  const [, setCookie] = useCookies(["nickname"]);
  const history = useHistory();
  const onClick = useCallback(async () => {
    if (name.length > 0) {
      const roomId = await createRoom(name);
      setCookie("nickname", name);
      history.push(`./room/${roomId}`);
    }
  }, [createRoom, name, setCookie, history]);

  return (
    <div className={cls.container}>
      <div className={cls.contentWindow}>
        <main className={cls.contentBody}>
          <p>フリップボードを使ってみよう</p>
          <div>
            <input type="text" placeholder="ニックネーム" onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <button className={cls.button} onClick={onClick}>
              ルームを作成する
            </button>
          </div>
        </main>
      </div>
      <footer></footer>
    </div>
  );
};

export default TopPage;
