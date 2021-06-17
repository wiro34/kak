/** @format */

import React, { useState } from "react";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Tooltip from "../Tooltip/Tooltip";
import cls from "./RoomHeader.module.scss";
import { faTh, faThLarge } from "@fortawesome/free-solid-svg-icons";
import { faFlipboard } from "@fortawesome/free-brands-svg-icons";

type Props = {
  roomId: string;
  setColumnMode: (mode: "draw" | "th" | "th-large") => void;
};

/**
 * ルームページのヘッダ
 */
const RoomHeader = function ({ roomId, setColumnMode }: Props) {
  const [copied, setCopied] = useState(false);
  return (
    <header className={cls.header}>
      <div className={cls.roomId}>
        <h2>ルームID: {roomId}</h2>

        <Tooltip text={copied ? "コピーしました" : "ルームへの招待リンクをコピーする"} onHide={() => setCopied(false)}>
          <CopyToClipboard text={window.location.href} onCopy={() => setCopied(true)}>
            <FontAwesomeIcon icon={faClipboard} className={cls.copyIcon} />
          </CopyToClipboard>
        </Tooltip>
      </div>
      <div className={cls.modeIcons}>
        <Tooltip text="自分のフリップボードを拡大表示">
          <FontAwesomeIcon icon={faFlipboard} onClick={() => setColumnMode("draw")} />
        </Tooltip>
        <Tooltip text="ボードを並べて表示（大）">
          <FontAwesomeIcon icon={faThLarge} onClick={() => setColumnMode("th-large")} />
        </Tooltip>
        <Tooltip text="ボードを並べて表示（小）">
          <FontAwesomeIcon icon={faTh} onClick={() => setColumnMode("th")} />
        </Tooltip>
      </div>
    </header>
  );
};

export default RoomHeader;
