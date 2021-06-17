/** @format */

import React, { useCallback, useState } from "react";
import {
  BLACK,
  DEFAULT_STROKE_STYLE,
  StrokeStyle,
  UsableColors,
} from "../../lib/StrokeStyle";
import cls from "./Palette.module.scss";

type Props = {
  changePalette: (palette: StrokeStyle) => void;
};

const PaletteBoard = function ({ changePalette }: Props) {
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
    [changePalette, palette, setPalette]
  );
  return (
    <div>
      <div className={cls.colorPaletteContainer}>
        {UsableColors.map(({ name, code }) => (
          <span
            style={{ backgroundColor: code }}
            key={name}
            onClick={() => changeColor(name)}
          />
        ))}
      </div>
    </div>
  );
};

export default PaletteBoard;
