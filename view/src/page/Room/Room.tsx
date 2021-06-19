/** @format */

import React from "react";
import AppHeader from "../../components/AppHeader/AppHeader";
import PaintBoard from "../../components/PaintBoard/PaintBoard";
import RemoteCanvas from "../../components/RemoteCanvas/RemoteCanvas";
import { RoomContextProvider } from "../../context/RoomContext";
import cls from "./Room.module.scss";
import useRoomService from "../../lib/RoomService";

const Room = () => {
  const roomId = "test";
  const { users, sendStroke } = useRoomService(roomId);
  // const [connection] = useState(new AppConnection(roomId));
  // const [roomContext, setRoomContext] = useState({
  //   roomId,
  //   connection,
  //   roomManager: new RoomManager(connection),
  // });

  return (
    <RoomContextProvider value={{ sendStroke }}>
      <div className="App">
        <AppHeader roomId={roomId} />
        <main>
          <PaintBoard />
        </main>
        <section className={cls.connectedUsersPane}>
          {users.map((user) => (
            <div key={user.name}>
              <RemoteCanvas
                userName={user.name}
                strokeList={user.strokeList}
                width={640}
                height={480}
              />
            </div>
          ))}
        </section>
      </div>
    </RoomContextProvider>
  );
};

export default Room;
