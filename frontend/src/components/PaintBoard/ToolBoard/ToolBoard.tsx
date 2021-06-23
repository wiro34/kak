/** @format */

import React from "react";
import { faBed, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
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
    sendChangeEyeClosed,
  } = useRoomContext();
  const myData = users.find((u) => u.id === id);
  const [visible, setVisible] = useState(myData ? myData.visible : true);
  const [eyeClosed, setEyeClosed] = useState(myData ? myData.eyeClosed : true);

  const toggleHideCanvas = useCallback(() => {
    setVisible(!visible);
    sendChangeVisibility(!visible);
  }, [visible, setVisible, sendChangeVisibility]);

  const toggleEyeClosed = useCallback(() => {
    setEyeClosed(!eyeClosed);
    sendChangeEyeClosed(!eyeClosed);
  }, [eyeClosed, setEyeClosed, sendChangeEyeClosed]);

  return (
    <div className={cls.container}>
      <span onClick={toggleEyeClosed} className={cls.visibleIcon}>
        <Tooltip text={eyeClosed ? "起きる（ボードを見る）" : "寝る（みんなのボードを見ない）"}>
          {eyeClosed ? (
            <FontAwesomeIcon icon={faBed} className={cls.active} />
          ) : (
            <FontAwesomeIcon icon={faBed} className={cls.inactive} />
          )}
        </Tooltip>
      </span>
      <span onClick={toggleHideCanvas} className={cls.visibleIcon}>
        <Tooltip text={visible ? "非公開にする" : "公開する"}>
          {visible ? (
            <FontAwesomeIcon icon={faEye} className={cls.inactive} />
          ) : (
            <FontAwesomeIcon icon={faEyeSlash} className={cls.active} />
          )}
        </Tooltip>
      </span>
    </div>
  );
};

export default ToolBoard;
