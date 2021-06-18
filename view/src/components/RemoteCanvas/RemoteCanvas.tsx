/** @format */

import React, { useCallback, useEffect, useRef, useState } from "react";
import cls from "./RemoteCanvas.module.scss";
import { Coordinate, Stroke, StrokeStyle } from "../../lib/Stroke";

type Props = {
  userName: string;
  width: number;
  height: number;
};

/**
 *  Canvas
 */
const RemoteCanvas = function ({ userName, width, height }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokeList, setStrokeList] = useState<Stroke[]>([]);

  const refleshCanvas = useCallback(
    (currentStroke?: Stroke) => {
      if (!canvasRef.current) {
        return;
      }
      const canvas: HTMLCanvasElement = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) {
        return;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);

      [...strokeList, currentStroke].forEach((stroke) => {
        if (!stroke) {
          return;
        }
        context.imageSmoothingEnabled = false;
        context.strokeStyle = stroke.strokeStyle.color.code;
        context.lineJoin = "round";
        context.lineWidth = stroke.strokeStyle.brush.width;

        for (let i = 1; i < stroke.path.length; i++) {
          context.beginPath();
          context.moveTo(stroke.path[i - 1].x, stroke.path[i - 1].y);
          context.lineTo(stroke.path[i].x, stroke.path[i].y);
          context.closePath();
          context.stroke();
        }
      });
    },
    [strokeList]
  );

  return (
    <div className={cls.container}>
      <span className={cls.userName}>{userName}</span>
      <canvas
        tabIndex={1}
        width={width}
        height={height}
        ref={canvasRef}
        className={cls.canvas}
      ></canvas>
    </div>
  );
};

export default RemoteCanvas;
