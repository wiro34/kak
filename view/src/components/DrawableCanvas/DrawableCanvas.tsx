/** @format */

import React, { useCallback, useEffect, useRef, useState } from "react";
import cls from "./DrawableCanvas.module.scss";
import Palette from "./Palette";

type Coordinate = {
  x: number;
  y: number;
};

type Props = {
  editable?: boolean;
};

const DrawableCanvas = function ({ editable }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [leaveInDrawing, setLeaveInDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Coordinate | undefined>(undefined);

  const startDraw = useCallback((event: MouseEvent) => {
    const coordinates = getCoordinates(event);
    if (coordinates) {
      setDrawing(true);
      setLastPoint(coordinates);
    }
  }, []);
  const doDrawing = useCallback(
    (event: MouseEvent) => {
      if (drawing) {
        const coordinates = getCoordinates(event);
        if (coordinates && lastPoint) {
          console.log("move", lastPoint, coordinates);
          drawLine(lastPoint, coordinates);
        }
        setLastPoint(coordinates);
      }
    },
    [drawing, lastPoint]
  );
  const stopDraw = useCallback((event: MouseEvent) => {
    setDrawing(false);
  }, []);
  const enterDraw = useCallback(
    (event: MouseEvent) => {
      if (leaveInDrawing) {
        setLastPoint(getCoordinates(event));
        setDrawing(true);
        setLeaveInDrawing(false);
      }
    },
    [leaveInDrawing, setLeaveInDrawing, setDrawing, setLeaveInDrawing]
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
  }, [startDraw, doDrawing, stopDraw]);

  const drawLine = (
    originalMousePosition: Coordinate,
    newMousePosition: Coordinate
  ) => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext("2d");
    if (context) {
      context.strokeStyle = "red";
      context.lineJoin = "round";
      context.lineWidth = 5;

      context.beginPath();
      context.moveTo(originalMousePosition.x, originalMousePosition.y);
      context.lineTo(newMousePosition.x, newMousePosition.y);
      context.closePath();

      context.stroke();
    }
  };
  const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
    if (!canvasRef.current) {
      return;
    }

    const canvas: HTMLCanvasElement = canvasRef.current;
    return {
      x: event.pageX - canvas.offsetLeft,
      y: event.pageY - canvas.offsetTop,
    };
  };

  return (
    <div>
      <Palette />
      <canvas
        width="640"
        height="480"
        ref={canvasRef}
        className={cls.canvas}
      ></canvas>
    </div>
  );
};

export default DrawableCanvas;
