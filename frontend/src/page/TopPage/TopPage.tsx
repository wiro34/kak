/** @format */

import React from "react";
import { useState } from "react";
import { useCallback } from "react";
import { useRoomContext } from "../../lib/RoomService/context";
import cls from "./TopPage.module.scss";

const TopPage = () => {
  const { connected, createRoom } = useRoomContext();
  const [name, setName] = useState("");
  const onClick = useCallback(() => {
    if (name.length > 0) {
      createRoom(name);
    }
  }, [createRoom, name]);
  return (
    <div className={cls.container}>
      <div className={cls.contentWindow}>
        <main className={cls.contentBody}>
          <p>フリップボードを使ってみよう</p>
          <div>
            <input
              type="text"
              placeholder="ニックネーム"
              onChange={(e) => setName(e.target.value)}
            />
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
