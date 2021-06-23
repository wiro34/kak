/** @format */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createTrigger, useTriggerEffect } from "../../hooks/useTrigger";
import { Coordinate, Stroke, StrokeStyle } from "../../lib/Stroke";
import FixedCanvas from "../FixedCanvas/FixedCanvas";

/**
 * DrawableCanvas コンポーネント外から Undo を実行するためのトリガ
 */
export const undoTrigger = createTrigger();

/**
 * DrawableCanvas コンポーネント外から Clear を実行するためのトリガ
 */
export const clearTrigger = createTrigger();

type Props = {
  width: number;
  height: number;
  strokeStyle: StrokeStyle;
  initialStrokeList: Stroke[];
  onStroke?: (stroke: Stroke) => void;
  onUndo?: () => void;
  onClear?: () => void;
};

/**
 * 描き込みできる Canvas
 */
const DrawableCanvas = function ({ width, height, strokeStyle, initialStrokeList, onStroke, onUndo, onClear }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokeList, setStrokeList] = useState<Stroke[]>(initialStrokeList);
  const [initialized, setInitialized] = useState(false);

  const refleshCanvas = useCallback(
    (strokeList: Stroke[], currentStroke?: Stroke) => {
      if (!canvasRef.current) {
        return;
      }
      const canvas: HTMLCanvasElement = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) {
        return;
      }

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);

      [...strokeList, currentStroke].forEach((stroke) => {
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
    },
    [canvasRef]
  );

  const undo = useCallback(() => {
    if (strokeList.length === 0) {
      return;
    }
    strokeList.pop();
    setStrokeList(strokeList);
    if (onUndo) {
      onUndo();
    }
    refleshCanvas(strokeList);
  }, [onUndo, strokeList, setStrokeList, refleshCanvas]);

  const clear = useCallback(() => {
    if (strokeList.length === 0) {
      return;
    }
    setStrokeList([]);
    if (onClear) {
      onClear();
    }
    refleshCanvas([]);
  }, [onClear, strokeList, setStrokeList, refleshCanvas]);

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
      event.preventDefault();
      if (drawing) {
        stopDraw(event);
      }
      const coordinate = getCoordinate(event);
      drawing = true;
      lastPoint = coordinate;
      stroke = { style: strokeStyle, path: [coordinate] };
    };
    const stopDraw = (event: MouseEvent) => {
      event.preventDefault();
      if (stroke) {
        setStrokeList([...strokeList, stroke]);
        if (onStroke) {
          onStroke(stroke);
        }
        stroke = undefined;
      }
      drawing = false;
    };

    const doDrawing = (event: MouseEvent) => {
      event.preventDefault();
      if (drawing) {
        const coordinate = getCoordinate(event);
        if (lastPoint) {
          if (stroke) {
            stroke.path.push(coordinate);
          }
          drawLine(strokeStyle, lastPoint, coordinate);
        }
        lastPoint = coordinate;
      }
    };

    const enterDraw = (event: MouseEvent) => {
      if (leaveInDrawing) {
        lastPoint = getCoordinate(event);
        if (stroke) {
          stroke.path.push(lastPoint);
        }
        drawing = true;
        leaveInDrawing = false;
      }
    };
    const leaveDraw = (event: MouseEvent) => {
      if (drawing) {
        lastPoint = getCoordinate(event);
        if (stroke) {
          stroke.path.push(lastPoint);
        }
        leaveInDrawing = true;
        drawing = false;
      }
    };

    const keydown = (event: KeyboardEvent) => {
      if (event.key === "z" && (event.ctrlKey || event.metaKey)) {
        undo();
      }
    };

    const drawLine = (strokeStyle: StrokeStyle, startPoint: Coordinate, endPoint: Coordinate) => {
      if (!canvasRef.current) {
        return;
      }
      const canvas: HTMLCanvasElement = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) {
        return;
      }

      context.strokeStyle = strokeStyle.color.code;
      context.lineJoin = "round";
      context.lineWidth = strokeStyle.brush.width;

      context.beginPath();
      context.moveTo(startPoint.x, startPoint.y);
      context.lineTo(endPoint.x, endPoint.y);
      context.closePath();
      context.stroke();
    };

    const getCoordinate = (event: MouseEvent): Coordinate => {
      return {
        x: event.offsetX,
        y: event.offsetY,
      };
    };

    const canvas: HTMLCanvasElement = canvasRef.current;

    if (!initialized) {
      refleshCanvas(strokeList);
      setInitialized(true);
    }

    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", doDrawing);
    canvas.addEventListener("mouseup", stopDraw);
    canvas.addEventListener("mouseenter", enterDraw);
    canvas.addEventListener("mouseleave", leaveDraw);
    canvas.addEventListener("keydown", keydown);
    document.addEventListener("mouseup", stopDraw);
    return () => {
      canvas.removeEventListener("mousedown", startDraw);
      canvas.removeEventListener("mousemove", doDrawing);
      canvas.removeEventListener("mouseup", stopDraw);
      canvas.removeEventListener("mouseenter", enterDraw);
      canvas.removeEventListener("mouseleave", leaveDraw);
      canvas.removeEventListener("keydown", keydown);
      document.removeEventListener("mouseup", stopDraw);
    };
  }, [onStroke, onUndo, strokeList, setStrokeList, strokeStyle, undo, refleshCanvas, initialized, setInitialized]);

  useTriggerEffect(() => {
    undo();
  }, undoTrigger);

  useTriggerEffect(() => {
    clear();
  }, clearTrigger);

  return <FixedCanvas tabIndex={1} width={width} height={height} ref={canvasRef} />;
};

export default DrawableCanvas;
