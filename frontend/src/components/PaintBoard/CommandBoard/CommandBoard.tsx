/** @format */

import React from "react";
import { faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from "../../Tooltip/Tooltip";
import cls from "./CommandBoard.module.scss";
import LongTapRemoveIcon from "./LongTapRemoveIcon";

type Props = {
  onCommand: (command: string) => void;
};

/**
 * 描画関連のコマンドボード
 */
const CommandBoard = function ({ onCommand }: Props) {
  return (
    <div className={cls.commandBoard}>
      <span onClick={() => onCommand("undo")}>
        <Tooltip text="元に戻す（Ctrl+Z）">
          <FontAwesomeIcon icon={faUndo} className={cls.commandIcon} />
        </Tooltip>
      </span>
      <span>
        <Tooltip text="長押しでキャンバスをクリア（元に戻せません！）">
          <LongTapRemoveIcon className={cls.commandIcon} onLongTap={() => onCommand("clear")} />
        </Tooltip>
      </span>
    </div>
  );
};

export default CommandBoard;
