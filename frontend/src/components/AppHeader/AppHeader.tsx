/** @format */

import React, { useState } from "react";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Tooltip from "../Tooltip/Tooltip";
import cls from "./AppHeader.module.scss";

type Props = {
  roomId: string;
};

const AppHeader = function ({ roomId }: Props) {
  const [copied, setCopied] = useState(false);
  return (
    <header className={cls.header}>
      <h2 className={cls.roomId}>ルームID: {roomId}</h2>
      <div className={cls.copyIcon}>
        <CopyToClipboard text={window.location.href} onCopy={() => setCopied(true)}>
          <div>
            <Tooltip
              text={copied ? "コピーしました" : "ルームへの招待リンクをコピーする"}
              onHide={() => setCopied(false)}
            >
              <FontAwesomeIcon icon={faClipboard} />
            </Tooltip>
          </div>
        </CopyToClipboard>
      </div>
    </header>
  );
};

export default AppHeader;
