/** @format */

import React from "react";
import { faTrash, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from "../Tooltip/Tooltip";
import cls from "./CommandBoard.module.scss";

const COMMANDS = [
  { command: "undo", icon: faUndo, tooltip: "元に戻す（Ctrl+Z）" },
  { command: "clear", icon: faTrash, tooltip: "キャンバスをクリア（元に戻せません！）" },
];

type Props = {
  onCommand: (command: string) => void;
};

const CommandBoard = function ({ onCommand }: Props) {
  return (
    <div className={cls.commandBoard}>
      {COMMANDS.map(({ command, icon, tooltip }) => (
        <span key={command} onClick={() => onCommand(command)}>
          <Tooltip text={tooltip}>
            <FontAwesomeIcon icon={icon} />
          </Tooltip>
        </span>
      ))}
    </div>
  );
};

export default CommandBoard;
