/** @format */

import { faBed, faEyeSlash, faFileSignature, faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import { Stroke } from "../../lib/Stroke";
import FixedCanvas from "../FixedCanvas/FixedCanvas";
import cls from "./RemoteCanvas.module.scss";

type Props = {
  userName: string;
  strokeList: Stroke[];
  width: number;
  height: number;
  visible: boolean;
  connected: boolean;
  eyeClosed: boolean;
  grayout: boolean;
  className?: string;
};

/**
 * 他ユーザの内容を表示する Canvas
 */
const RemoteCanvas = function ({
  userName,
  strokeList,
  width,
  height,
  visible,
  connected,
  eyeClosed,
  grayout,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas: HTMLCanvasElement = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        if (visible) {
          strokeList.forEach((stroke) => {
            if (!stroke) {
              return;
            }
            context.strokeStyle = stroke.style.color.code;
            context.lineJoin = "round";
            context.lineWidth = stroke.style.brush.width;

            for (let i = 1; i < stroke.path.length; i++) {
              context.beginPath();
              context.moveTo(stroke.path[i - 1].x, stroke.path[i - 1].y);
              context.lineTo(stroke.path[i].x, stroke.path[i].y);
              context.closePath();
              context.stroke();
            }
          });
        }
      }
    }
  });

  return (
    <div className={clsx(cls.container, className)}>
      <FixedCanvas width={width} height={height} ref={canvasRef} className={cls.canvas} />
      <div className={cls.userName}>{userName}</div>
      {!connected ? (
        <div className={clsx(cls.overlay, cls.overlayActive, cls.disconnected)}>
          <FontAwesomeIcon icon={faUserSlash} />
        </div>
      ) : !visible ? (
        <div className={clsx(cls.overlay, cls.overlayActive, cls.hide)}>
          <FontAwesomeIcon icon={faEyeSlash} />
        </div>
      ) : eyeClosed ? (
        <div className={clsx(cls.overlay, cls.overlayActive, cls.eyeClosed)}>
          <FontAwesomeIcon icon={faBed} />
        </div>
      ) : grayout ? (
        <div className={clsx(cls.overlay, cls.overlayActive, cls.grayout)}>
          <FontAwesomeIcon icon={faFileSignature} />
        </div>
      ) : undefined}
    </div>
  );
};

export default RemoteCanvas;
