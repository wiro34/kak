/** @format */

import React from "react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from "react";
import { useState } from "react";
import Tooltip from "../../Tooltip/Tooltip";
import { useRoomContext } from "../../../lib/RoomService/context";
import cls from "./ToolBoard.module.scss";

/**
 * キャンバスの状態を変更するツール群ボード
 */
const ToolBoard = function () {
  const {
    roomState: { id, users },
    sendChangeVisibility,
  } = useRoomContext();
  const initialVisibility = users.find((u) => u.id === id)?.visible;
  const [visible, setVisible] = useState(initialVisibility === undefined ? true : initialVisibility);
  const toggleHideCanvas = useCallback(() => {
    setVisible(!visible);
    sendChangeVisibility(!visible);
  }, [visible, setVisible, sendChangeVisibility]);
  return (
    <div className={cls.container}>
      <Tooltip text={visible ? "非公開にする" : "公開する"}>
        <span onClick={toggleHideCanvas} className={cls.visibleIcon}>
          {visible ? (
            <FontAwesomeIcon icon={faEye} className={cls.inactive} />
          ) : (
            <FontAwesomeIcon icon={faEyeSlash} className={cls.active} />
          )}
        </span>
      </Tooltip>
    </div>
  );
};

export default ToolBoard;
