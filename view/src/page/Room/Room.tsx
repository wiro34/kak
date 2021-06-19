/** @format */

import React from "react";
import AppHeader from "../../components/AppHeader/AppHeader";
import PaintBoard from "../../components/PaintBoard/PaintBoard";
import RemoteCanvas from "../../components/RemoteCanvas/RemoteCanvas";
import useRoomService, { RoomContextProvider } from "../../hooks/RoomService";
import cls from "./Room.module.scss";

const Room = () => {
  const roomId = "test";
  const context = useRoomService(roomId);
  const { users } = context;
  // const [connection] = useState(new AppConnection(roomId));
  // const [roomContext, setRoomContext] = useState({
  //   roomId,
  //   connection,
  //   roomManager: new RoomManager(connection),
  // });
  console.log("Room", users);

  return (
    <RoomContextProvider value={context}>
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
                visible={user.visible}
              />
            </div>
          ))}
        </section>
      </div>
    </RoomContextProvider>
  );
};

export default Room;
