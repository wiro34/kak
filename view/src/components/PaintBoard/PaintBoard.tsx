/** @format */

import React, { useState } from "react";
import { useCallback } from "react";
import DrawableCanvas from "../../components/DrawableCanvas/DrawableCanvas";
import PaletteBoard from "../../components/Palette/Palette";
import { useRoomContext } from "../../context/RoomContext";
import { DEFAULT_STROKE_STYLE, Stroke, StrokeStyle } from "../../lib/Stroke";
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
      <DrawableCanvas
        strokeStyle={strokeStyle}
        onStroke={onStroke}
        onUndo={onUndo}
      />
    </div>
  );
};

export default PaintBoard;
