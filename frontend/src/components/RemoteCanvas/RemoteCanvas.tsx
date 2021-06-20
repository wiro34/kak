/** @format */

import React, { useRef } from "react";
import cls from "./RemoteCanvas.module.scss";
import { Stroke } from "../../lib/Stroke";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

type Props = {
  userName: string;
  strokeList: Stroke[];
  width: number;
  height: number;
  visible: boolean;
};

/**
 * 他ユーザの内容を表示する Canvas
 */
const RemoteCanvas = function ({ userName, strokeList, width, height, visible }: Props) {
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
    <div className={cls.container}>
      <span className={cls.userName}>{userName}</span>
      <canvas tabIndex={1} width={width} height={height} ref={canvasRef} className={cls.canvas}></canvas>
      <div
        className={clsx({
          [cls.hiddenOverlay]: true,
          [cls.hiddenOverlayActive]: !visible,
        })}
      >
        <FontAwesomeIcon icon={faEyeSlash} />
      </div>
    </div>
  );
};

export default RemoteCanvas;
