/** @format */

import clsx from "clsx";
import React, { useCallback, useState } from "react";
import {
  Brush,
  DEFAULT_STROKE_STYLE,
  StrokeStyle,
  UsableBrushes,
  UsableColors,
} from "../../lib/Stroke";
import cls from "./Palette.module.scss";

type Props = {
  changePalette: (palette: StrokeStyle) => void;
};

const Palette = function ({ changePalette }: Props) {
  const [palette, setPalette] = useState<StrokeStyle>(DEFAULT_STROKE_STYLE);
  const changeColor = useCallback(
    (name: string) => {
      const foundColor = UsableColors.find((c) => c.name === name);
      if (foundColor) {
        const newPalette = { ...palette, color: foundColor };
        setPalette(newPalette);
        changePalette(newPalette);
      }
    },
    [changePalette, setPalette, palette]
  );

  const changeBrush = useCallback(
    (brush: string) => {
      const foundBrush = UsableBrushes.find((b) => b.name === brush);
      if (foundBrush) {
        console.log("found");
        const newPalette = { ...palette, brush: foundBrush };
        setPalette(newPalette);
        changePalette(newPalette);
      }
    },
    [changePalette, setPalette, palette]
  );

  return (
    <div className={cls.paletteContainer}>
      <div className={cls.colorPalette}>
        {UsableColors.map(({ name, code }) => (
          <span
            style={{ backgroundColor: code }}
            key={name}
            onClick={() => changeColor(name)}
          />
        ))}
        <span
          className={cls.currentColor}
          style={{ backgroundColor: palette.color.code }}
        ></span>
      </div>

      <div className={cls.brushPalette}>
        {UsableBrushes.map((brush) => (
          <span
            className={clsx({
              [cls[`brush-${brush.name}`]]: true,
              [cls.current]: brush.name === palette.brush.name,
            })}
            onClick={() => changeBrush(brush.name)}
            key={brush.name}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Palette;
