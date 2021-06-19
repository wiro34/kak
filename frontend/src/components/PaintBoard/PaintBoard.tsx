/** @format */

import React, { useState } from "react";
import { useCallback } from "react";
import DrawableCanvas from "../../components/DrawableCanvas/DrawableCanvas";
import PaletteBoard from "../../components/Palette/Palette";
import { useRoomContext } from "../../hooks/RoomService";
import { DEFAULT_STROKE_STYLE, Stroke, StrokeStyle } from "../../lib/Stroke";
import OverlayToolbar from "../OverlayToolbar/OverlayToolbar";
import cls from "./PaintBoard.module.scss";

const PaintBoard = function () {
  const roomContext = useRoomContext();
  const [strokeStyle, setStrokeStyle] =
    useState<StrokeStyle>(DEFAULT_STROKE_STYLE);

  const onStroke = useCallback(
    (stroke: Stroke) => {
      roomContext.sendStroke({ command: "draw", stroke });
    },
    [roomContext]
  );

  const onUndo = useCallback(() => {
    roomContext.sendStroke({ command: "undo" });
  }, [roomContext]);

  return (
    <div className={cls.paintBoard}>
      <PaletteBoard changePalette={(p) => setStrokeStyle(p)} />
      <div className={cls.canvasContainer}>
        <OverlayToolbar />
        <DrawableCanvas
          strokeStyle={strokeStyle}
          onStroke={onStroke}
          onUndo={onUndo}
        />
      </div>
    </div>
  );
};

export default PaintBoard;
