/** @format */

import React, { useState } from "react";
import { useCallback } from "react";
import DrawableCanvas, { clearTrigger, undoTrigger } from "../../components/DrawableCanvas/DrawableCanvas";
import Palette from "./Palette/Palette";
import { useRoomContext } from "../../lib/RoomService/context";
import { DEFAULT_STROKE_STYLE, Stroke, StrokeStyle } from "../../lib/Stroke";
import ToolBoard from "./ToolBoard/ToolBoard";
import CommandBoard from "./CommandBoard/CommandBoard";
import cls from "./PaintBoard.module.scss";
import clsx from "clsx";

type Props = {
  className?: string;
};

const PaintBoard = function ({ className }: Props) {
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

  const myData = roomState.users.find((user) => user.id === roomState.id);
  return (
    <div className={clsx(className, cls.paintBoard)}>
      <DrawableCanvas
        width={640}
        height={480}
        strokeStyle={strokeStyle}
        initialStrokeList={myData ? myData.strokeList : []}
        onStroke={onStroke}
        onUndo={onUndo}
        onClear={onClear}
      />
      <div className={cls.tools}>
        <Palette changePalette={(p) => setStrokeStyle(p)} />
        <CommandBoard onCommand={onCommand} />
        <ToolBoard />
      </div>
    </div>
  );
};

export default PaintBoard;
