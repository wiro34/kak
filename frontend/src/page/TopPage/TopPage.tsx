/** @format */

import React, { useState } from "react";
import { useCallback } from "react";
import { useCookies } from "react-cookie";
import { Redirect } from "react-router-dom";
import cls from "./TopPage.module.scss";

/**
 * ルーム作成ページ
 */
const TopPage = () => {
  const [name, setName] = useState("");
  const [, setCookie] = useCookies(["nickname"]);
  const [roomId, setRoomId] = useState<string>();
  const onClick = useCallback(async () => {
    if (name.length > 0) {
      // ルームIDはとりあえず適当なものを作成
      setRoomId(Math.random().toString(32).substring(2));
      setCookie("nickname", name);
    }
  }, [name, setCookie]);

  if (roomId) {
    return <Redirect push to={{ pathname: `/room/${roomId}`, state: { mode: "createRoom" } }} />;
  }

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
