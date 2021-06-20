/** @format */

import React, { useState } from "react";
import { useCallback } from "react";
import DrawableCanvas from "../../components/DrawableCanvas/DrawableCanvas";
import PaletteBoard from "../../components/Palette/Palette";
import { useRoomContext } from "../../lib/RoomService/context";
import { DEFAULT_STROKE_STYLE, Stroke, StrokeStyle } from "../../lib/Stroke";
import OverlayToolbar from "../OverlayToolbar/OverlayToolbar";
import cls from "./PaintBoard.module.scss";

const PaintBoard = function () {
  const { roomState, sendStroke } = useRoomContext();
  const [strokeStyle, setStrokeStyle] = useState<StrokeStyle>(DEFAULT_STROKE_STYLE);

  const onStroke = useCallback(
    (stroke: Stroke) => {
      sendStroke({ command: "draw", stroke });
    },
    [sendStroke]
  );

  const onUndo = useCallback(() => {
    sendStroke({ command: "undo" });
  }, [sendStroke]);

  const myData = roomState.users.find((user) => user.name === roomState.name);
  // console.log(myData);

  return (
    <div className={cls.paintBoard}>
      <PaletteBoard changePalette={(p) => setStrokeStyle(p)} />
      <div className={cls.canvasContainer}>
        <OverlayToolbar />
        <DrawableCanvas
          strokeStyle={strokeStyle}
          initialStrokeList={myData ? myData.strokeList : []}
          onStroke={onStroke}
          onUndo={onUndo}
        />
      </div>
    </div>
  );
};

export default PaintBoard;
