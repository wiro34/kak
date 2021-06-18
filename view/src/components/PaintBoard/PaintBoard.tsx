/** @format */

import React, { useState } from "react";
import DrawableCanvas from "../../components/DrawableCanvas/DrawableCanvas";
import PaletteBoard from "../../components/Palette/Palette";
import {
  Coordinate,
  DEFAULT_STROKE_STYLE,
  Stroke,
  StrokeStyle,
} from "../../lib/Stroke";
import cls from "./PaintBoard.module.scss";

type Props = {
  onDraw?: (strokeStyle: StrokeStyle, coordinates: Coordinate[]) => void;
};

const PaintBoard = function ({ onDraw }: Props) {
  const [strokeStyle, setStrokeStyle] =
    useState<StrokeStyle>(DEFAULT_STROKE_STYLE);

  return (
    <div className={cls.paintBoard}>
      <PaletteBoard changePalette={(p) => setStrokeStyle(p)} />
      <DrawableCanvas strokeStyle={strokeStyle} />
    </div>
  );
};

export default PaintBoard;
