/** @format */

import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { StaticContext, Redirect } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import RoomHeader from "../../components/RoomHeader/RoomHeader";
import CenteredContainer from "../../components/CenteredContainer/CenteredContainer";
import PaintBoard from "../../components/PaintBoard/PaintBoard";
import RemoteCanvas from "../../components/RemoteCanvas/RemoteCanvas";
import RoomJoin from "../../components/RoomJoin/RoomJoin";
import { RoomContextProvider } from "../../lib/RoomService/context";
import { useRoomService } from "../../lib/RoomService/RoomService";
import cls from "./Room.module.scss";
import clsx from "clsx";

type PathParams = { roomId: string };
type LocationState = { mode: "createRoom" | undefined };
type Props = RouteComponentProps<PathParams, StaticContext, LocationState>;

/**
 * ルームページ
 */
const Room = ({ match, location }: Props) => {
  const roomId = match.params.roomId;
  const [cookies, setCookie] = useCookies(["nickname"]);
  const [nicknameInput, setNicknameInput] = useState<string | undefined>(cookies.nickname);
  const [columnMode, setColumnMode] = useState<"draw" | "th" | "th-large">("draw");
  const [errorMessage, setErrorMessage] = useState<string>();
  const roomService = useRoomService(roomId);
  const {
    connected,
    error,
    roomState: { id, roomJoined, users },
    createRoom,
    joinRoom,
  } = roomService;

  useEffect(() => {
    if (!connected || !nicknameInput || roomJoined) {
      return;
    }

    (async () => {
      try {
        if (location.state && location.state.mode === "createRoom") {
          await createRoom(nicknameInput);
        } else {
          await joinRoom(nicknameInput);
        }
      } catch (e) {
        if (e === "roomAlreadyUsed") {
          setErrorMessage("ルームを作成できませんでした");
        } else if (e === "roomNotFound") {
          setErrorMessage("ルームが見つかりませんでした");
        } else {
          console.error(e);
          setErrorMessage("不明なエラーが発生しました");
        }
      }
    })();
  }, [location, connected, nicknameInput, roomJoined, createRoom, joinRoom, setErrorMessage]);

  if (!roomId) {
    return <Redirect to="/" />;
  }

  if (error) {
    return (
      <CenteredContainer>
        <p>{error}</p>
      </CenteredContainer>
    );
  }

  if (errorMessage) {
    return (
      <CenteredContainer>
        <p>{errorMessage}</p>
      </CenteredContainer>
    );
  }

  if (!nicknameInput) {
    const onJoinButtonClicked = (nickname: string) => {
      setNicknameInput(nickname);
      setCookie("nickname", nickname);
    };
    return <RoomJoin onJoinButtonClicked={onJoinButtonClicked} />;
  }

  if (!roomJoined) {
    return <div className="notify-message">ルームを読み込み中…</div>;
  }

  const myData = users.find((user) => user.id === id);
  const others = users.filter((user) => user.id !== id);

  // 表示状態に応じてキャンバスサイズを調整
  const remoteCanvasScale = columnMode === "draw" ? 0.5 : columnMode === "th-large" ? 0.875 : 0.625;
  const remoteCanvasWidth = 640 * remoteCanvasScale;
  const remoteCanvasHeight = 480 * remoteCanvasScale;
  const paintBoardWrapperClassName =
    columnMode === "draw" ? cls.pb_draw : columnMode === "th-large" ? cls.pb_ThLarge : cls.pb_Th;

  const eyeClosed = myData ? myData.eyeClosed : false;

  return (
    <RoomContextProvider value={roomService}>
      <RoomHeader roomId={roomId} setColumnMode={setColumnMode} />
      <main className={cls.canvasAlignment}>
        <div className={clsx(cls.paintBoardWrapper, paintBoardWrapperClassName)}>
          <PaintBoard className={cls.paintBoard} />
        </div>
        {others.map((user) => (
          <div
            key={user.nickname}
            className={cls.remoteCanvas}
            style={{ width: remoteCanvasWidth, height: remoteCanvasHeight }}
          >
            <RemoteCanvas
              key={user.nickname}
              userName={user.nickname}
              strokeList={user.strokeList}
              width={remoteCanvasWidth}
              height={remoteCanvasHeight}
              visible={user.visible}
              eyeClosed={user.eyeClosed}
              grayout={eyeClosed}
              connected={user.connected}
            />
          </div>
        ))}
      </main>
    </RoomContextProvider>
  );
};

export default Room;
