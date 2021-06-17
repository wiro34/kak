/** @format */

import React, { useCallback, useEffect, useRef, useState } from "react";
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
  const [drawing, setDrawing] = useState(false);
  const [leaveInDrawing, setLeaveInDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Coordinate | undefined>(undefined);
  const [stroke, setStroke] = useState<Stroke | undefined>(undefined);
  const [strokeList, setStrokeList] = useState<Stroke[]>([]);

  const startDraw = useCallback(
    (event: MouseEvent) => {
      const coordinate = getCoordinate(event);
      if (coordinate) {
        setDrawing(true);
        setLastPoint(coordinate);
        setStroke({ strokeStyle, path: [coordinate] });
      }
    },
    [setDrawing, setLastPoint, setStrokeList, strokeStyle]
  );
  const doDrawing = useCallback(
    (event: MouseEvent) => {
      if (drawing) {
        const coordinate = getCoordinate(event);
        if (coordinate && lastPoint) {
          // console.log("move", lastPoint, coordinate);
          if (stroke) {
            setStroke({
              ...stroke,
              path: [...stroke.path, coordinate],
            });
          }
          // drawLine(strokeStyle, lastPoint, coordinate);
          refleshCanvas(stroke);

          if (onDraw) {
            onDraw(strokeStyle, [lastPoint, coordinate]);
          }
        }
        setLastPoint(coordinate);
      }
    },
    [drawing, lastPoint, strokeStyle, onDraw]
  );
  const stopDraw = useCallback(
    (event: MouseEvent) => {
      setDrawing(false);
      if (stroke) {
        setStrokeList([...strokeList, stroke]);
        setStroke(undefined);
        console.log(strokeList);
      }
    },
    [setDrawing, setStrokeList, strokeList, stroke, setStroke]
  );
  const enterDraw = useCallback(
    (event: MouseEvent) => {
      if (leaveInDrawing) {
        setLastPoint(getCoordinate(event));
        setDrawing(true);
        setLeaveInDrawing(false);
      }
    },
    [leaveInDrawing, setLeaveInDrawing, setDrawing]
  );
  const leaveDraw = useCallback(
    (event: MouseEvent) => {
      if (drawing) {
        setLeaveInDrawing(true);
        setDrawing(false);
      }
    },
    [drawing, setLeaveInDrawing, setDrawing]
  );

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", doDrawing);
    canvas.addEventListener("mouseup", stopDraw);
    canvas.addEventListener("mouseenter", enterDraw);
    canvas.addEventListener("mouseleave", leaveDraw);
    return () => {
      canvas.removeEventListener("mousedown", startDraw);
      canvas.removeEventListener("mousemove", doDrawing);
      canvas.removeEventListener("mouseup", stopDraw);
      canvas.removeEventListener("mouseenter", enterDraw);
      canvas.removeEventListener("mouseleave", leaveDraw);
    };
  }, [startDraw, doDrawing, stopDraw, enterDraw, leaveDraw]);

  const drawLine = (
    strokeStyle: StrokeStyle,
    startPoint: Coordinate,
    endPoint: Coordinate
  ) => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.imageSmoothingEnabled = false;
    context.strokeStyle = strokeStyle.color.code;
    context.lineJoin = "round";
    context.lineWidth = 5;

    context.beginPath();
    context.moveTo(startPoint.x, startPoint.y);
    context.lineTo(endPoint.x, endPoint.y);
    context.closePath();
    context.stroke();
  };

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
    if (drawing) {
    } else {
      strokeList.pop();
      setStrokeList(strokeList);
      console.log(strokeList);
      refleshCanvas();
    }
  };

  return (
    <div>
      <canvas
        width="640"
        height="480"
        ref={canvasRef}
        className={cls.canvas}
      ></canvas>
      <button onClick={undo}>undo</button>
    </div>
  );
};

export default DrawableCanvas;
