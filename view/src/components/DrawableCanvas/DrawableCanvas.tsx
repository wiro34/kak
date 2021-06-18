/** @format */

import React, { useEffect, useRef, useState } from "react";
import cls from "./DrawableCanvas.module.scss";
import { StrokeStyle } from "../../lib/StrokeStyle";

type Coordinate = {
  x: number;
  y: number;
};

type Stroke = {
  strokeStyle: StrokeStyle;
  path: Coordinate[];
};

type Props = {
  strokeStyle: StrokeStyle;
  editable?: boolean;
  onDraw?: (strokeStyle: StrokeStyle, coordinates: Coordinate[]) => void;
};

/**
 * 描き込みできる Canvas
 */
const DrawableCanvas = function ({ strokeStyle, editable, onDraw }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokeList, setStrokeList] = useState<Stroke[]>([]);

  console.log("render", strokeList);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    // 負荷削減のため状態保存に state ではなく素の変数を使用する
    let drawing = false;
    let leaveInDrawing = false;
    let lastPoint: Coordinate | undefined = undefined;
    let stroke: Stroke | undefined = undefined;

    const startDraw = (event: MouseEvent) => {
      if (drawing) {
        stopDraw(event);
      }
      const coordinate = getCoordinate(event);
      if (coordinate) {
        drawing = true;
        lastPoint = coordinate;
        stroke = { strokeStyle, path: [coordinate] };
      }
    };
    const stopDraw = (event: MouseEvent) => {
      if (stroke) {
        setStrokeList([...strokeList, stroke]);
        console.log(stroke, strokeList);
        stroke = undefined;
      }
    };

    const doDrawing = (event: MouseEvent) => {
      if (drawing) {
        const coordinate = getCoordinate(event);
        if (coordinate && lastPoint) {
          console.log(stroke);
          // console.log("move", lastPoint, coordinate);
          if (stroke) {
            stroke.path.push(coordinate);
          }
          // drawLine(strokeStyle, lastPoint, coordinate);
          refleshCanvas(stroke);

          if (onDraw) {
            onDraw(strokeStyle, [lastPoint, coordinate]);
          }
        }
        lastPoint = coordinate;
      }
    };

    const enterDraw = (event: MouseEvent) => {
      if (leaveInDrawing) {
        lastPoint = getCoordinate(event);
        if (stroke && lastPoint) {
          stroke.path.push(lastPoint);
        }
        drawing = true;
        leaveInDrawing = false;
      }
    };
    const leaveDraw = (event: MouseEvent) => {
      if (drawing) {
        lastPoint = getCoordinate(event);
        if (stroke && lastPoint) {
          stroke.path.push(lastPoint);
        }
        leaveInDrawing = true;
        drawing = false;
      }
    };

    const keydown = (event: KeyboardEvent) => {
      console.log(event);
      if (event.key === "z" && (event.ctrlKey || event.metaKey)) {
        undo();
      }
    };

    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", doDrawing);
    canvas.addEventListener("mouseup", stopDraw);
    canvas.addEventListener("mouseenter", enterDraw);
    canvas.addEventListener("mouseleave", leaveDraw);
    canvas.addEventListener("keydown", keydown);
    return () => {
      canvas.removeEventListener("mousedown", startDraw);
      canvas.removeEventListener("mousemove", doDrawing);
      canvas.removeEventListener("mouseup", stopDraw);
      canvas.removeEventListener("mouseenter", enterDraw);
      canvas.removeEventListener("mouseleave", leaveDraw);
      canvas.removeEventListener("keydown", keydown);
    };
  }, [onDraw, strokeList, setStrokeList]);
  // }, [startDraw, doDrawing, stopDraw, enterDraw, leaveDraw]);

  const refleshCanvas = (currentStroke?: Stroke) => {
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
      context.lineWidth = 5;

      for (let i = 1; i < stroke.path.length; i++) {
        context.beginPath();
        context.moveTo(stroke.path[i - 1].x, stroke.path[i - 1].y);
        context.lineTo(stroke.path[i].x, stroke.path[i].y);
        context.closePath();
        context.stroke();
      }
    });
  };

  const getCoordinate = (event: MouseEvent): Coordinate | undefined => {
    if (!canvasRef.current) {
      return;
    }

    const canvas: HTMLCanvasElement = canvasRef.current;
    return {
      x: event.pageX - canvas.offsetLeft,
      y: event.pageY - canvas.offsetTop,
    };
  };

  const undo = () => {
    // if (drawing) {
    // } else {
    strokeList.pop();
    setStrokeList(strokeList);
    console.log(strokeList);
    refleshCanvas();
    // }
  };

  return (
    <div>
      <canvas tabIndex={1} width="640" height="480" ref={canvasRef} className={cls.canvas}></canvas>
      <button onClick={undo}>undo</button>
    </div>
  );
};

export default DrawableCanvas;
