/** @format */

import React, { useState } from "react";
import AppHeader from "../../components/AppHeader/AppHeader";
import PaintBoard from "../../components/PaintBoard/PaintBoard";
import RemoteCanvas from "../../components/RemoteCanvas/RemoteCanvas";
import AppConnection from "../../lib/webSocket";
import { RoomContextProvider } from "../../context/RoomContext";
import cls from "./Room.module.scss";
import { Coordinate, StrokeStyle } from "../../lib/Stroke";
import RoomManager from "../../lib/RoomManager";

const Room = () => {
  const roomId = "test";
  const [connection] = useState(new AppConnection(roomId));
  const [roomContext, setRoomContext] = useState({
    roomId,
    connection,
    roomManager: new RoomManager(connection),
  });
  const users = [{ name: "test1" }];

  const onDraw = (strokeStyle: StrokeStyle, coordinates: Coordinate[]) => {
    roomContext.connection.draw(strokeStyle, coordinates);
  };

  return (
    <RoomContextProvider value={roomContext}>
      <div className="App">
        <AppHeader roomId={roomId} />
        <main>
          <PaintBoard onDraw={onDraw} />
        </main>
        <section className={cls.connectedUsersPane}>
          {users.map((user) => (
            <div key={user.name}>
              <RemoteCanvas userName={user.name} width={160} height={120} />
            </div>
          ))}
        </section>
      </div>
    </RoomContextProvider>
  );
};

export default Room;
