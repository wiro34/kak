/** @format */

import React from "react";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from "react";
import { useState } from "react";
import Tooltip from "../Tooltip/Tooltip";
import { useRoomContext } from "../../hooks/RoomService";
import cls from "./OverlayToolbar.module.scss";

type Props = {};

const OverlayToolbar = function ({}: Props) {
  const { changeVisibility } = useRoomContext();
  const [visible, setVisible] = useState(true);
  const toggleHideCanvas = useCallback(() => {
    setVisible(!visible);
    changeVisibility(!visible);
  }, [visible, setVisible, changeVisibility]);
  return (
    <div className={cls.container}>
      <Tooltip text={visible ? "非公開にする" : "公開する"}>
        <span onClick={toggleHideCanvas} className={cls.iconButton}>
          <FontAwesomeIcon
            icon={faEyeSlash}
            className={visible ? cls.inactive : cls.active}
          />
        </span>
      </Tooltip>
    </div>
  );
};

export default OverlayToolbar;
