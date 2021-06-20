/** @format */

import React, { useState } from "react";
import { useCallback } from "react";
import DrawableCanvas, { clearTrigger, undoTrigger } from "../../components/DrawableCanvas/DrawableCanvas";
import Palette from "../../components/Palette/Palette";
import { useRoomContext } from "../../lib/RoomService/context";
import { DEFAULT_STROKE_STYLE, Stroke, StrokeStyle } from "../../lib/Stroke";
import OverlayToolbar from "../OverlayToolbar/OverlayToolbar";
import CommandBoard from "./CommandBoard";
import cls from "./PaintBoard.module.scss";

const PaintBoard = function () {
  const { roomState, sendStroke, sendClear } = useRoomContext();
  const [strokeStyle, setStrokeStyle] = useState<StrokeStyle>(DEFAULT_STROKE_STYLE);

  const onStroke = useCallback(
    (stroke: Stroke) => {
      sendStroke({ command: "draw", stroke });
    },
    [sendStroke]
  );

  const onCommand = (command: string) => {
    switch (command) {
      case "undo":
        undoTrigger();
        break;
      case "clear":
        clearTrigger();
        break;
    }
  };

  const onUndo = useCallback(() => {
    sendStroke({ command: "undo" });
  }, [sendStroke]);

  const onClear = useCallback(() => {
    sendClear();
  }, [sendClear]);

  const myData = roomState.users.find((user) => user.name === roomState.name);
  return (
    <div className={cls.paintBoard}>
      <div className={cls.sidePane}>
        <Palette changePalette={(p) => setStrokeStyle(p)} />
        <CommandBoard onCommand={onCommand} />
      </div>
      <div className={cls.mainPane}>
        <div className={cls.canvasContainer}>
          <OverlayToolbar />
          <DrawableCanvas
            strokeStyle={strokeStyle}
            initialStrokeList={myData ? myData.strokeList : []}
            onStroke={onStroke}
            onUndo={onUndo}
            onClear={onClear}
          />
        </div>
      </div>
    </div>
  );
};

export default PaintBoard;
