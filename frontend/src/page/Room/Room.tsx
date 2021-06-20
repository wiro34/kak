/** @format */

import React from "react";
import { RouteComponentProps } from "react-router-dom";
import AppHeader from "../../components/AppHeader/AppHeader";
import PaintBoard from "../../components/PaintBoard/PaintBoard";
import RemoteCanvas from "../../components/RemoteCanvas/RemoteCanvas";
import { useRoomContext } from "../../lib/RoomService/context";
import { useCookies } from "react-cookie";
import cls from "./Room.module.scss";
import RoomJoin from "../../components/RoomJoin/RoomJoin";
import { useEffect } from "react";

type PathParams = { roomId: string };
type Props = RouteComponentProps<PathParams>;

const Room = ({ match }: Props) => {
  const {
    connected,
    roomState: { roomId, name, users },
    joinRoom,
  } = useRoomContext();
  const [cookies] = useCookies(["nickname"]);

  useEffect(() => {
    (async () => {
      if (connected && !roomId) {
        if (cookies.nickname) {
          await joinRoom(cookies.nickname, match.params.roomId);
        }
      }
    })();
  }, [connected, roomId, name, cookies.nickname, joinRoom, match.params.roomId]);

  if (!roomId) {
    if (!cookies.nickname) {
      return <RoomJoin roomId={match.params.roomId} />;
    }
    return <div className="notify-message">ルームを読み込み中…</div>;
  }

  const others = users.filter((user) => user.name !== name);
  return (
    <div>
      <AppHeader roomId={roomId} />
      <main>
        <PaintBoard />
      </main>
      <section className={cls.connectedUsersPanel}>
        {others.map((user) => (
          <div key={user.name}>
            <RemoteCanvas
              userName={user.name}
              strokeList={user.strokeList}
              width={640}
              height={480}
              visible={user.visible}
            />
          </div>
        ))}
      </section>
    </div>
  );
};

export default Room;
